/**
 * SendGrid Email Service
 * Handles email delivery through SendGrid API
 */

interface EmailOptions {
  to: string | string[];
  from?: string;
  subject: string;
  html?: string;
  text?: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, any>;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
}

interface SendGridResponse {
  messageId: string;
  success: boolean;
}

export const emailService = {
  /**
   * Send email through SendGrid
   */
  send: async (options: EmailOptions): Promise<SendGridResponse> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SENDGRID_TOKEN || ''}`,
        },
        body: JSON.stringify({
          to: Array.isArray(options.to) ? options.to : [options.to],
          from: options.from || import.meta.env.VITE_EMAIL_FROM || 'noreply@example.com',
          subject: options.subject,
          html: options.html,
          text: options.text,
          templateId: options.templateId,
          dynamicTemplateData: options.dynamicTemplateData,
          replyTo: options.replyTo,
          cc: options.cc,
          bcc: options.bcc,
        }),
      });

      if (!response.ok) {
        throw new Error(`SendGrid error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        messageId: data.id,
        success: true,
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  },

  /**
   * Send welcome email
   */
  sendWelcomeEmail: async (email: string, name: string): Promise<SendGridResponse> => {
    return emailService.send({
      to: email,
      subject: 'Welcome to Rocket Launch Hosting!',
      templateId: 'd-welcome-email',
      dynamicTemplateData: {
        firstName: name.split(' ')[0],
        welcomeUrl: `${import.meta.env.VITE_APP_URL}/dashboard`,
      },
    });
  },

  /**
   * Send password reset email
   */
  sendPasswordResetEmail: async (
    email: string,
    resetToken: string
  ): Promise<SendGridResponse> => {
    const resetUrl = `${import.meta.env.VITE_APP_URL}/reset-password?token=${resetToken}`;

    return emailService.send({
      to: email,
      subject: 'Reset Your Password',
      templateId: 'd-password-reset',
      dynamicTemplateData: {
        resetLink: resetUrl,
        expiryTime: '24 hours',
      },
    });
  },

  /**
   * Send payment receipt
   */
  sendPaymentReceipt: async (
    email: string,
    paymentData: Record<string, any>
  ): Promise<SendGridResponse> => {
    return emailService.send({
      to: email,
      subject: `Payment Receipt #${paymentData.orderId}`,
      templateId: 'd-payment-receipt',
      dynamicTemplateData: {
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        date: new Date().toLocaleDateString(),
        items: paymentData.items,
        downloadUrl: `${import.meta.env.VITE_APP_URL}/invoices/${paymentData.orderId}`,
      },
    });
  },

  /**
   * Send hosting activation email
   */
  sendHostingActivationEmail: async (
    email: string,
    hostingData: Record<string, any>
  ): Promise<SendGridResponse> => {
    return emailService.send({
      to: email,
      subject: 'Your Hosting Account is Ready!',
      templateId: 'd-hosting-activation',
      dynamicTemplateData: {
        domain: hostingData.domain,
        cpanelUrl: hostingData.cpanelUrl,
        username: hostingData.username,
        controlPanelLink: `${import.meta.env.VITE_APP_URL}/dashboard/hosting`,
      },
    });
  },

  /**
   * Send support ticket confirmation
   */
  sendTicketConfirmation: async (
    email: string,
    ticketData: Record<string, any>
  ): Promise<SendGridResponse> => {
    return emailService.send({
      to: email,
      subject: `Support Ticket #${ticketData.ticketId} Created`,
      templateId: 'd-ticket-confirmation',
      dynamicTemplateData: {
        ticketId: ticketData.ticketId,
        subject: ticketData.subject,
        trackingUrl: `${import.meta.env.VITE_APP_URL}/support/${ticketData.ticketId}`,
      },
    });
  },

  /**
   * Send invoice email
   */
  sendInvoice: async (
    email: string,
    invoiceData: Record<string, any>
  ): Promise<SendGridResponse> => {
    return emailService.send({
      to: email,
      subject: `Invoice #${invoiceData.invoiceNumber}`,
      templateId: 'd-invoice',
      dynamicTemplateData: {
        invoiceNumber: invoiceData.invoiceNumber,
        invoiceDate: invoiceData.date,
        amount: invoiceData.amount,
        dueDate: invoiceData.dueDate,
        downloadUrl: `${import.meta.env.VITE_APP_URL}/invoices/${invoiceData.invoiceId}/pdf`,
      },
    });
  },

  /**
   * Send bulk emails
   */
  sendBulk: async (recipients: string[], options: Omit<EmailOptions, 'to'>) => {
    return Promise.all(recipients.map((email) => emailService.send({ ...options, to: email })));
  },
};
