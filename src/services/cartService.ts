/**
 * Cart Service - Local storage based cart management
 * Uses localStorage for cart persistence since cart_items table doesn't exist in DB
 */

const CART_STORAGE_KEY = 'ks_hosting_cart';
const DISCOUNT_STORAGE_KEY = 'ks_hosting_discount';

export interface CartItem {
  id: string;
  serviceId: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  billingCycle: 'monthly' | 'yearly' | 'one-time';
  configuration?: Record<string, unknown>;
  selectedAddons?: string[];
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  total: number;
  currency: string;
}

export interface DiscountCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minimumOrder?: number;
  expiresAt?: string;
}

// Mock services data (since services table doesn't exist)
const mockServices: Record<string, { name: string; price: number; billingCycle: string }> = {
  'starter': { name: 'Starter Plan', price: 499, billingCycle: 'monthly' },
  'business': { name: 'Business Plan', price: 999, billingCycle: 'monthly' },
  'enterprise': { name: 'Enterprise Plan', price: 2499, billingCycle: 'monthly' },
  'domain-com': { name: '.com Domain', price: 999, billingCycle: 'yearly' },
  'domain-in': { name: '.in Domain', price: 599, billingCycle: 'yearly' },
  'ssl-basic': { name: 'Basic SSL', price: 1999, billingCycle: 'yearly' },
  'ssl-wildcard': { name: 'Wildcard SSL', price: 4999, billingCycle: 'yearly' },
  'shared-monthly': { name: 'Shared Hosting - Monthly', price: 499, billingCycle: 'monthly' },
  'shared-annual': { name: 'Shared Hosting - Annual', price: 4999, billingCycle: 'yearly' },
  'vps-monthly': { name: 'VPS - Monthly', price: 1999, billingCycle: 'monthly' },
  'vps-annual': { name: 'VPS - Annual', price: 19999, billingCycle: 'yearly' },
  'cloud-monthly': { name: 'Cloud - Monthly', price: 9999, billingCycle: 'monthly' },
  'cloud-annual': { name: 'Cloud - Annual', price: 99999, billingCycle: 'yearly' },
  'wordpress-monthly': { name: 'WordPress - Monthly', price: 999, billingCycle: 'monthly' },
  'wordpress-annual': { name: 'WordPress - Annual', price: 9999, billingCycle: 'yearly' },
};

// Mock discount codes
const mockDiscountCodes: DiscountCode[] = [
  { code: 'WELCOME10', type: 'percentage', value: 10, minimumOrder: 500 },
  { code: 'FLAT100', type: 'fixed', value: 100, minimumOrder: 1000 },
  { code: 'SAVE20', type: 'percentage', value: 20, minimumOrder: 2000 },
];

function getCartFromStorage(): Cart {
  if (typeof window === 'undefined') {
    return {
      items: [],
      subtotal: 0,
      discount: 0,
      total: 0,
      currency: 'INR',
    };
  }
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to parse cart from storage:', e);
  }
  return {
    items: [],
    subtotal: 0,
    discount: 0,
    total: 0,
    currency: 'INR',
  };
}

function saveCartToStorage(cart: Cart): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error('Failed to save cart to storage:', e);
  }
}

function recalculateCart(cart: Cart): Cart {
  const subtotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
  const total = Math.max(0, subtotal - cart.discount);
  return {
    ...cart,
    subtotal,
    total,
  };
}

export async function addToCart(
  serviceId: string,
  quantity: number = 1,
  configuration?: Record<string, unknown>,
  selectedAddons?: string[]
): Promise<Cart> {
  const cart = getCartFromStorage();
  const service = mockServices[serviceId];
  
  if (!service) {
    throw new Error(`Service not found: ${serviceId}`);
  }

  const existingIndex = cart.items.findIndex(item => item.serviceId === serviceId);
  
  if (existingIndex >= 0) {
    // Update existing item
    cart.items[existingIndex].quantity += quantity;
    cart.items[existingIndex].totalPrice = cart.items[existingIndex].unitPrice * cart.items[existingIndex].quantity;
  } else {
    // Add new item
    const newItem: CartItem = {
      id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      serviceId,
      serviceName: service.name,
      quantity,
      unitPrice: service.price,
      totalPrice: service.price * quantity,
      billingCycle: service.billingCycle as 'monthly' | 'yearly' | 'one-time',
      configuration,
      selectedAddons,
    };
    cart.items.push(newItem);
  }

  const updatedCart = recalculateCart(cart);
  saveCartToStorage(updatedCart);
  return updatedCart;
}

