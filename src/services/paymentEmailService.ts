/**
 * Payment Email Service - Handles all payment-related email notifications
 */
import { supabase } from '@/integrations/supabase/client';

export interface PaymentConfirmationData {
  email: string;
  fullName: string;
  orderId: string;
  planName: string;
  amount: number;
  currency?: string;
  paymentMethod: string;
  transactionId?: string;
}

export interface SubscriptionUpdateData {
  email: string;
  fullName: string;
  oldPlan: string;
  newPlan: string;
  amount: number;
  effectiveDate: Date;
  isUpgrade: boolean;
}

/**
 * Send payment confirmation email
 */
export async function sendPaymentConfirmationEmail(data: PaymentConfirmationData): Promise<{ error: Error | null }> {
  try {
    const currency = data.currency || 'INR';
    const formattedAmount = currency === 'INR' 
      ? `₹${data.amount.toLocaleString('en-IN')}` 
      : `$${(data.amount / 100).toFixed(2)}`;

    const { error } = await supabase.functions.invoke('send-email', {
      body: {
        to: data.email,
        subject: `Payment Confirmed - Order #${data.orderId}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #FF6B35, #FF8F65); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Payment Successful! 🎉</h1>
            </div>
            
            <div style="padding: 30px; background: #ffffff; border: 1px solid #e0e0e0;">
              <p style="font-size: 16px;">Hi ${data.fullName},</p>
              <p>Thank you for your payment! Your subscription has been activated.</p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #333;">Order Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Order ID:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold;">#${data.orderId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Plan:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold;">${data.planName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Amount:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #28a745;">${formattedAmount}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Payment Method:</td>
                    <td style="padding: 8px 0; text-align: right;">${data.paymentMethod}</td>
                  </tr>
                  ${data.transactionId ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Transaction ID:</td>
                    <td style="padding: 8px 0; text-align: right; font-family: monospace;">${data.transactionId}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${window.location.origin}/dashboard" 
                   style="display: inline-block; padding: 14px 30px; background: #FF6B35; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
                  Go to Dashboard
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px;">
                If you have any questions, reply to this email or contact our support team.
              </p>
            </div>
            
            <div style="padding: 20px; background: #f8f9fa; text-align: center; border-radius: 0 0 10px 10px;">
              <p style="margin: 0; color: #666; font-size: 12px;">
                © ${new Date().getFullYear()} KSFoundation. All rights reserved.
              </p>
            </div>
          </div>
        `,
      },
    });

    if (error) throw error;
    console.log('Payment confirmation email sent to:', data.email);
    return { error: null };
  } catch (error) {
    console.error('Failed to send payment confirmation email:', error);
    return { error: error instanceof Error ? error : new Error('Failed to send email') };
  }
}

/**
 * Send subscription update email (upgrade/downgrade)
 */
export async function sendSubscriptionUpdateEmail(data: SubscriptionUpdateData): Promise<{ error: Error | null }> {
  try {
    const formattedAmount = `₹${data.amount.toLocaleString('en-IN')}`;
    const action = data.isUpgrade ? 'Upgraded' : 'Changed';
    const emoji = data.isUpgrade ? '🚀' : '✓';

    const { error } = await supabase.functions.invoke('send-email', {
      body: {
        to: data.email,
        subject: `Subscription ${action} - Welcome to ${data.newPlan}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0066CC, #0088FF); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Subscription ${action}! ${emoji}</h1>
            </div>
            
            <div style="padding: 30px; background: #ffffff; border: 1px solid #e0e0e0;">
              <p style="font-size: 16px;">Hi ${data.fullName},</p>
              <p>Your subscription has been successfully ${action.toLowerCase()}.</p>
              
              <div style="background: #f0f7ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0066CC;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <p style="margin: 0; color: #666; font-size: 12px;">PREVIOUS PLAN</p>
                    <p style="margin: 5px 0 0 0; font-size: 18px; color: #999; text-decoration: line-through;">${data.oldPlan}</p>
                  </div>
                  <div style="font-size: 24px;">→</div>
                  <div>
                    <p style="margin: 0; color: #666; font-size: 12px;">NEW PLAN</p>
                    <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold; color: #0066CC;">${data.newPlan}</p>
                  </div>
                </div>
              </div>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;"><strong>New Monthly Rate:</strong> ${formattedAmount}/month</p>
                <p style="margin: 10px 0 0 0;"><strong>Effective Date:</strong> ${data.effectiveDate.toLocaleDateString()}</p>
              </div>
              
              ${data.isUpgrade ? `
              <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #2e7d32;">
                  ✨ <strong>New Features Unlocked!</strong> You now have access to all ${data.newPlan} features.
                </p>
              </div>
              ` : ''}
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${window.location.origin}/billing" 
                   style="display: inline-block; padding: 14px 30px; background: #0066CC; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
                  View Billing Details
                </a>
              </div>
            </div>
            
            <div style="padding: 20px; background: #f8f9fa; text-align: center; border-radius: 0 0 10px 10px;">
              <p style="margin: 0; color: #666; font-size: 12px;">
                © ${new Date().getFullYear()} KSFoundation. All rights reserved.
              </p>
            </div>
          </div>
        `,
      },
    });

    if (error) throw error;
    console.log('Subscription update email sent to:', data.email);
    return { error: null };
  } catch (error) {
    console.error('Failed to send subscription update email:', error);
    return { error: error instanceof Error ? error : new Error('Failed to send email') };
  }
}

