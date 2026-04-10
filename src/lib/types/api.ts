// API Request/Response Types

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: ApiUser;
    token: string;
    refreshToken: string;
  };
}

export interface ApiUser {
  id: string;
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN' | 'CUSTOMER' | 'DELIVERY_BOY';
  walletBalance: number;
  profileImage: string | null;
  villageName: string | null;
  streetName: string | null;
  createdAt: string;
  updatedAt: string;
  subscriptionId: string | null;
  fullName: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phoneNumber: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'BLOCKED';
  notifyByEmail: boolean;
  notifyByPush: boolean;
  notifyBySMS: boolean;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    refreshToken: string;
  };
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
  statusCode?: number;
}

// Order API Types
export interface ApiOrderUser {
  id: string;
  fullName: string;
  phoneNumber: string;
  gender: string;
}

export interface ApiDeliveryBoy {
  id: string;
  fullName: string;
  phoneNumber: string;
}

export interface ApiProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  addOns: unknown[];
  clothTypes: unknown[];
}

export interface ApiOrder {
  id: string;
  userId: string;
  deliveryBoyId: string | null;
  productId: string;
  status: 'PENDING' | 'PROCESSING' | 'READY' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  deadline: string | null;
  clientQueryId: string | null;
  createdAt: string;
  updatedAt: string;
  addressId: string | null;
  isRecurring: boolean;
  promoCodeId: string | null;
  recurrenceInterval: string | null;
  scheduledAt: string | null;
  specialInstructions: string | null;
  user: ApiOrderUser;
  deliveryBoy: ApiDeliveryBoy | null;
  product: ApiProduct;
}

export interface OrdersResponse {
  success: boolean;
  data: ApiOrder[];
}