export async function removeFromCart(itemId: string): Promise<Cart> {
  const cart = getCartFromStorage();
  cart.items = cart.items.filter(item => item.id !== itemId);
  const updatedCart = recalculateCart(cart);
  saveCartToStorage(updatedCart);
  return updatedCart;
}

export async function updateCartItemQuantity(itemId: string, quantity: number): Promise<Cart> {
  const cart = getCartFromStorage();
  const item = cart.items.find(i => i.id === itemId);
  
  if (item) {
    if (quantity <= 0) {
      return removeFromCart(itemId);
    }
    item.quantity = quantity;
    item.totalPrice = item.unitPrice * quantity;
  }
  
  const updatedCart = recalculateCart(cart);
  saveCartToStorage(updatedCart);
  return updatedCart;
}

export async function getCart(): Promise<Cart> {
  return getCartFromStorage();
}

export async function clearCart(): Promise<Cart> {
  const emptyCart: Cart = {
    items: [],
    subtotal: 0,
    discount: 0,
    total: 0,
    currency: 'INR',
  };
  saveCartToStorage(emptyCart);
  if (typeof window !== 'undefined') {
    localStorage.removeItem(DISCOUNT_STORAGE_KEY);
  }
  return emptyCart;
}

export async function applyDiscountCode(code: string): Promise<{ success: boolean; cart: Cart; message: string }> {
  const cart = getCartFromStorage();
  const discountCode = mockDiscountCodes.find(dc => dc.code.toUpperCase() === code.toUpperCase());

  if (!discountCode) {
    return { success: false, cart, message: 'Invalid discount code' };
  }

  if (discountCode.minimumOrder && cart.subtotal < discountCode.minimumOrder) {
    return { 
      success: false, 
      cart, 
      message: `Minimum order of ₹${discountCode.minimumOrder} required` 
    };
  }

  if (discountCode.expiresAt && new Date(discountCode.expiresAt) < new Date()) {
    return { success: false, cart, message: 'Discount code has expired' };
  }

  let discount = 0;
  if (discountCode.type === 'percentage') {
    discount = Math.round(cart.subtotal * (discountCode.value / 100));
  } else {
    discount = discountCode.value;
  }

  cart.discount = discount;
  cart.discountCode = discountCode.code;
  
  const updatedCart = recalculateCart(cart);
  saveCartToStorage(updatedCart);
  if (typeof window !== 'undefined') {
    localStorage.setItem(DISCOUNT_STORAGE_KEY, discountCode.code);
  }

  return { 
    success: true, 
    cart: updatedCart, 
    message: `Discount of ₹${discount} applied!` 
  };
}

export async function removeDiscountCode(): Promise<Cart> {
  const cart = getCartFromStorage();
  cart.discount = 0;
  cart.discountCode = undefined;
  
  const updatedCart = recalculateCart(cart);
  saveCartToStorage(updatedCart);
  if (typeof window !== 'undefined') {
    localStorage.removeItem(DISCOUNT_STORAGE_KEY);
  }
  
  return updatedCart;
}

export function getCartItemCount(): number {
  const cart = getCartFromStorage();
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getServicePricingConfig() {
  return mockServices;
}

export async function calculateCartTotal(couponCode?: string): Promise<{ subtotal: number; discount: number; total: number }> {
  const cart = getCartFromStorage();
  
  if (couponCode && !cart.discountCode) {
    await applyDiscountCode(couponCode);
    const updatedCart = getCartFromStorage();
    return {
      subtotal: updatedCart.subtotal,
      discount: updatedCart.discount,
      total: updatedCart.total,
    };
  }
  
  return {
    subtotal: cart.subtotal,
    discount: cart.discount,
    total: cart.total,
  };
}