/**
 * Send payment receipt email
 */
export async function sendPaymentReceiptEmail(
  email: string,
  fullName: string,
  orderId: string,
  amount: number,
  planName: string,
  paymentDate: Date
): Promise<{ error: Error | null }> {
  try {
    const formattedAmount = `₹${amount.toLocaleString('en-IN')}`;

    const { error } = await supabase.functions.invoke('send-email', {
      body: {
        to: email,
        subject: `Payment Receipt - Order #${orderId}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="padding: 30px; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 10px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #333; margin: 0;">Payment Receipt</h1>
                <p style="color: #666;">Thank you for your purchase!</p>
              </div>
              
              <div style="border: 2px dashed #e0e0e0; padding: 20px; border-radius: 8px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee;">Order ID:</td>
                    <td style="padding: 10px 0; text-align: right; border-bottom: 1px solid #eee; font-weight: bold;">#${orderId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee;">Customer:</td>
                    <td style="padding: 10px 0; text-align: right; border-bottom: 1px solid #eee;">${fullName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee;">Plan:</td>
                    <td style="padding: 10px 0; text-align: right; border-bottom: 1px solid #eee;">${planName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee;">Date:</td>
                    <td style="padding: 10px 0; text-align: right; border-bottom: 1px solid #eee;">${paymentDate.toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 15px 0; font-size: 18px;"><strong>Total Paid:</strong></td>
                    <td style="padding: 15px 0; text-align: right; font-size: 24px; font-weight: bold; color: #28a745;">${formattedAmount}</td>
                  </tr>
                </table>
              </div>
              
              <p style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
                This is an official receipt for your records.<br>
                For any queries, contact support@ksfoundation.com
              </p>
            </div>
          </div>
        `,
      },
    });

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Failed to send payment receipt email:', error);
    return { error: error instanceof Error ? error : new Error('Failed to send email') };
  }
}

/**
 * Send renewal reminder email
 */
export async function sendRenewalReminderEmail(
  email: string,
  fullName: string,
  planName: string,
  renewalDate: Date,
  amount: number
): Promise<{ error: Error | null }> {
  try {
    const formattedAmount = `₹${amount.toLocaleString('en-IN')}`;
    const daysUntilRenewal = Math.ceil((renewalDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    const { error } = await supabase.functions.invoke('send-email', {
      body: {
        to: email,
        subject: `Subscription Renewal Reminder - ${planName} Plan`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #fff3cd; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; border: 1px solid #ffc107;">
              <h1 style="color: #856404; margin: 0;">🔔 Renewal Reminder</h1>
            </div>
            
            <div style="padding: 30px; background: #ffffff; border: 1px solid #e0e0e0;">
              <p style="font-size: 16px;">Hi ${fullName},</p>
              <p>Your ${planName} subscription will renew in <strong>${daysUntilRenewal} days</strong>.</p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Plan:</strong> ${planName}</p>
                <p style="margin: 10px 0;"><strong>Renewal Date:</strong> ${renewalDate.toLocaleDateString()}</p>
                <p style="margin: 0;"><strong>Amount:</strong> ${formattedAmount}</p>
              </div>
              
              <p>Make sure your payment method is up to date to avoid any service interruption.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${window.location.origin}/billing" 
                   style="display: inline-block; padding: 14px 30px; background: #ffc107; color: #333; text-decoration: none; border-radius: 8px; font-weight: bold;">
                  Manage Subscription
                </a>
              </div>
            </div>
            
            <div style="padding: 20px; background: #f8f9fa; text-align: center; border-radius: 0 0 10px 10px;">
              <p style="margin: 0; color: #666; font-size: 12px;">
                © ${new Date().getFullYear()} KSFoundation. All rights reserved.
              </p>
            </div>
          </div>
        `,
      },
    });

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Failed to send renewal reminder email:', error);
    return { error: error instanceof Error ? error : new Error('Failed to send email') };
  }
}
