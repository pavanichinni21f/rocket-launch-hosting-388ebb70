import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(\+91)?[6-9]\d{9}$/;

const InitiateSchema = z.object({
  action: z.literal("initiate"),
  provider: z.enum(["payu", "cashfree", "upi", "gpay"]),
  amount: z.number().positive().max(10000000),
  productInfo: z.string().min(1).max(500),
  customerName: z.string().min(1).max(200),
  email: z.string().max(255).refine((v) => EMAIL_REGEX.test(v), { message: "Invalid email" }),
  phone: z.string().max(15).refine((v) => !v || PHONE_REGEX.test(v.replace(/\s/g, "")), { message: "Invalid phone" }).default(""),
  userId: z.string().uuid().optional(),
  plan: z.enum(["starter", "business", "enterprise"]),
  upiId: z.string().max(100).optional(),
});

const VerifySchema = z.object({
  action: z.literal("verify"),
  txnId: z.string().min(1).max(200),
  orderId: z.string().uuid(),
  status: z.enum(["success", "failed", "pending"]),
  provider: z.enum(["payu", "cashfree", "upi", "gpay"]),
});

const CheckStatusSchema = z.object({
  action: z.literal("check_status"),
  orderId: z.string().uuid(),
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // JWT Authentication
    const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - No valid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsError } = await authClient.auth.getClaims(token);

    if (claimsError || !claims?.claims?.sub) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const authenticatedUserId = claims.claims.sub as string;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const rawBody = await req.json();
    const { action } = rawBody;

    if (action === "initiate") {
      const parsed = InitiateSchema.safeParse(rawBody);
      if (!parsed.success) {
        return new Response(
          JSON.stringify({ error: "Validation failed", details: parsed.error.flatten() }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { provider, amount, productInfo, customerName, email, phone, plan, upiId } = parsed.data;
      const userId = authenticatedUserId;

      const txnId = `TXN${Date.now()}${Math.random().toString(36).substring(7)}`;
      const origin = req.headers.get("origin") || "";

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          amount_cents: Math.round(amount * 100),
          plan,
          status: "pending",
          billing_cycle: "monthly",
          stripe_payment_intent_id: txnId,
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

      console.log("Indian payment initiated:", { action, provider, userId, orderId: order.id });

      if (provider === "payu") {
        const PAYU_MERCHANT_KEY = Deno.env.get("PAYU_MERCHANT_KEY");
        const PAYU_MERCHANT_SALT = Deno.env.get("PAYU_MERCHANT_SALT");
        if (!PAYU_MERCHANT_KEY || !PAYU_MERCHANT_SALT) {
          return new Response(
            JSON.stringify({ error: "PayU credentials not configured. Contact support." }),
            { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const params: Record<string, string> = {
          key: PAYU_MERCHANT_KEY,
          txnid: txnId,
          amount: amount.toString(),
          productinfo: productInfo,
          firstname: customerName,
          email,
          phone: phone || "",
          surl: `${origin}/billing?payment=success&provider=payu`,
          furl: `${origin}/billing?payment=failed&provider=payu`,
          udf1: order.id,
          udf2: userId,
          udf3: plan,
        };

        const hashString = `${params.key}|${params.txnid}|${params.amount}|${params.productinfo}|${params.firstname}|${params.email}|||||||||||${PAYU_MERCHANT_SALT}`;
        const hashBuffer = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(hashString));
        params.hash = Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");

        return new Response(
          JSON.stringify({ success: true, provider: "payu", paymentUrl: "https://secure.payu.in/_payment", params, orderId: order.id, txnId }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (provider === "cashfree") {
        const CASHFREE_APP_ID = Deno.env.get("CASHFREE_APP_ID");
        if (!CASHFREE_APP_ID) {
          return new Response(
            JSON.stringify({ error: "Cashfree credentials not configured. Contact support." }),
            { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        return new Response(
          JSON.stringify({ success: true, provider: "cashfree", orderId: order.id, txnId, paymentUrl: "https://api.cashfree.com/pg/initiate_payment" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (provider === "upi" || provider === "gpay") {
        const merchantVpa = upiId || "merchant@upi";
        const encodedInfo = encodeURIComponent(productInfo);
        const upiUrl = `upi://pay?pa=${merchantVpa}&pn=KSFoundation&am=${amount}&cu=INR&tn=${encodedInfo}&tr=${txnId}`;

        return new Response(
          JSON.stringify({
            success: true,
            provider,
            orderId: order.id,
            txnId,
            upiUrl,
            qrData: upiUrl,
            gpayDeepLink: provider === "gpay" ? `gpay://upi/pay?pa=${merchantVpa}&pn=KSFoundation&am=${amount}&cu=INR&tn=${encodedInfo}&tr=${txnId}` : undefined,
            message: "Scan QR code or use UPI app to complete payment",
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
      const parsed = VerifySchema.safeParse(rawBody);
      if (!parsed.success) {
        return new Response(
          JSON.stringify({ error: "Validation failed", details: parsed.error.flatten() }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { orderId, status, provider } = parsed.data;
      const newStatus = status === "success" ? "paid" : status === "pending" ? "pending" : "failed";

      // Verify order belongs to authenticated user
      const { data: orderCheck } = await supabase.from("orders").select("user_id").eq("id", orderId).single();
      if (!orderCheck || orderCheck.user_id !== authenticatedUserId) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      await supabase.from("orders").update({ status: newStatus, paid_at: status === "success" ? new Date().toISOString() : null }).eq("id", orderId);

      if (status === "success") {
        const { data: orderData } = await supabase.from("orders").select("user_id, plan, amount_cents").eq("id", orderId).single();
        if (orderData) {
          await supabase.from("profiles").update({ subscription_plan: orderData.plan }).eq("id", orderData.user_id);
          await supabase.from("activity_log").insert({ user_id: orderData.user_id, action: "subscription_upgraded", details: { plan: orderData.plan, provider } });
          await supabase.from("notifications").insert({ user_id: orderData.user_id, type: "payment", title: "Payment Successful", message: `Your subscription has been upgraded to ${orderData.plan} plan via ${provider}.` });
        }
      }

      return new Response(
        JSON.stringify({ success: status === "success", orderId, provider }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "check_status") {
      const parsed = CheckStatusSchema.safeParse(rawBody);
      if (!parsed.success) {
        return new Response(
          JSON.stringify({ error: "Validation failed", details: parsed.error.flatten() }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data: order, error } = await supabase.from("orders").select("id, status, user_id").eq("id", parsed.data.orderId).single();
      if (error || !order) {
        return new Response(JSON.stringify({ error: "Order not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // Only allow checking own orders
      if (order.user_id !== authenticatedUserId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      return new Response(
        JSON.stringify({ success: true, status: order.status, paid: order.status === "paid", orderId: order.id }),
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
