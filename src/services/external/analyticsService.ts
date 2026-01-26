/**
 * Analytics Service
 * Tracks user events and page views with Google Analytics and Sentry
 */

interface AnalyticsEvent {
  name: string;
  category?: string;
  label?: string;
  value?: number;
  userId?: string;
  metadata?: Record<string, any>;
}

interface PageViewData {
  path: string;
  title: string;
  userId?: string;
}

export const analyticsService = {
  /**
   * Initialize analytics services
   */
  initialize: () => {
    // Google Analytics
    if (import.meta.env.VITE_GOOGLE_ANALYTICS_ID) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GOOGLE_ANALYTICS_ID}`;
      document.head.appendChild(script);

      (window as any).dataLayer = (window as any).dataLayer || [];
      const gtag = function (...args: any[]) {
        (window as any).dataLayer.push(arguments);
      };
      gtag('js', new Date());
      gtag('config', import.meta.env.VITE_GOOGLE_ANALYTICS_ID, {
        page_path: window.location.pathname,
      });
      (window as any).gtag = gtag;
    }

    // Sentry
    if (import.meta.env.VITE_SENTRY_DSN) {
      import('./sentryService').then((module) => {
        module.sentryService.initialize();
      });
    }
  },

  /**
   * Track page view
   */
  trackPageView: (data: PageViewData) => {
    if ((window as any).gtag) {
      (window as any).gtag('config', import.meta.env.VITE_GOOGLE_ANALYTICS_ID, {
        page_path: data.path,
        page_title: data.title,
        user_id: data.userId,
      });
    }

    // Log to Sentry
    if (import.meta.env.VITE_SENTRY_DSN) {
      console.log(`Page viewed: ${data.path}`);
    }
  },

  /**
   * Track custom event
   */
  trackEvent: (event: AnalyticsEvent) => {
    if ((window as any).gtag) {
      (window as any).gtag('event', event.name, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        user_id: event.userId,
        ...event.metadata,
      });
    }

    console.log('Event tracked:', event.name);
  },

  /**
   * Track payment
   */
  trackPayment: (paymentData: {
    orderId: string;
    amount: number;
    currency: string;
    items: any[];
  }) => {
    analyticsService.trackEvent({
      name: 'purchase',
      category: 'payment',
      value: paymentData.amount,
      metadata: {
        transaction_id: paymentData.orderId,
        value: paymentData.amount,
        currency: paymentData.currency,
        items: paymentData.items.length,
      },
    });
  },

  /**
   * Track signup
   */
  trackSignup: (source: string) => {
    analyticsService.trackEvent({
      name: 'sign_up',
      category: 'engagement',
      label: source,
    });
  },

  /**
   * Track login
   */
  trackLogin: (provider: string) => {
    analyticsService.trackEvent({
      name: 'login',
      category: 'engagement',
      label: provider,
    });
  },

  /**
   * Track feature usage
   */
  trackFeatureUsage: (feature: string, action: string) => {
    analyticsService.trackEvent({
      name: 'feature_usage',
      category: 'engagement',
      label: feature,
      metadata: { action },
    });
  },

  /**
   * Set user ID for tracking
   */
  setUserId: (userId: string) => {
    if ((window as any).gtag) {
      (window as any).gtag('config', import.meta.env.VITE_GOOGLE_ANALYTICS_ID, {
        user_id: userId,
      });
    }
  },

  /**
   * Set user properties
   */
  setUserProperties: (properties: Record<string, any>) => {
    if ((window as any).gtag) {
      (window as any).gtag('set', properties);
    }
  },

  /**
   * Track error
   */
  trackError: (error: Error, context?: string) => {
    analyticsService.trackEvent({
      name: 'error',
      category: 'error',
      label: context,
      metadata: {
        message: error.message,
        stack: error.stack,
      },
    });
  },
};
