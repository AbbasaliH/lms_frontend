// User roles
export type UserRole = 'admin' | 'super_admin' | 'customer' | 'delivery_boy';

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  shopId?: string; // For admin users
}

// Order statuses
export type OrderStatus = 'pending' | 'processing' | 'ready' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

// Order Item
export interface OrderItem {
  id: string;
  serviceType: string;
  quantity: number;
  price: number;
  notes?: string;
}

// Order
export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  orderDate: Date;
  deliveryDate: Date;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: PaymentStatus;
  assignedTo?: string; // Delivery person ID
  notes?: string;
}

// Customer subscription status
export type SubscriptionStatus = 'active' | 'inactive' | 'expired';

// Customer
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  subscriptionStatus: SubscriptionStatus;
  joinDate: Date;
  status: 'active' | 'blocked';
}

// Delivery Boy
export interface DeliveryBoy {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicleType: string;
  totalDeliveries: number;
  rating: number;
  status: 'active' | 'inactive' | 'blocked';
}

// Inventory Item
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minQuantity: number;
  price: number;
  supplier?: string;
}

// Payment
export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: 'cash' | 'card' | 'upi' | 'wallet';
  status: PaymentStatus;
  date: Date;
  transactionId?: string;
}

// Pricing
export interface PricingItem {
  id: string;
  serviceType: string;
  category: string;
  basePrice: number;
  minQuantity?: number;
  seasonalPrice?: number;
}

// Subscription Plan
export interface SubscriptionPlan {
  id: string;
  name: string;
  duration: number; // in days
  price: number;
  features: string[];
  discountPercentage: number;
}

// Active Subscription
export interface Subscription {
  id: string;
  customerId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  status: SubscriptionStatus;
  autoRenew: boolean;
}

// Client Query
export interface ClientQuery {
  id: string;
  customerId: string;
  customerName: string;
  subject: string;
  message: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  resolvedAt?: Date;
  response?: string;
}

// Notification
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

// Shop
export interface Shop {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  subscriptionStatus: SubscriptionStatus;
  revenue: number;
  adminId: string;
  createdAt: Date;
}

// Dashboard Stats
export interface DashboardStats {
  totalOrders: number;
  revenue: number;
  totalCustomers: number;
  pendingOrders: number;
  completedOrders: number;
  activeSubscriptions: number;
}