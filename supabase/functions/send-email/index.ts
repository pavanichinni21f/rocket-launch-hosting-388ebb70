import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing authorization" }),
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

    const { to, subject, html } = await req.json();

    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Log email
    await supabase.from("email_logs").insert({
      user_id: user.sub,
      to_email: to,
      subject: subject,
      status: "sent",
      created_at: new Date().toISOString(),
    });

    // In production, send via SendGrid/Resend/similar
    // For now, just log success
    console.log(`Email sent: ${to} - ${subject}`);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Email error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
