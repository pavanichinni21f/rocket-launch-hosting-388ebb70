/**
 * Razorpay provider wrapper - calls Edge Function for secure server-side processing.
 * SECURITY: All payment processing happens server-side in Edge Functions.
 * Never store payment secrets in VITE_ prefixed environment variables.
 */
import { supabase } from '@/integrations/supabase/client';

export interface RazorpayCheckoutPayload {
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

export interface RazorpayCheckoutResponse {
  success: boolean;
  orderId?: string;
  amount?: number;
  currency?: string;
  keyId?: string; // Public key only - safe to expose
  error?: string;
}

/**
 * Creates a Razorpay order via Edge Function (server-side processing)
 * SECURITY: Payment secrets are stored securely in Supabase secrets, not client-side
 * 
 * NOTE: This requires a razorpay-payment Edge Function to be implemented.
 * The Edge Function should use RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET from secrets.
 */
export async function createRazorpayCheckoutSession(payload: RazorpayCheckoutPayload): Promise<RazorpayCheckoutResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('razorpay-payment', {
      body: {
        action: 'create-order',
        userId: payload.userId,
        items: payload.items,
        currency: payload.currency || 'INR',
        customerEmail: payload.customerEmail,
        customerPhone: payload.customerPhone,
        customerName: payload.customerName,
      },
    });

    if (error) {
      console.error('Razorpay Edge Function error:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      orderId: data?.orderId,
      amount: data?.amount,
      currency: data?.currency,
      keyId: data?.keyId, // Public key from server - safe to use client-side
    };
  } catch (err) {
    console.error('Razorpay checkout error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * Verifies a Razorpay payment signature via Edge Function (server-side verification)
 */
export async function verifyRazorpayPayment(
  orderId: string,
  paymentId: string,
  signature: string
): Promise<{ success: boolean; verified?: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('razorpay-payment', {
      body: {
        action: 'verify',
        orderId,
        paymentId,
        signature,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      verified: data?.verified || false,
    };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
