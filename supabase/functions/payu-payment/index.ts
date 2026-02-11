import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const InitiateSchema = z.object({
  action: z.literal("initiate"),
  amount: z.number().positive().max(10000000),
  productInfo: z.string().min(1).max(500),
  firstName: z.string().min(1).max(200),
  email: z.string().max(255).refine((v) => EMAIL_REGEX.test(v), { message: "Invalid email" }),
  phone: z.string().max(15).default(""),
  userId: z.string().uuid().optional(),
  plan: z.enum(["starter", "business", "enterprise"]),
});

const VerifySchema = z.object({
  action: z.literal("verify"),
  txnid: z.string().min(1).max(200),
  status: z.string().min(1).max(50),
  mihpayid: z.string().max(200).optional(),
  hash: z.string().max(200).optional(),
  amount: z.string().max(50).optional(),
  productinfo: z.string().max(500).optional(),
  firstname: z.string().max(200).optional(),
  email: z.string().max(255).optional(),
  udf1: z.string().uuid().optional(),
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.substring(7);
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: claims, error: claimsError } = await authClient.auth.getClaims(token);

    if (claimsError || !claims?.claims?.sub) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const authenticatedUserId = claims.claims.sub as string;

    const PAYU_MERCHANT_KEY = Deno.env.get("PAYU_MERCHANT_KEY");
    const PAYU_MERCHANT_SALT = Deno.env.get("PAYU_MERCHANT_SALT");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!PAYU_MERCHANT_KEY || !PAYU_MERCHANT_SALT) {
      return new Response(
        JSON.stringify({ error: "PayU credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const rawBody = await req.json();
    const { action } = rawBody;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    if (action === "initiate") {
      const parsed = InitiateSchema.safeParse(rawBody);
      if (!parsed.success) {
        return new Response(
          JSON.stringify({ error: "Validation failed", details: parsed.error.flatten() }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { amount, productInfo, firstName, email, phone, plan } = parsed.data;

      // Verify userId matches token
      if (parsed.data.userId && parsed.data.userId !== authenticatedUserId) {
        return new Response(
          JSON.stringify({ error: "Unauthorized - user ID mismatch" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const txnid = `TXN${Date.now()}${Math.random().toString(36).substring(7)}`;

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({ user_id: authenticatedUserId, amount_cents: Math.round(amount * 100), plan, status: "pending", billing_cycle: "monthly" })
        .select()
        .single();

      if (orderError) {
        return new Response(
          JSON.stringify({ error: "Failed to create order" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const params: Record<string, string> = {
        key: PAYU_MERCHANT_KEY,
        txnid,
        amount: amount.toString(),
        productinfo: productInfo,
        firstname: firstName,
        email,
        phone: phone || "",
        surl: `${req.headers.get("origin") || ""}/billing?payment=success`,
        furl: `${req.headers.get("origin") || ""}/billing?payment=failed`,
        udf1: order.id,
        udf2: authenticatedUserId,
        udf3: plan,
      };

      const hashString = `${params.key}|${params.txnid}|${params.amount}|${params.productinfo}|${params.firstname}|${params.email}|||||||||||${PAYU_MERCHANT_SALT}`;
      const hashBuffer = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(hashString));
      params.hash = Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");

      await supabase.from("orders").update({ stripe_payment_intent_id: txnid }).eq("id", order.id);

      return new Response(
        JSON.stringify({ paymentUrl: "https://secure.payu.in/_payment", params, orderId: order.id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
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

      const { txnid, status, mihpayid, hash: receivedHash, amount, productinfo, firstname, email, udf1 } = parsed.data;

      if (receivedHash && amount && productinfo && firstname && email) {
        const reverseHashString = `${PAYU_MERCHANT_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${PAYU_MERCHANT_KEY}`;
        const hashBuffer = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(reverseHashString));
        const calculatedHash = Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");

        if (calculatedHash !== receivedHash) {
          return new Response(
            JSON.stringify({ error: "Hash verification failed", success: false }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      const orderId = udf1;
      if (!orderId) {
        return new Response(
          JSON.stringify({ error: "Missing order reference" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const newStatus = status === "success" ? "paid" : "failed";

      const { data: orderData, error: updateError } = await supabase
        .from("orders")
        .update({ status: newStatus, paid_at: status === "success" ? new Date().toISOString() : null })
        .eq("id", orderId)
        .select()
        .single();

      if (updateError || !orderData) {
        return new Response(
          JSON.stringify({ error: "Failed to update order" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (orderData.user_id !== authenticatedUserId) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (status === "success") {
        await supabase.from("profiles").update({ subscription_plan: orderData.plan }).eq("id", orderData.user_id);
        await supabase.from("activity_log").insert({ user_id: orderData.user_id, action: "subscription_upgraded", details: { plan: orderData.plan, payment_id: mihpayid } });
        await supabase.from("notifications").insert({ user_id: orderData.user_id, type: "payment", title: "Payment Successful", message: `Your subscription has been upgraded to ${orderData.plan} plan.` });
      }

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
