const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://food-delivery-84az.onrender.com';

export async function apiRequest(path, options = {}) {
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const defaultHeaders = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('authToken');
  const headers = {
    ...defaultHeaders,
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const response = await fetch(url, { ...options, headers });
  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }
  if (!response.ok) {
    const message = (data && (data.message || data.error)) || `HTTP ${response.status}`;
    throw new Error(message);
  }
  return data;
}

export async function createOrder({ restaurantId, items, userName, userEmail }) {
  return apiRequest('/api/orders', {
    method: 'POST',
    body: JSON.stringify({ restaurantId, items, userName, userEmail })
  });
}

export async function getOrders(restaurantId) {
  const params = restaurantId ? `?restaurantId=${encodeURIComponent(restaurantId)}` : ''
  return apiRequest(`/api/orders${params}`, {
    method: 'GET'
  })
}

export async function getUserOrders(userEmail) {
  if (!userEmail) throw new Error('userEmail required')
  const params = `?userEmail=${encodeURIComponent(userEmail)}`
  return apiRequest(`/api/orders/user${params}`, { method: 'GET' })
}

export async function updateOrderStatus(orderId, status) {
  return apiRequest(`/api/orders/${orderId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  })
}

export async function getOrder(orderId) {
  if (!orderId) throw new Error('orderId required')
  return apiRequest(`/api/orders/${orderId}`, { method: 'GET' })
}

export async function getStats() {
  return apiRequest('/api/stats', { method: 'GET' })
}

export async function getRestaurants() {
  return apiRequest('/api/restaurants', { method: 'GET' })
}

export async function getRestaurantContacts() {
  return apiRequest('/api/restaurants/contacts', { method: 'GET' })
}

// Analytics Endpoints
export async function getAnalyticsSummary(restaurantId) {
  return apiRequest(`/api/analytics/${encodeURIComponent(restaurantId)}/summary`, { method: 'GET' })
}
export async function getAnalyticsBestItems(restaurantId, range = '30d') {
  return apiRequest(`/api/analytics/${encodeURIComponent(restaurantId)}/best-items?range=${range}`, { method: 'GET' })
}
export async function getAnalyticsStatusBreakdown(restaurantId, range = 30) {
  return apiRequest(`/api/analytics/${encodeURIComponent(restaurantId)}/status-breakdown?range=${range}`, { method: 'GET' })
}
export async function getAnalyticsPeakHours(restaurantId) {
  return apiRequest(`/api/analytics/${encodeURIComponent(restaurantId)}/peak-hours`, { method: 'GET' })
}
export async function getAnalyticsRevenueTrend(restaurantId) {
  return apiRequest(`/api/analytics/${encodeURIComponent(restaurantId)}/revenue-trend`, { method: 'GET' })
}
export async function getAnalyticsTopCustomers(restaurantId) {
  return apiRequest(`/api/analytics/${encodeURIComponent(restaurantId)}/top-customers`, { method: 'GET' })
}

// Smart Reorder (Quick Reorder Suggestion)
export async function getQuickReorderSuggestion(userEmail) {
  if (!userEmail) throw new Error('userEmail required')
  const params = `?userEmail=${encodeURIComponent(userEmail)}`
  return apiRequest(`/api/recommendations/quick-reorder${params}`, { method: 'GET' })
}

export default {
  apiRequest,
  createOrder,
  getOrders,
  getUserOrders,
  getOrder,
  getStats,
  getRestaurants,
  getRestaurantContacts,
  getAnalyticsSummary,
  getAnalyticsBestItems,
  getAnalyticsStatusBreakdown,
  getAnalyticsPeakHours,
  getAnalyticsRevenueTrend,
  getAnalyticsTopCustomers,
  getQuickReorderSuggestion,
  updateOrderStatus
};


