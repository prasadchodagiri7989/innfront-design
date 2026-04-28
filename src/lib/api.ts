/**
 * Centralised API client for Hotel Abhitej Inn
 * Replaces all data.json / localStorage usage in the frontend.
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

// ── Token helpers ─────────────────────────────────────────────────────────────

export const getAccessToken = (): string | null =>
  localStorage.getItem('accessToken');

export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

// ── Core fetch wrapper ────────────────────────────────────────────────────────

interface RequestOptions extends RequestInit {
  auth?: boolean;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { auth = true, headers: extraHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(extraHeaders as Record<string, string>),
  };

  if (auth) {
    const token = getAccessToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers,
    ...rest,
  });

  // Attempt token refresh on 401
  if (response.status === 401 && auth) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${getAccessToken()}`;
      const retried = await fetch(`${BASE_URL}${endpoint}`, { headers, ...rest });
      if (!retried.ok) {
        clearTokens();
        throw new ApiError(retried.status, 'Session expired. Please log in again.');
      }
      return retried.json();
    } else {
      clearTokens();
      throw new ApiError(401, 'Session expired. Please log in again.');
    }
  }

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(response.status, data.message || 'An error occurred', data.errors);
  }

  return data;
}

// ── ApiError class ────────────────────────────────────────────────────────────

export class ApiError extends Error {
  status: number;
  errors?: { field: string; message: string }[];

  constructor(status: number, message: string, errors?: { field: string; message: string }[]) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

// ── Token refresh ─────────────────────────────────────────────────────────────

async function tryRefreshToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    setTokens(data.data.accessToken, data.data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

// ── Auth API ──────────────────────────────────────────────────────────────────

export const authApi = {
  register: (payload: { name: string; email: string; password: string; phone?: string }) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(payload), auth: false }),

  login: (email: string, password: string) =>
    request<{ success: boolean; data: { user: User; accessToken: string; refreshToken: string } }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }), auth: false }
    ),

  logout: () => request('/auth/logout', { method: 'POST' }),

  getMe: () => request<{ data: User }>('/auth/me'),

  changePassword: (currentPassword: string, newPassword: string) =>
    request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};

// ── Rooms API ─────────────────────────────────────────────────────────────────

export const roomsApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<{ data: Room[]; meta: PaginationMeta }>(`/rooms${qs}`, { auth: false });
  },

  getAvailable: (checkIn: string, checkOut: string, params?: Record<string, string>) => {
    const qs = new URLSearchParams({ checkIn, checkOut, ...params }).toString();
    return request<{ data: Room[] }>(`/rooms/available?${qs}`, { auth: false });
  },

  getById: (id: string) =>
    request<{ data: Room }>(`/rooms/${id}`, { auth: false }),

  getBookedDates: (id: string) =>
    request<{ data: { checkInDate: string; checkOutDate: string }[] }>(
      `/rooms/${id}/booked-dates`,
      { auth: false }
    ),

  // Admin only
  create: (payload: Partial<Room>) =>
    request('/rooms', { method: 'POST', body: JSON.stringify(payload) }),

  update: (id: string, payload: Partial<Room>) =>
    request(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),

  delete: (id: string) =>
    request(`/rooms/${id}`, { method: 'DELETE' }),

  updateStatus: (id: string, status: string) =>
    request(`/rooms/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};

// ── Bookings API ──────────────────────────────────────────────────────────────

export const bookingsApi = {
  create: (payload: CreateBookingPayload) =>
    request('/bookings', { method: 'POST', body: JSON.stringify(payload) }),

  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<{ data: Booking[]; meta: PaginationMeta }>(`/bookings${qs}`);
  },

  getById: (id: string) =>
    request<{ data: Booking }>(`/bookings/${id}`),

  cancel: (id: string, reason?: string) =>
    request(`/bookings/${id}/cancel`, { method: 'PUT', body: JSON.stringify({ reason }) }),
};

// ── Payments API ──────────────────────────────────────────────────────────────

export const paymentsApi = {
  createRazorpayOrder: (bookingId: string) =>
    request('/payments/razorpay/order', { method: 'POST', body: JSON.stringify({ bookingId }) }),

  verifyRazorpayPayment: (payload: {
    bookingId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) =>
    request('/payments/razorpay/verify', { method: 'POST', body: JSON.stringify(payload) }),

  getByBooking: (bookingId: string) =>
    request(`/payments/${bookingId}`),
};

// ── Invoices API ──────────────────────────────────────────────────────────────

export const invoicesApi = {
  getByBooking: (bookingId: string) =>
    request(`/invoices/${bookingId}`),

  downloadPdf: (bookingId: string) =>
    `${BASE_URL}/invoices/${bookingId}/pdf`,
};

// ── Users API ─────────────────────────────────────────────────────────────────

export const usersApi = {
  getProfile: () => request<{ data: User }>('/users/profile'),

  updateProfile: (payload: { name?: string; phone?: string }) =>
    request('/users/profile', { method: 'PUT', body: JSON.stringify(payload) }),

  getMyBookings: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<{ data: Booking[]; meta: PaginationMeta }>(`/users/bookings${qs}`);
  },

  // Admin
  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<{ data: User[]; meta: PaginationMeta }>(`/users${qs}`);
  },
};

// ── Admin API ─────────────────────────────────────────────────────────────────

export const adminApi = {
  getDashboard: () => request('/admin/dashboard'),
  getRevenueReport: (months?: number) =>
    request(`/admin/reports/revenue?months=${months ?? 6}`),
  getOccupancyReport: (months?: number) =>
    request(`/admin/reports/occupancy?months=${months ?? 6}`),
};

// ── Reception API ─────────────────────────────────────────────────────────────

export const receptionApi = {
  getTodayActivity: () => request('/reception/today'),
  createOfflineBooking: (payload: object) =>
    request('/reception/book', { method: 'POST', body: JSON.stringify(payload) }),
  checkIn: (bookingId: string) =>
    request('/reception/checkin', { method: 'POST', body: JSON.stringify({ bookingId }) }),
  checkOut: (bookingId: string) =>
    request('/reception/checkout', { method: 'POST', body: JSON.stringify({ bookingId }) }),
};

// ── Restaurant API ────────────────────────────────────────────────────────────

export const restaurantApi = {
  createOrder: (payload: object) =>
    request('/restaurant/orders', { method: 'POST', body: JSON.stringify(payload) }),
  getOrders: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/restaurant/orders${qs}`);
  },
};

// ── Type definitions ──────────────────────────────────────────────────────────

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'receptionist' | 'user';
  loyaltyTier: string;
  memberSince: number;
  totalStays: number;
  isActive: boolean;
}

export interface Room {
  _id: string;
  roomNumber: string;
  floor: number;
  type: string;
  price: number;
  capacity: number;
  size?: string;
  beds?: string;
  amenities: string[];
  description?: string;
  images: string[];
  status: string;
  rating: { average: number; count: number };
}

export interface Booking {
  _id: string;
  bookingId: string;
  user: User | string;
  room: Room | string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  nights: number;
  subtotal: number;
  tax: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  specialRequests?: string;
  createdAt: string;
}

export interface CreateBookingPayload {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  specialRequests?: string;
  paymentMethod?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
