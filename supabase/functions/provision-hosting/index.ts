import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

interface ProvisionRequest {
  planId?: string;
  provider?: string;
  name?: string;
  domain?: string;
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

    // Verify JWT and get user
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: authError } = await authClient.auth.getUser(token);
    
    if (authError || !userData?.user) {
      console.error('JWT verification failed:', authError?.message);
      return new Response(
        JSON.stringify({ ok: false, error: 'Unauthorized: Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = userData.user.id;
    console.log('Provisioning hosting for user:', userId);

    // ========== PROCESS PROVISIONING REQUEST ==========
    const body: ProvisionRequest = await req.json().catch(() => ({}));
    const planId = body.planId || 'starter';
    const provider = body.provider || 'shared';
    const accountName = body.name || `hosting-${Date.now()}`;

    // Validate plan
    const validPlans = ['free', 'starter', 'business', 'enterprise'];
    if (!validPlans.includes(planId)) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Invalid plan selected' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check user's current hosting account count
    const { count: existingCount } = await supabase
      .from('hosting_accounts')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', userId);

    // Plan limits
    const planLimits: Record<string, number> = {
      free: 1,
      starter: 3,
      business: 10,
      enterprise: 999,
    };

    const currentLimit = planLimits[planId] || 1;
    if ((existingCount || 0) >= currentLimit) {
      return new Response(
        JSON.stringify({ ok: false, error: `Plan limit reached. Upgrade to create more hosting accounts.` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create hosting account
    const hostingData = {
      owner_id: userId,
      name: accountName,
      plan: planId,
      domain: body.domain || null,
      server_location: 'us-east-1',
      is_active: true,
      storage_used_gb: 0,
      bandwidth_used_gb: 0,
    };

    const { data: hosting, error: hostingError } = await supabase
      .from('hosting_accounts')
      .insert(hostingData)
      .select()
      .single();

    if (hostingError) {
      console.error('Hosting creation error:', hostingError);
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to provision hosting account' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Hosting account created:', hosting.id);

    // Log activity
    await supabase.from('activity_log').insert({
      user_id: userId,
      hosting_account_id: hosting.id,
      action: 'hosting_provisioned',
      details: { plan: planId, provider, name: accountName },
    });

    // Create notification
    await supabase.from('notifications').insert({
      user_id: userId,
      title: 'Hosting Account Created',
      message: `Your ${planId} hosting account "${accountName}" is now active.`,
      type: 'success',
      action_url: `/hosting/control-panel/${hosting.id}`,
    });

    return new Response(
      JSON.stringify({ 
        ok: true, 
        hosting: {
          id: hosting.id,
          name: hosting.name,
          plan: hosting.plan,
          domain: hosting.domain,
          status: hosting.is_active ? 'active' : 'inactive',
          server_location: hosting.server_location,
          created_at: hosting.created_at,
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
