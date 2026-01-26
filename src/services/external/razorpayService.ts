/**
 * Razorpay Payment Service
 * Handles payment processing through Razorpay gateway
 */

interface RazorpayOptions {
  key_id: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  prefill?: {
    name: string;
    email: string;
    contact: string;
  };
  theme?: {
    color: string;
  };
  handler?: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export const razorpayService = {
  /**
   * Load Razorpay script
   */
  loadScript: async (): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  },

  /**
   * Create order on backend
   */
  createOrder: async (amount: number, description: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/razorpay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to paise
          currency: 'INR',
          description,
        }),
      });

      if (!response.ok) throw new Error('Failed to create order');
      return await response.json();
    } catch (error) {
      console.error('Order creation failed:', error);
      throw error;
    }
  },

  /**
   * Initiate Razorpay payment
   */
  initiatePayment: async (options: RazorpayOptions): Promise<void> => {
    const scriptLoaded = await razorpayService.loadScript();
    if (!scriptLoaded) throw new Error('Failed to load Razorpay');

    const razorpay = (window as any).Razorpay;
    if (!razorpay) throw new Error('Razorpay not loaded');

    const checkout = new razorpay(options);
    checkout.open();
  },

  /**
   * Verify payment signature
   */
  verifyPayment: async (response: RazorpayResponse): Promise<boolean> => {
    try {
      const verifyResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/payments/razorpay/verify`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(response),
        }
      );

      return verifyResponse.ok;
    } catch (error) {
      console.error('Payment verification failed:', error);
      return false;
    }
  },

  /**
   * Get payment status
   */
  getPaymentStatus: async (paymentId: string): Promise<any> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/payments/razorpay/${paymentId}`
      );

      if (!response.ok) throw new Error('Failed to fetch payment status');
      return await response.json();
    } catch (error) {
      console.error('Failed to get payment status:', error);
      throw error;
    }
  },
};
