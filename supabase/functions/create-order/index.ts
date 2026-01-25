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
    const { items, amount, currency = "INR" } = body;

    // Verify user ownership
    if (body.user_id && body.user_id !== user.sub) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.sub,
        amount: amount,
        currency: currency,
        status: "pending",
        items: items,
      })
      .select()
      .single();

    if (orderError) {
      throw new Error(`Order creation failed: ${orderError.message}`);
    }

    // Create order items
    if (items && items.length > 0) {
      await supabase.from("order_items").insert(
        items.map((item: any) => ({
          order_id: order.id,
          service_id: item.service_id,
          service_name: item.service_name,
          service_type: item.service_type,
          quantity: item.quantity || 1,
          unit_price: item.unit_price,
          total_price: item.total_price,
        }))
      );
    }

    // Log activity
    await supabase.from("activity_log").insert({
      user_id: user.sub,
      action: "order_created",
      details: { order_id: order.id, amount: amount },
    });

    return new Response(
      JSON.stringify({ success: true, order }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Order creation error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
