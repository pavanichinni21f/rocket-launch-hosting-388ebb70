/**
 * Order Service - Creates and manages orders using the orders table
 */

import { supabase } from '@/integrations/supabase/client';
import { getCart, clearCart, type Cart, type CartItem } from './cartService';

export interface Order {
  id: string;
  userId: string;
  plan: 'free' | 'starter' | 'business' | 'enterprise';
  amountCents: number;
  currency: string;
  status: string;
  billingCycle?: string;
  createdAt: string;
  paidAt?: string;
  items?: CartItem[];
}

export interface CreateOrderResult {
  success: boolean;
  order?: Order;
  error?: string;
}

/**
 * Create an order from the current cart
 */
export async function createOrderFromCart(userId: string): Promise<CreateOrderResult> {
  try {
    const cart = await getCart();
    
    if (cart.items.length === 0) {
      return { success: false, error: 'Cart is empty' };
    }

    // Determine the plan based on cart items
    let plan: 'free' | 'starter' | 'business' | 'enterprise' = 'starter';
    const planItem = cart.items.find(item => 
      ['starter', 'business', 'enterprise'].includes(item.serviceId)
    );
    if (planItem) {
      plan = planItem.serviceId as 'starter' | 'business' | 'enterprise';
    }

    // Determine billing cycle
    const billingCycle = cart.items[0]?.billingCycle || 'monthly';

    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        plan,
        amount_cents: Math.round(cart.total * 100),
        currency: cart.currency,
        status: 'pending',
        billing_cycle: billingCycle,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create order:', error);
      return { success: false, error: error.message };
    }

    const order: Order = {
      id: data.id,
      userId: data.user_id,
      plan: data.plan,
      amountCents: data.amount_cents,
      currency: data.currency || 'INR',
      status: data.status || 'pending',
      billingCycle: data.billing_cycle || undefined,
      createdAt: data.created_at || new Date().toISOString(),
      paidAt: data.paid_at || undefined,
      items: cart.items,
    };

    return { success: true, order };
  } catch (err) {
    console.error('Error creating order:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * Get orders for a user
 */
export async function getOrders(userId: string): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch orders:', error);
      return [];
    }

    return (data || []).map(order => ({
      id: order.id,
      userId: order.user_id,
      plan: order.plan,
      amountCents: order.amount_cents,
      currency: order.currency || 'INR',
      status: order.status || 'pending',
      billingCycle: order.billing_cycle || undefined,
      createdAt: order.created_at || new Date().toISOString(),
      paidAt: order.paid_at || undefined,
    }));
  } catch (err) {
    console.error('Error fetching orders:', err);
    return [];
  }
}

/**
 * Get a single order by ID
 */
export async function getOrder(orderId: string, userId: string): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      console.error('Failed to fetch order:', error);
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      plan: data.plan,
      amountCents: data.amount_cents,
      currency: data.currency || 'INR',
      status: data.status || 'pending',
      billingCycle: data.billing_cycle || undefined,
      createdAt: data.created_at || new Date().toISOString(),
      paidAt: data.paid_at || undefined,
    };
  } catch (err) {
    console.error('Error fetching order:', err);
    return null;
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string, 
  status: string, 
  paymentIntentId?: string
): Promise<boolean> {
  try {
    const updateData: Record<string, unknown> = { status };
    
    if (status === 'paid') {
      updateData.paid_at = new Date().toISOString();
    }
    
    if (paymentIntentId) {
      updateData.stripe_payment_intent_id = paymentIntentId;
    }

    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId);

    if (error) {
      console.error('Failed to update order status:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error updating order:', err);
    return false;
  }
}

/**
 * Complete order and clear cart
 */
export async function completeOrder(orderId: string): Promise<boolean> {
  const success = await updateOrderStatus(orderId, 'paid');
  if (success) {
    await clearCart();
  }
  return success;
}
