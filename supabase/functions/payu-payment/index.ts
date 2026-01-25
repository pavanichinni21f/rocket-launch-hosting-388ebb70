import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PayUPaymentRequest {
  amount: number;
  productInfo: string;
  firstName: string;
  email: string;
  phone: string;
  userId: string;
  plan: string;
}

// JWT verification helper
async function verifyJWT(token: string, supabaseUrl: string): Promise<{ sub: string; email: string } | null> {
  try {
    const supabase = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY") || "");
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return null;
    }
    
    return { sub: user.id, email: user.email || "" };
  } catch (err) {
    console.error("JWT verification error:", err);
    return null;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract and verify JWT from Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.substring(7);
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const user = await verifyJWT(token, SUPABASE_URL!);

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const PAYU_MERCHANT_KEY = Deno.env.get("PAYU_MERCHANT_KEY");
    const PAYU_MERCHANT_SALT = Deno.env.get("PAYU_MERCHANT_SALT");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!PAYU_MERCHANT_KEY || !PAYU_MERCHANT_SALT) {
      console.error("PayU credentials not configured");
      return new Response(
        JSON.stringify({ error: "PayU credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify user ID matches token
    const body = await req.json();
    const { action, ...requestBody } = body;
    const requestUserId = requestBody.userId;

    if (requestUserId && requestUserId !== user.sub) {
      console.error("User ID mismatch - potential security issue");
      return new Response(
        JSON.stringify({ error: "Unauthorized - user ID mismatch" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    if (action === "initiate") {
      const { amount, productInfo, firstName, email, phone, userId, plan } = requestBody as PayUPaymentRequest;

      // Double-check authorization
      if (userId !== user.sub) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Generate unique transaction ID
      const txnid = `TXN${Date.now()}${Math.random().toString(36).substring(7)}`;

      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          amount_cents: Math.round(amount * 100),
          plan: plan,
          status: "pending",
          billing_cycle: "monthly",
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

      // PayU parameters
      const params: Record<string, string> = {
        key: PAYU_MERCHANT_KEY,
        txnid: txnid,
        amount: amount.toString(),
        productinfo: productInfo,
        firstname: firstName,
        email: email,
        phone: phone || "",
        surl: `${req.headers.get("origin") || ""}/billing?payment=success`,
        furl: `${req.headers.get("origin") || ""}/billing?payment=failed`,
        udf1: order.id, // Store order ID for reference
        udf2: userId,
        udf3: plan,
      };

      // Generate hash using SHA-512
      const hashString = `${params.key}|${params.txnid}|${params.amount}|${params.productinfo}|${params.firstname}|${params.email}|||||||||||${PAYU_MERCHANT_SALT}`;
      const encoder = new TextEncoder();
      const data = encoder.encode(hashString);
      const hashBuffer = await crypto.subtle.digest("SHA-512", data);
      const hash = Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      params.hash = hash;

      // Update order with transaction ID
      await supabase
        .from("orders")
        .update({ stripe_payment_intent_id: txnid }) // Using this field for PayU txnid
        .eq("id", order.id);

      console.log("PayU payment initiated for order:", order.id);

      return new Response(
        JSON.stringify({
          paymentUrl: "https://secure.payu.in/_payment", // Use https://test.payu.in/_payment for testing
          params,
          orderId: order.id,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "verify") {
      const { txnid, status, mihpayid, hash: receivedHash, amount, productinfo, firstname, email, udf1 } = requestBody;

      // Verify hash (reverse hash for response)
      const reverseHashString = `${PAYU_MERCHANT_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${PAYU_MERCHANT_KEY}`;
      const encoder = new TextEncoder();
      const data = encoder.encode(reverseHashString);
      const hashBuffer = await crypto.subtle.digest("SHA-512", data);
      const calculatedHash = Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      if (calculatedHash !== receivedHash) {
        console.error("Hash verification failed");
        return new Response(
          JSON.stringify({ error: "Hash verification failed", success: false }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Update order status
      const orderId = udf1;
      const newStatus = status === "success" ? "paid" : "failed";

      const { data: orderData, error: updateError } = await supabase
        .from("orders")
        .update({
          status: newStatus,
          paid_at: status === "success" ? new Date().toISOString() : null,
        })
        .eq("id", orderId)
        .select()
        .single();

      if (updateError) {
        console.error("Order update error:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update order" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Verify the order belongs to the authenticated user
      if (orderData.user_id !== user.sub) {
        console.error("Order user mismatch - potential security issue");
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // If payment successful, update user's subscription
      if (status === "success") {
        const { data: updatedProfile } = await supabase
          .from("profiles")
          .update({ subscription_plan: orderData.plan })
          .eq("id", orderData.user_id)
          .select()
          .single();

        // Log activity
        await supabase
          .from("activity_log")
          .insert({
            user_id: orderData.user_id,
            action: "subscription_upgraded",
            details: { plan: orderData.plan, payment_id: mihpayid },
          });

        // Create notification
        await supabase
          .from("notifications")
          .insert({
            user_id: orderData.user_id,
            type: "payment",
            title: "Payment Successful",
            message: `Your subscription has been upgraded to ${orderData.plan} plan.`,
          });
      }

      console.log("PayU payment verified:", { orderId, status: newStatus });

      return new Response(
        JSON.stringify({ success: status === "success", orderId }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("PayU payment error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});