import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  provider: 'payu' | 'cashfree' | 'upi' | 'gpay';
  amount: number;
  productInfo: string;
  customerName: string;
  email: string;
  phone: string;
  userId: string;
  plan: string;
  upiId?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PAYU_MERCHANT_KEY = Deno.env.get("PAYU_MERCHANT_KEY");
    const PAYU_MERCHANT_SALT = Deno.env.get("PAYU_MERCHANT_SALT");
    const CASHFREE_APP_ID = Deno.env.get("CASHFREE_APP_ID");
    const CASHFREE_SECRET_KEY = Deno.env.get("CASHFREE_SECRET_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const { action, ...body } = await req.json();

    console.log("Indian payment action:", action, "provider:", body.provider);

    if (action === "initiate") {
      const { provider, amount, productInfo, customerName, email, phone, userId, plan, upiId } = body as PaymentRequest;
      
      // Generate unique transaction ID
      const txnId = `TXN${Date.now()}${Math.random().toString(36).substring(7)}`;
      const origin = req.headers.get("origin") || "";

      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          amount_cents: Math.round(amount * 100),
          plan: plan,
          status: "pending",
          billing_cycle: "monthly",
          stripe_payment_intent_id: txnId, // Using for txn reference
        })
        .select()
        .single();

      if (orderError) {
        console.error("Order creation error:", orderError);
        return new Response(
          JSON.stringify({ error: "Failed to create order" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Provider-specific handling
      if (provider === 'payu') {
        if (!PAYU_MERCHANT_KEY || !PAYU_MERCHANT_SALT) {
          // Mock PayU response for testing
          return new Response(
            JSON.stringify({
              success: true,
              provider: 'payu',
              mockMode: true,
              orderId: order.id,
              txnId,
              paymentUrl: `${origin}/billing?payment=success&mock=true`,
              message: "PayU credentials not configured - using mock mode"
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const params: Record<string, string> = {
          key: PAYU_MERCHANT_KEY,
          txnid: txnId,
          amount: amount.toString(),
          productinfo: productInfo,
          firstname: customerName,
          email: email,
          phone: phone || "",
          surl: `${origin}/billing?payment=success&provider=payu`,
          furl: `${origin}/billing?payment=failed&provider=payu`,
          udf1: order.id,
          udf2: userId,
          udf3: plan,
        };

        const hashString = `${params.key}|${params.txnid}|${params.amount}|${params.productinfo}|${params.firstname}|${params.email}|||||||||||${PAYU_MERCHANT_SALT}`;
        const encoder = new TextEncoder();
        const data = encoder.encode(hashString);
        const hashBuffer = await crypto.subtle.digest("SHA-512", data);
        const hash = Array.from(new Uint8Array(hashBuffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');

        params.hash = hash;

        return new Response(
          JSON.stringify({
            success: true,
            provider: 'payu',
            paymentUrl: "https://secure.payu.in/_payment",
            params,
            orderId: order.id,
            txnId,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (provider === 'cashfree') {
        if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
          // Mock Cashfree response
          return new Response(
            JSON.stringify({
              success: true,
              provider: 'cashfree',
              mockMode: true,
              orderId: order.id,
              txnId,
              paymentUrl: `${origin}/billing?payment=success&mock=true`,
              message: "Cashfree credentials not configured - using mock mode"
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Cashfree API integration would go here
        // For now, return mock successful response
        return new Response(
          JSON.stringify({
            success: true,
            provider: 'cashfree',
            orderId: order.id,
            txnId,
            paymentUrl: `${origin}/billing?payment=success&provider=cashfree`,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (provider === 'upi' || provider === 'gpay') {
        // UPI/GPay intent URL generation
        const upiUrl = `upi://pay?pa=${upiId || 'merchant@upi'}&pn=KSFoundation&am=${amount}&cu=INR&tn=${encodeURIComponent(productInfo)}&tr=${txnId}`;
        
        return new Response(
          JSON.stringify({
            success: true,
            provider: provider,
            orderId: order.id,
            txnId,
            upiUrl,
            qrData: upiUrl,
            // For GPay specifically
            gpayDeepLink: provider === 'gpay' 
              ? `gpay://upi/pay?pa=${upiId || 'merchant@upi'}&pn=KSFoundation&am=${amount}&cu=INR&tn=${encodeURIComponent(productInfo)}&tr=${txnId}`
              : undefined,
            message: "Scan QR code or use UPI app to complete payment",
            callbackUrl: `${origin}/billing?payment=pending&txnId=${txnId}&orderId=${order.id}`,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Invalid payment provider" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "verify") {
      const { txnId, orderId, status, provider } = body;

      // Update order status based on verification
      const newStatus = status === "success" ? "paid" : status === "pending" ? "pending" : "failed";

      const { error: updateError } = await supabase
        .from("orders")
        .update({
          status: newStatus,
          paid_at: status === "success" ? new Date().toISOString() : null,
        })
        .eq("id", orderId);

      if (updateError) {
        console.error("Order update error:", updateError);
      }

      // If payment successful, update user's subscription
      if (status === "success") {
        const { data: orderData } = await supabase
          .from("orders")
          .select("user_id, plan")
          .eq("id", orderId)
          .single();

        if (orderData) {
          await supabase
            .from("profiles")
            .update({ subscription_plan: orderData.plan })
            .eq("id", orderData.user_id);

          await supabase
            .from("activity_log")
            .insert({
              user_id: orderData.user_id,
              action: "subscription_upgraded",
              details: { plan: orderData.plan, provider, txnId },
            });

          await supabase
            .from("notifications")
            .insert({
              user_id: orderData.user_id,
              type: "payment",
              title: "Payment Successful",
              message: `Your subscription has been upgraded to ${orderData.plan} plan via ${provider}.`,
            });
        }
      }

      return new Response(
        JSON.stringify({ success: status === "success", orderId, provider }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "check_status") {
      const { orderId } = body;
      
      const { data: order, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: "Order not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          status: order.status,
          paid: order.status === "paid",
          orderId: order.id 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Indian payment error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
