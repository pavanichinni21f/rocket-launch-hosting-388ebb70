// Supabase Edge Function - Unified Payment Webhook Handler
// Handles webhooks from Stripe, Razorpay, and PayU with signature verification

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-razorpay-signature, x-payu-signature, stripe-signature',
};

// Crypto utilities for signature verification
async function hmacSha256(key: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const messageData = encoder.encode(message);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hmacSha512(key: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const messageData = encoder.encode(message);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-512' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Verify Razorpay webhook signature
async function verifyRazorpaySignature(payload: string, signature: string, secret: string): Promise<boolean> {
  const expectedSignature = await hmacSha256(secret, payload);
  return signature === expectedSignature;
}

// Verify PayU webhook signature (reverse hash verification)
async function verifyPayUSignature(payload: any, signature: string, salt: string): Promise<boolean> {
  // PayU signature format: sha512(SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
  const hashString = [
    salt,
    payload.status || '',
    '', '', '', '', '', // placeholders
    payload.udf5 || '',
    payload.udf4 || '',
    payload.udf3 || '',
    payload.udf2 || '',
    payload.udf1 || '',
    payload.email || '',
    payload.firstname || '',
    payload.productinfo || '',
    payload.amount || '',
    payload.txnid || '',
    payload.key || ''
  ].join('|');
  
  const expectedSignature = await hmacSha512(salt, hashString);
  return signature.toLowerCase() === expectedSignature.toLowerCase();
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const rawBody = await req.text();
    const url = new URL(req.url);
    const provider = url.searchParams.get('provider') || 'unknown';

    console.log(`[payment-webhook] Received webhook from provider: ${provider}`);

    let verified = false;
    let paymentData: any = {};

    // Route to appropriate handler based on provider
    switch (provider.toLowerCase()) {
      case 'razorpay': {
        const signature = req.headers.get('x-razorpay-signature');
        const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET');
        
        if (!signature || !webhookSecret) {
          console.error('[payment-webhook] Razorpay: Missing signature or secret');
          return new Response(JSON.stringify({ error: 'Missing signature or secret' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        verified = await verifyRazorpaySignature(rawBody, signature, webhookSecret);
        if (!verified) {
          console.error('[payment-webhook] Razorpay: Invalid signature');
          return new Response(JSON.stringify({ error: 'Invalid signature' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        paymentData = JSON.parse(rawBody);
        console.log('[payment-webhook] Razorpay webhook verified');
        break;
      }

      case 'payu': {
        const salt = Deno.env.get('PAYU_MERCHANT_SALT');
        
        if (!salt) {
          console.error('[payment-webhook] PayU: Missing salt');
          return new Response(JSON.stringify({ error: 'Missing configuration' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // PayU sends form-encoded data
        const formData = new URLSearchParams(rawBody);
        paymentData = Object.fromEntries(formData.entries());
        
        const signature = paymentData.hash || req.headers.get('x-payu-signature');
        if (!signature) {
          console.error('[payment-webhook] PayU: Missing signature');
          return new Response(JSON.stringify({ error: 'Missing signature' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        verified = await verifyPayUSignature(paymentData, signature, salt);
        if (!verified) {
          console.error('[payment-webhook] PayU: Invalid signature');
          return new Response(JSON.stringify({ error: 'Invalid signature' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        console.log('[payment-webhook] PayU webhook verified');
        break;
      }

      case 'stripe': {
        // Stripe webhooks are handled in the dedicated stripe-webhook function
        // This is a fallback for unified routing
        console.log('[payment-webhook] Stripe webhooks should use /stripe-webhook endpoint');
        return new Response(JSON.stringify({ 
          error: 'Use /stripe-webhook endpoint for Stripe webhooks' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        console.error(`[payment-webhook] Unknown provider: ${provider}`);
        return new Response(JSON.stringify({ error: 'Unknown payment provider' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    // Process the verified webhook
    if (verified) {
      // Extract transaction details based on provider
      let txnId: string | null = null;
      let status: string = 'unknown';
      let amount: number = 0;

      if (provider === 'razorpay') {
        const event = paymentData.event;
        const entity = paymentData.payload?.payment?.entity;
        txnId = entity?.id;
        status = event === 'payment.captured' ? 'success' : 
                 event === 'payment.failed' ? 'failed' : 'pending';
        amount = entity?.amount ? entity.amount / 100 : 0;
      } else if (provider === 'payu') {
        txnId = paymentData.txnid;
        status = paymentData.status === 'success' ? 'success' : 
                 paymentData.status === 'failure' ? 'failed' : 'pending';
        amount = parseFloat(paymentData.amount || '0');
      }

      // Update order status in database
      if (txnId) {
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            status: status === 'success' ? 'paid' : status === 'failed' ? 'failed' : 'pending',
            paid_at: status === 'success' ? new Date().toISOString() : null,
          })
          .or(`stripe_payment_intent_id.eq.${txnId},id.eq.${txnId}`);

        if (updateError) {
          console.error('[payment-webhook] Failed to update order:', updateError);
        } else {
          console.log(`[payment-webhook] Order updated: ${txnId} -> ${status}`);
        }

        // Log the webhook event
        await supabase.from('activity_log').insert({
          action: 'payment_webhook',
          user_id: paymentData.user_id || '00000000-0000-0000-0000-000000000000',
          details: {
            provider,
            txnId,
            status,
            amount,
            verified: true,
          },
        });
      }
    }

    return new Response(JSON.stringify({ 
      ok: true, 
      verified,
      provider,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('[payment-webhook] Error:', err);
    return new Response(JSON.stringify({ 
      ok: false, 
      error: err instanceof Error ? err.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
