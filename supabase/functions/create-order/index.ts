import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

interface OrderItem {
  name: string;
  price: number;
  quantity?: number;
  type?: string;
}

interface CreateOrderRequest {
  userId?: string;
  items: OrderItem[];
  amount?: number;
  currency?: string;
  billingCycle?: string;
  plan?: string;
}

Deno.serve(async (req: Request) => {
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
        JSON.stringify({ ok: false, error: 'Unauthorized: Missing token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create authenticated client
    const authClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_ANON_KEY') || '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify JWT and get user claims
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await authClient.auth.getUser(token);
    
    if (claimsError || !claimsData?.user) {
      console.error('JWT verification failed:', claimsError?.message);
      return new Response(
        JSON.stringify({ ok: false, error: 'Unauthorized: Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const authenticatedUserId = claimsData.user.id;
    console.log('Authenticated user:', authenticatedUserId);

    // ========== PROCESS ORDER ==========
    const body: CreateOrderRequest = await req.json().catch(() => ({}));
    const items = Array.isArray(body.items) ? body.items : [];
    const amount = Number(body.amount || items.reduce((s: number, it: OrderItem) => s + (it.price || 0) * (it.quantity || 1), 0));

    // Security: Use authenticated user ID, not the one from request body
    const userId = authenticatedUserId;

    // Validate order data
    if (amount <= 0) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Invalid order amount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create order in database
    const orderData = {
      user_id: userId,
      amount_cents: Math.round(amount * 100),
      currency: body.currency || 'INR',
      status: 'pending',
      billing_cycle: body.billingCycle || 'monthly',
      plan: body.plan || 'starter',
    };

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to create order' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order created:', order.id);

    // Log activity
    await supabase.from('activity_log').insert({
      user_id: userId,
      action: 'order_created',
      details: { order_id: order.id, amount, items_count: items.length },
    });

    return new Response(
      JSON.stringify({ 
        ok: true, 
        order: {
          id: order.id,
          user_id: order.user_id,
          amount: order.amount_cents / 100,
          currency: order.currency,
          status: order.status,
          created_at: order.created_at,
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Unexpected error:', err);
    return new Response(
      JSON.stringify({ ok: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
