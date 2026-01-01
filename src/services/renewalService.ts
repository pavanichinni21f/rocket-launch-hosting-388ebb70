import { supabase } from '@/integrations/supabase/client';

export interface RenewalSettings {
  auto_renew: boolean;
  renewal_period: 'monthly' | 'yearly';
  next_renewal_date: string;
  payment_method_id?: string;
}

export async function getRenewalSettings(userId: string): Promise<RenewalSettings[]> {
  return [
    {
      auto_renew: true,
      renewal_period: 'monthly',
      next_renewal_date: '2025-02-15T00:00:00Z',
      payment_method_id: 'pm_123'
    }
  ];
}

export async function updateRenewalSettings(userId: string, settings: RenewalSettings): Promise<void> {
  console.log('Updated renewal settings for user', userId, settings);
}

export async function processRenewals(): Promise<void> {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);

  const accountsDue = [
    { id: 'acc_001', user_id: 'user_123', amount: 19.99, plan: 'VPS Basic' }
  ];

  for (const account of accountsDue) {
    await processAccountRenewal(account);
  }
}

async function processAccountRenewal(account: any): Promise<void> {
  try {
    const settings = await getRenewalSettings(account.user_id);
    const accountSettings = settings[0];

    if (!accountSettings?.auto_renew) {
      await sendRenewalReminder(account);
      return;
    }

    await createRenewalOrder(account, accountSettings);
  } catch (error) {
    console.error('Failed to process renewal for account', account.id, error);
  }
}

async function createRenewalOrder(account: any, settings: RenewalSettings): Promise<void> {
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      user_id: account.user_id,
      amount_cents: Math.round(account.amount * 100),
      currency: 'USD',
      status: 'pending',
      plan: 'starter' as any,
      billing_cycle: settings.renewal_period,
      hosting_account_id: account.id
    })
    .select()
    .single();

  if (error) throw error;

  console.log('Processing automatic renewal payment for order', order?.id);

  const nextRenewal = new Date(settings.next_renewal_date);
  if (settings.renewal_period === 'monthly') {
    nextRenewal.setMonth(nextRenewal.getMonth() + 1);
  } else {
    nextRenewal.setFullYear(nextRenewal.getFullYear() + 1);
  }

  await updateRenewalSettings(account.user_id, {
    ...settings,
    next_renewal_date: nextRenewal.toISOString()
  });
}

async function sendRenewalReminder(account: any): Promise<void> {
  console.log('Sending renewal reminder for account', account.id);
}

export async function cancelAutoRenewal(userId: string, accountId: string): Promise<void> {
  const settings = await getRenewalSettings(userId);
  const updatedSettings = settings.map(setting => ({
    ...setting,
    auto_renew: false
  }));

  await updateRenewalSettings(userId, updatedSettings[0]);
}

export async function enableAutoRenewal(userId: string, accountId: string, paymentMethodId: string): Promise<void> {
  const settings: RenewalSettings = {
    auto_renew: true,
    renewal_period: 'monthly',
    next_renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    payment_method_id: paymentMethodId
  };

  await updateRenewalSettings(userId, settings);
}
