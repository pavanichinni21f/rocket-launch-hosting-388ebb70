/**
 * Indian Payment Service - Supports PayU, Cashfree, UPI, GPay
 * All payment processing happens server-side in Edge Functions.
 */
import { supabase } from '@/integrations/supabase/client';

export type PaymentProvider = 'payu' | 'cashfree' | 'upi' | 'gpay';

export interface IndianPaymentParams {
  provider: PaymentProvider;
  amount: number;
  productInfo: string;
  customerName: string;
  email: string;
  phone: string;
  userId: string;
  plan: 'starter' | 'business' | 'enterprise';
  upiId?: string;
}

export interface PaymentResponse {
  success: boolean;
  provider: PaymentProvider;
  orderId?: string;
  txnId?: string;
  paymentUrl?: string;
  upiUrl?: string;
  qrData?: string;
  gpayDeepLink?: string;
  params?: Record<string, string>;
  message?: string;
  error?: string;
}

/**
 * Initiates a payment with the specified Indian payment provider
 */
export async function initiateIndianPayment(params: IndianPaymentParams): Promise<PaymentResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('indian-payment', {
      body: {
        action: 'initiate',
        ...params,
      },
    });

    if (error) {
      console.error('Payment initiation error:', error);
      return { success: false, provider: params.provider, error: error.message };
    }

    return data as PaymentResponse;
  } catch (err) {
    console.error('Payment service error:', err);
    return { 
      success: false, 
      provider: params.provider, 
      error: err instanceof Error ? err.message : 'Unknown error' 
    };
  }
}

/**
 * Verifies a payment status
 */
export async function verifyIndianPayment(
  orderId: string, 
  txnId: string, 
  status: 'success' | 'failed' | 'pending',
  provider: PaymentProvider
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('indian-payment', {
      body: {
        action: 'verify',
        orderId,
        txnId,
        status,
        provider,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: data.success };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * Checks payment status for an order
 */
export async function checkPaymentStatus(orderId: string): Promise<{
  success: boolean;
  status?: string;
  paid?: boolean;
  error?: string;
}> {
  try {
    const { data, error } = await supabase.functions.invoke('indian-payment', {
      body: {
        action: 'check_status',
        orderId,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return data;
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * Redirects to PayU payment page
 */
export function redirectToPayU(paymentUrl: string, params: Record<string, string>) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = paymentUrl;

  Object.entries(params).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}

/**
 * Opens UPI app for payment
 */
export function openUPIApp(upiUrl: string) {
  window.location.href = upiUrl;
}

/**
 * Opens GPay for payment
 */
export function openGPay(gpayDeepLink: string) {
  window.location.href = gpayDeepLink;
}

/**
 * Gets available payment methods
 */
export function getAvailablePaymentMethods(): Array<{
  id: PaymentProvider;
  name: string;
  icon: string;
  description: string;
}> {
  return [
    {
      id: 'payu',
      name: 'PayU',
      icon: '💳',
      description: 'Credit/Debit Card, Net Banking',
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: '📱',
      description: 'Any UPI App',
    },
    {
      id: 'gpay',
      name: 'Google Pay',
      icon: '🔵',
      description: 'Pay with Google Pay',
    },
    {
      id: 'cashfree',
      name: 'Cashfree',
      icon: '💰',
      description: 'Multiple Payment Options',
    },
  ];
}

/**
 * Plan pricing in INR
 */
export const PLAN_PRICING = {
  starter: { monthly: 999, yearly: 9999 },
  business: { monthly: 1999, yearly: 19999 },
  enterprise: { monthly: 19999, yearly: 199999 },
} as const;

export function getPlanPrice(plan: 'starter' | 'business' | 'enterprise', cycle: 'monthly' | 'yearly' = 'monthly'): number {
  return PLAN_PRICING[plan][cycle];
}
