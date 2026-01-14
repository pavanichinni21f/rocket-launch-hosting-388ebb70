import Stripe from 'https://esm.sh/stripe@14.0.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2024-04-10',
});

interface CheckoutSessionRequest {
  userId: string;
  planName: 'starter' | 'business' | 'enterprise';
}

const PLAN_PRICES: Record<string, { priceId: string; name: string; amount: number }> = {
  starter: {
    priceId: Deno.env.get('STRIPE_PRICE_STARTER') || '',
    name: 'Starter',
    amount: 999,
  },
  business: {
    priceId: Deno.env.get('STRIPE_PRICE_BUSINESS') || '',
    name: 'Business',
    amount: 1999,
  },
  enterprise: {
    priceId: Deno.env.get('STRIPE_PRICE_ENTERPRISE') || '',
    name: 'Enterprise',
    amount: 19999,
  },
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ========== JWT AUTHENTICATION ==========
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.error('Missing or invalid Authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Missing token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create authenticated client
    const authClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_ANON_KEY') || '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify JWT and get user
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: authError } = await authClient.auth.getUser(token);
    
    if (authError || !userData?.user) {
      console.error('JWT verification failed:', authError?.message);
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const authenticatedUserId = userData.user.id;
    const userEmail = userData.user.email || '';
    console.log('Creating checkout session for user:', authenticatedUserId);

    // ========== PROCESS CHECKOUT REQUEST ==========
    const { userId, planName } = (await req.json()) as CheckoutSessionRequest;

    // SECURITY: Verify the authenticated user matches the requested userId
    if (userId && userId !== authenticatedUserId) {
      console.error('User ID mismatch:', { requested: userId, authenticated: authenticatedUserId });
      return new Response(
        JSON.stringify({ error: 'Forbidden: User ID mismatch' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!planName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const plan = PLAN_PRICES[planName];
    if (!plan) {
      return new Response(
        JSON.stringify({ error: 'Invalid plan' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if Stripe is configured
    if (!plan.priceId) {
      console.log('Stripe not configured, returning mock session');
      // Return mock session for development
      return new Response(
        JSON.stringify({
          sessionId: `mock_session_${Date.now()}`,
          url: `${Deno.env.get('PUBLIC_URL') || ''}/billing?payment=success&mock=true`,
          mockMode: true,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get or create Stripe customer
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, full_name')
      .eq('id', authenticatedUserId)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: userEmail,
        name: profile?.full_name || undefined,
        metadata: { supabase_user_id: authenticatedUserId },
      });
      customerId = customer.id;

      // Save customer ID to profile
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', authenticatedUserId);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${Deno.env.get('PUBLIC_URL') || ''}/billing?session_id={CHECKOUT_SESSION_ID}&payment=success`,
      cancel_url: `${Deno.env.get('PUBLIC_URL') || ''}/billing?payment=cancelled`,
      metadata: {
        userId: authenticatedUserId,
        planName,
      },
    });

    console.log('Checkout session created:', session.id);

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Checkout session error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
