/**
 * Sentry Error Tracking Service
 * Captures and reports errors to Sentry
 */

export const sentryService = {
  /**
   * Initialize Sentry
   */
  initialize: async () => {
    if (!import.meta.env.VITE_SENTRY_DSN) return;

    try {
      const Sentry = await import('@sentry/react');

      Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        environment: import.meta.env.MODE,
        tracesSampleRate: 1.0,
        debug: import.meta.env.DEV,
        beforeSend(event) {
          // Don't send errors in development
          if (import.meta.env.DEV) return null;
          return event;
        },
      });

      // Global error handler
      window.addEventListener('error', (event) => {
        Sentry.captureException(event.error);
      });

      // Unhandled promise rejection handler
      window.addEventListener('unhandledrejection', (event) => {
        Sentry.captureException(event.reason);
      });
    } catch (error) {
      console.error('Failed to initialize Sentry:', error);
    }
  },

  /**
   * Capture exception
   */
  captureException: (error: Error, context?: Record<string, any>) => {
    try {
      import('@sentry/react').then((Sentry) => {
        Sentry.captureException(error, {
          contexts: {
            custom: context,
          },
        });
      });
    } catch (err) {
      console.error('Failed to capture exception:', err);
    }
  },

  /**
   * Capture message
   */
  captureMessage: (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
    try {
      import('@sentry/react').then((Sentry) => {
        Sentry.captureMessage(message, level);
      });
    } catch (err) {
      console.error('Failed to capture message:', err);
    }
  },

  /**
   * Set user context
   */
  setUser: (userId: string, email?: string, name?: string) => {
    try {
      import('@sentry/react').then((Sentry) => {
        Sentry.setUser({
          id: userId,
          email,
          username: name,
        });
      });
    } catch (err) {
      console.error('Failed to set user context:', err);
    }
  },

  /**
   * Clear user context
   */
  clearUser: () => {
    try {
      import('@sentry/react').then((Sentry) => {
        Sentry.setUser(null);
      });
    } catch (err) {
      console.error('Failed to clear user context:', err);
    }
  },

  /**
   * Add breadcrumb
   */
  addBreadcrumb: (message: string, category: string, data?: Record<string, any>) => {
    try {
      import('@sentry/react').then((Sentry) => {
        Sentry.addBreadcrumb({
          message,
          category,
          data,
          level: 'info',
        });
      });
    } catch (err) {
      console.error('Failed to add breadcrumb:', err);
    }
  },
};
