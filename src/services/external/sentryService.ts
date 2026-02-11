/**
 * Sentry Error Tracking Service (stub)
 * Logs errors to console when Sentry is not installed.
 */

export const sentryService = {
  initialize: async () => {
    if (!import.meta.env.VITE_SENTRY_DSN) return;
    console.info('[Sentry] DSN configured but @sentry/react not installed. Errors will be logged to console.');
  },

  captureException: (error: Error, context?: Record<string, any>) => {
    console.error('[Sentry stub] Exception:', error, context);
  },

  captureMessage: (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
    console[level === 'error' ? 'error' : level === 'warning' ? 'warn' : 'info']('[Sentry stub]', message);
  },

  setUser: (userId: string, _email?: string, _name?: string) => {
    console.info('[Sentry stub] setUser:', userId);
  },

  clearUser: () => {
    console.info('[Sentry stub] clearUser');
  },

  addBreadcrumb: (message: string, category: string, _data?: Record<string, any>) => {
    console.debug('[Sentry stub] breadcrumb:', category, message);
  },
};
