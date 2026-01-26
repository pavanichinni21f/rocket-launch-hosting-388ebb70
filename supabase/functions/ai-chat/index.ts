import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      // Mock fallback when API key not configured
      const mockResponses = [
        "Hello! I'm the KSF Assistant (demo mode). I can help you with hosting questions, billing, and technical support.",
        "That's a great question! In production, I'd connect to our AI service to provide detailed answers.",
        "I understand. Let me help you with that - though I'm currently in demo mode.",
        "Thanks for reaching out! Our hosting plans start at ₹999/month. Would you like more details?",
        "I can assist with domain setup, SSL certificates, and server configuration. What do you need?",
      ];
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      return new Response(
        `data: {"choices":[{"delta":{"content":"${randomResponse}"}}]}\n\ndata: [DONE]\n\n`,
        { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } }
      );
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are KSF Assistant, a helpful AI for KSFoundation Web Hosting Platform. 
            
Your capabilities:
- Answer hosting questions (shared, VPS, cloud, dedicated)
- Help with domain registration and DNS setup
- Explain billing, pricing (₹999-₹19,999 plans), and payment methods (UPI, PayU, Cashfree)
- Troubleshoot common hosting issues
- Guide users through cPanel and server management
- Explain SSL certificates and security features

Be concise, friendly, and professional. Use emojis sparingly. 
If asked about something outside hosting/domains, politely redirect.
Always mention you can escalate to human support if needed.`
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (err) {
    console.error("AI chat error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
