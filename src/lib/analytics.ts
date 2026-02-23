/**
 * Google Analytics utility functions for tracking custom events
 * 
 * Usage:
 * - Page views are tracked automatically by the GoogleAnalytics component
 * - Use trackEvent() for custom events like product views, add to cart, purchases, etc.
 */

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'consent',
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

/**
 * Track a custom event with Google Analytics
 * 
 * @param eventName - Name of the event (e.g., 'product_view', 'add_to_cart', 'purchase')
 * @param params - Event parameters (e.g., { product_id: '123', product_name: 'Vase', value: 50 })
 * 
 * @example
 * // Track product view
 * trackEvent('product_view', {
 *   product_id: 'prod_123',
 *   product_name: 'Ceramic Vase',
 *   product_category: 'Home Decor',
 *   value: 49.99,
 *   currency: 'USD'
 * });
 * 
 * @example
 * // Track add to cart
 * trackEvent('add_to_cart', {
 *   product_id: 'prod_123',
 *   product_name: 'Ceramic Vase',
 *   quantity: 1,
 *   value: 49.99,
 *   currency: 'USD'
 * });
 * 
 * @example
 * // Track purchase
 * trackEvent('purchase', {
 *   transaction_id: 'txn_456',
 *   value: 149.99,
 *   currency: 'USD',
 *   items: [
 *     { product_id: 'prod_123', product_name: 'Ceramic Vase', quantity: 2, price: 49.99 }
 *   ]
 * });
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, any>
): void {
  if (typeof window === 'undefined' || !window.gtag) {
    // Silently skip if GA is not loaded (e.g., during SSR or if blocked)
    return;
  }

  window.gtag('event', eventName, params);
}

/**
 * Track a product view
 */
export function trackProductView(product: {
  id: string;
  name: string;
  category?: string;
  price?: number;
  currency?: string;
}): void {
  trackEvent('view_item', {
    currency: product.currency || 'USD',
    value: product.price,
    items: [{
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
      price: product.price,
    }],
  });
}

/**
 * Track add to cart event
 */
export function trackAddToCart(product: {
  id: string;
  name: string;
  category?: string;
  price: number;
  quantity: number;
  currency?: string;
}): void {
  trackEvent('add_to_cart', {
    currency: product.currency || 'USD',
    value: product.price * product.quantity,
    items: [{
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
      price: product.price,
      quantity: product.quantity,
    }],
  });
}

/**
 * Track remove from cart event
 */
export function trackRemoveFromCart(product: {
  id: string;
  name: string;
  category?: string;
  price: number;
  quantity: number;
  currency?: string;
}): void {
  trackEvent('remove_from_cart', {
    currency: product.currency || 'USD',
    value: product.price * product.quantity,
    items: [{
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
      price: product.price,
      quantity: product.quantity,
    }],
  });
}

/**
 * Track checkout begin
 */
export function trackBeginCheckout(cart: {
  value: number;
  currency?: string;
  items: Array<{
    id: string;
    name: string;
    category?: string;
    price: number;
    quantity: number;
  }>;
}): void {
  trackEvent('begin_checkout', {
    currency: cart.currency || 'USD',
    value: cart.value,
    items: cart.items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      item_category: item.category,
      price: item.price,
      quantity: item.quantity,
    })),
  });
}

/**
 * Track purchase completion
 */
export function trackPurchase(order: {
  transactionId: string;
  value: number;
  currency?: string;
  tax?: number;
  shipping?: number;
  items: Array<{
    id: string;
    name: string;
    category?: string;
    price: number;
    quantity: number;
  }>;
}): void {
  trackEvent('purchase', {
    transaction_id: order.transactionId,
    currency: order.currency || 'USD',
    value: order.value,
    tax: order.tax,
    shipping: order.shipping,
    items: order.items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      item_category: item.category,
      price: item.price,
      quantity: item.quantity,
    })),
  });
}

/**
 * Track search event
 */
export function trackSearch(searchTerm: string): void {
  trackEvent('search', {
    search_term: searchTerm,
  });
}

/**
 * Track user sign up
 */
export function trackSignUp(method: string = 'email'): void {
  trackEvent('sign_up', {
    method,
  });
}

/**
 * Track user login
 */
export function trackLogin(method: string = 'email'): void {
  trackEvent('login', {
    method,
  });
}
