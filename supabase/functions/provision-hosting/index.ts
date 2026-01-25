import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function verifyJWT(token: string, supabaseUrl: string): Promise<{ sub: string } | null> {
  try {
    const supabase = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY") || "");
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;
    return { sub: user.id };
  } catch (err) {
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.substring(7);
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const user = await verifyJWT(token, SUPABASE_URL!);

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { order_id, plan, domain } = body;

    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Verify order belongs to user
    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .single();

    if (!order || order.user_id !== user.sub) {
      return new Response(
        JSON.stringify({ error: "Order not found or unauthorized" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create hosting account
    const { data: account, error: accountError } = await supabase
      .from("hosting_accounts")
      .insert({
        user_id: user.sub,
        provider: "aws", // Default provider
        plan: plan,
        status: "provisioning",
        metadata: { domain, order_id },
      })
      .select()
      .single();

    if (accountError) {
      throw new Error(`Provisioning failed: ${accountError.message}`);
    }

    // Log activity
    await supabase.from("activity_log").insert({
      user_id: user.sub,
      action: "hosting_provisioned",
      details: { account_id: account.id, plan, domain },
    });

    return new Response(
      JSON.stringify({ success: true, account }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Provisioning error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
