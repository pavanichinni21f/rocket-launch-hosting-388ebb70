/**
 * PayU provider wrapper - calls Edge Function for secure server-side processing.
 * SECURITY: All payment processing happens server-side in Edge Functions.
 * Never store payment secrets in VITE_ prefixed environment variables.
 */
import { supabase } from '@/integrations/supabase/client';

export interface PayUCheckoutPayload {
  userId: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  currency?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerName?: string;
}

export interface PayUCheckoutResponse {
  success: boolean;
  paymentUrl?: string;
  txnId?: string;
  error?: string;
}

/**
 * Creates a PayU checkout session via Edge Function (server-side processing)
 * SECURITY: Payment secrets are stored securely in Supabase secrets, not client-side
 */
export async function createPayUCheckoutSession(payload: PayUCheckoutPayload): Promise<PayUCheckoutResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('payu-payment', {
      body: {
        action: 'initiate',
        userId: payload.userId,
        items: payload.items,
        currency: payload.currency || 'INR',
        customerEmail: payload.customerEmail,
        customerPhone: payload.customerPhone,
        customerName: payload.customerName,
      },
    });

    if (error) {
      console.error('PayU Edge Function error:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      paymentUrl: data?.paymentUrl,
      txnId: data?.txnId,
    };
  } catch (err) {
    console.error('PayU checkout error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * Verifies a PayU payment via Edge Function (server-side verification)
 */
export async function verifyPayUPayment(txnId: string): Promise<{ success: boolean; status?: string; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('payu-payment', {
      body: {
        action: 'verify',
        txnId,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: data?.verified || false,
      status: data?.status,
    };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
