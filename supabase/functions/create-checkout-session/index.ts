import Stripe from "https://esm.sh/stripe@14.0.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CheckoutSchema = z.object({
  userId: z.string().uuid().optional(),
  planName: z.enum(["starter", "business", "enterprise"]),
});

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2024-04-10",
});

const PLAN_PRICES: Record<string, { priceId: string; name: string; amount: number }> = {
  starter: { priceId: Deno.env.get("STRIPE_PRICE_STARTER") || "", name: "Starter", amount: 999 },
  business: { priceId: Deno.env.get("STRIPE_PRICE_BUSINESS") || "", name: "Business", amount: 1999 },
  enterprise: { priceId: Deno.env.get("STRIPE_PRICE_ENTERPRISE") || "", name: "Enterprise", amount: 19999 },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Missing token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";

    const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: authError } = await authClient.auth.getUser(token);

    if (authError || !userData?.user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const authenticatedUserId = userData.user.id;
    const userEmail = userData.user.email || "";

    // Validate input
    const rawBody = await req.json();
    const parsed = CheckoutSchema.safeParse(rawBody);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Validation failed", details: parsed.error.flatten() }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { userId, planName } = parsed.data;

    if (userId && userId !== authenticatedUserId) {
      return new Response(
        JSON.stringify({ error: "Forbidden: User ID mismatch" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const plan = PLAN_PRICES[planName];
    if (!plan?.priceId) {
      return new Response(
        JSON.stringify({ error: "Stripe not configured. Please contact support." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "");

    const { data: profile } = await supabase.from("profiles").select("stripe_customer_id, full_name").eq("id", authenticatedUserId).single();
    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        name: profile?.full_name || undefined,
        metadata: { supabase_user_id: authenticatedUserId },
      });
      customerId = customer.id;
      await supabase.from("profiles").update({ stripe_customer_id: customerId }).eq("id", authenticatedUserId);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: plan.priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${Deno.env.get("PUBLIC_URL") || ""}/billing?session_id={CHECKOUT_SESSION_ID}&payment=success`,
      cancel_url: `${Deno.env.get("PUBLIC_URL") || ""}/billing?payment=cancelled`,
      metadata: { userId: authenticatedUserId, planName },
    });

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Checkout session error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
