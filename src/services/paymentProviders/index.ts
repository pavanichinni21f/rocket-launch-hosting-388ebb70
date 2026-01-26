import * as razorpay from './razorpayProvider';
import * as payu from './payuProvider';

const PROVIDER = (import.meta.env.VITE_PAYMENT_PROVIDER as string) || 'razorpay';

export async function createCheckoutSession(payload: { userId: string; items: any[]; currency?: string; metadata?: any }) {
  if (!PROVIDER || PROVIDER === '') {
    throw new Error('Payment provider not configured. Contact support.');
  }

  if (PROVIDER === 'razorpay') {
    return await razorpay.createRazorpayCheckoutSession(payload as any);
  }

  if (PROVIDER === 'payu') {
    return await payu.createPayUCheckoutSession(payload as any);
  }

  throw new Error(`Unsupported payment provider: ${PROVIDER}`);
}

export async function verifyPayment(sessionId: string) {
  if (PROVIDER === 'razorpay') {
    return { success: false };
  }
  if (PROVIDER === 'payu') {
    return { success: false };
  }
  throw new Error('Payment verification not configured');
}
