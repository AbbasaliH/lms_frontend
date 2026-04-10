import type {
  User,
  Order,
  Customer,
  InventoryItem,
  Payment,
  PricingItem,
  SubscriptionPlan,
  Subscription,
  ClientQuery,
  Notification,
  Shop,
  DashboardStats,
  DeliveryBoy as DeliveryBoySimple,
} from './types/schema';
import type { DeliveryBoy } from './types/delivery-boy';
import { VehicleType, DeliveryBoyStatus, UserStatus } from './types/delivery-boy';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@laundry.com',
    name: 'John Admin',
    role: 'admin',
    phone: '+1234567890',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    shopId: 'shop-1',
  },
  {
    id: '2',
    email: 'superadmin@laundry.com',
    name: 'Sarah Super',
    role: 'super_admin',
    phone: '+1234567891',
    avatar: 'https://i.pravatar.cc/150?u=superadmin',
  },
];

// Mock Customers
export const mockCustomers: Customer[] = [
  {
    id: 'c1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '+1234567892',
    address: '123 Main St, New York, NY 10001',
    totalOrders: 45,
    totalSpent: 2500,
    subscriptionStatus: 'active',
    joinDate: new Date('2024-01-15'),
    status: 'active',
  },
  {
    id: 'c2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    phone: '+1234567893',
    address: '456 Oak Ave, Brooklyn, NY 11201',
    totalOrders: 32,
    totalSpent: 1800,
    subscriptionStatus: 'inactive',
    joinDate: new Date('2024-02-20'),
    status: 'active',
  },
  {
    id: 'c3',
    name: 'Carol Williams',
    email: 'carol@example.com',
    phone: '+1234567894',
    address: '789 Pine Rd, Queens, NY 11354',
    totalOrders: 28,
    totalSpent: 1500,
    subscriptionStatus: 'active',
    joinDate: new Date('2024-03-10'),
    status: 'active',
  },
];

// Mock Delivery Boys (Enhanced)
export const mockDeliveryBoysEnhanced: DeliveryBoy[] = [
  {
    id: 'db-1',
    userId: 'user-db-1',
    vehicleType: VehicleType.BIKE,
    vehicleNumber: 'KA01AB1234',
    licenseNumber: 'KA1234567890',
    isAvailable: true,
    status: DeliveryBoyStatus.ACTIVE,
    totalDeliveries: 45,
    successfulDeliveries: 43,
    averageRating: 4.7,
    earnings: 12500,
    joiningDate: new Date('2024-12-01'),
    lastActiveAt: new Date(),
    aadharNumber: '123412341234',
    emergencyContact: '+919876543211',
    workingHoursStart: '08:00',
    workingHoursEnd: '20:00',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date(),
    user: {
      id: 'user-db-1',
      email: 'rajesh@example.com',
      fullName: 'Rajesh Kumar',
      gender: 'Male',
      phoneNumber: '+919876543210',
      profileImage: 'https://i.pravatar.cc/150?u=rajesh',
      villageName: 'Rajajinagar',
      streetName: '4th Block, 8th Main',
      status: UserStatus.APPROVED,
    },
  },
  {
    id: 'db-2',
    userId: 'user-db-2',
    vehicleType: VehicleType.SCOOTER,
    vehicleNumber: 'KA02XY5678',
    licenseNumber: 'KA9876543210',
    isAvailable: true,
    status: DeliveryBoyStatus.ACTIVE,
    totalDeliveries: 38,
    successfulDeliveries: 36,
    averageRating: 4.5,
    earnings: 10200,
    joiningDate: new Date('2024-12-15'),
    lastActiveAt: new Date(),
    emergencyContact: '+919123456788',
    workingHoursStart: '09:00',
    workingHoursEnd: '19:00',
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date(),
    user: {
      id: 'user-db-2',
      email: 'priya@example.com',
      fullName: 'Priya Sharma',
      gender: 'Female',
      phoneNumber: '+919123456789',
      profileImage: 'https://i.pravatar.cc/150?u=priya',
      villageName: 'Indiranagar',
      streetName: '100 Feet Road',
      status: UserStatus.APPROVED,
    },
  },
  {
    id: 'db-3',
    userId: 'user-db-3',
    vehicleType: VehicleType.VAN,
    vehicleNumber: 'KA03MN9012',
    licenseNumber: 'KA1122334455',
    isAvailable: false,
    status: DeliveryBoyStatus.ACTIVE,
    totalDeliveries: 52,
    successfulDeliveries: 50,
    averageRating: 4.9,
    earnings: 15800,
    joiningDate: new Date('2024-11-01'),
    lastActiveAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    emergencyContact: '+918765432100',
    workingHoursStart: '07:00',
    workingHoursEnd: '21:00',
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date(),
    user: {
      id: 'user-db-3',
      email: 'amit@example.com',
      fullName: 'Amit Patel',
      gender: 'Male',
      phoneNumber: '+918765432101',
      profileImage: 'https://i.pravatar.cc/150?u=amit',
      villageName: 'Koramangala',
      streetName: '5th Block',
      status: UserStatus.APPROVED,
    },
  },
  {
    id: 'db-4',
    userId: 'user-db-4',
    vehicleType: VehicleType.BIKE,
    isAvailable: true,
    status: DeliveryBoyStatus.ON_LEAVE,
    totalDeliveries: 28,
    successfulDeliveries: 27,
    averageRating: 4.3,
    earnings: 7500,
    joiningDate: new Date('2025-01-05'),
    lastActiveAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    emergencyContact: '+917654321098',
    workingHoursStart: '10:00',
    workingHoursEnd: '18:00',
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date(),
    user: {
      id: 'user-db-4',
      email: 'vikram@example.com',
      fullName: 'Vikram Singh',
      gender: 'Male',
      phoneNumber: '+917654321099',
      villageName: 'Whitefield',
      streetName: 'ITPL Main Road',
      status: UserStatus.APPROVED,
    },
  },
  {
    id: 'db-5',
    userId: 'user-db-5',
    vehicleType: VehicleType.BICYCLE,
    isAvailable: false,
    status: DeliveryBoyStatus.INACTIVE,
    totalDeliveries: 15,
    successfulDeliveries: 14,
    averageRating: 4.0,
    earnings: 3200,
    joiningDate: new Date('2024-12-20'),
    lastActiveAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    emergencyContact: '+916543210987',
    workingHoursStart: '08:00',
    workingHoursEnd: '16:00',
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date(),
    user: {
      id: 'user-db-5',
      email: 'suresh@example.com',
      fullName: 'Suresh Reddy',
      gender: 'Male',
      phoneNumber: '+916543210988',
      villageName: 'Marathahalli',
      streetName: 'Outer Ring Road',
      status: UserStatus.APPROVED,
    },
  },
];

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: 'o1',
    customerId: 'c1',
    customerName: 'Alice Johnson',
    orderDate: new Date('2025-01-20'),
    deliveryDate: new Date('2025-01-22'),
    status: 'pending',
    items: [
      { id: 'oi1', serviceType: 'Wash & Fold', quantity: 5, price: 50, notes: 'Delicate items' },
      { id: 'oi2', serviceType: 'Dry Cleaning', quantity: 2, price: 40 },
    ],
    totalAmount: 90,
    paymentStatus: 'pending',
    assignedTo: 'db1',
  },
  {
    id: 'o2',
    customerId: 'c2',
    customerName: 'Bob Smith',
    orderDate: new Date('2025-01-19'),
    deliveryDate: new Date('2025-01-21'),
    status: 'processing',
    items: [
      { id: 'oi3', serviceType: 'Ironing', quantity: 10, price: 30 },
    ],
    totalAmount: 30,
    paymentStatus: 'paid',
    assignedTo: 'db2',
  },
  {
    id: 'o3',
    customerId: 'c3',
    customerName: 'Carol Williams',
    orderDate: new Date('2025-01-18'),
    deliveryDate: new Date('2025-01-20'),
    status: 'ready',
    items: [
      { id: 'oi4', serviceType: 'Wash & Fold', quantity: 8, price: 80 },
    ],
    totalAmount: 80,
    paymentStatus: 'paid',
    assignedTo: 'db1',
  },
];

// Mock Delivery Boys (Simple - for backward compatibility)
export const mockDeliveryBoys: DeliveryBoySimple[] = [
  {
    id: 'db1',
    name: 'Mike Delivery',
    phone: '+1234567895',
    email: 'mike@laundry.com',
    vehicleType: 'Bike',
    totalDeliveries: 250,
    rating: 4.8,
    status: 'active',
  },
  {
    id: 'db2',
    name: 'Tom Driver',
    phone: '+1234567896',
    email: 'tom@laundry.com',
    vehicleType: 'Van',
    totalDeliveries: 180,
    rating: 4.6,
    status: 'active',
  },
];

// Mock Inventory Items
export const mockInventoryItems: InventoryItem[] = [
  {
    id: 'inv1',
    name: 'Detergent Powder',
    category: 'Cleaning Supplies',
    quantity: 50,
    unit: 'kg',
    minQuantity: 10,
    price: 15,
    supplier: 'Clean Co.',
  },
  {
    id: 'inv2',
    name: 'Fabric Softener',
    category: 'Cleaning Supplies',
    quantity: 30,
    unit: 'liters',
    minQuantity: 5,
    price: 20,
    supplier: 'Soft Touch',
  },
];

// Mock Payments
export const mockPayments: Payment[] = [
  {
    id: 'p1',
    orderId: 'o2',
    amount: 30,
    method: 'card',
    status: 'paid',
    date: new Date('2025-01-19'),
    transactionId: 'TXN123456',
  },
  {
    id: 'p2',
    orderId: 'o3',
    amount: 80,
    method: 'upi',
    status: 'paid',
    date: new Date('2025-01-18'),
    transactionId: 'TXN123457',
  },
];

// Mock Pricing Items
export const mockPricingItems: PricingItem[] = [
  {
    id: 'pr1',
    serviceType: 'Wash & Fold',
    category: 'Basic',
    basePrice: 10,
  },
  {
    id: 'pr2',
    serviceType: 'Dry Cleaning',
    category: 'Premium',
    basePrice: 20,
  },
  {
    id: 'pr3',
    serviceType: 'Ironing',
    category: 'Basic',
    basePrice: 3,
  },
];

// Mock Subscription Plans
export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'sp1',
    name: 'Basic Monthly',
    duration: 30,
    price: 99,
    features: ['10 wash & fold services', '5% discount', 'Free pickup & delivery'],
    discountPercentage: 5,
  },
  {
    id: 'sp2',
    name: 'Premium Monthly',
    duration: 30,
    price: 199,
    features: ['Unlimited services', '15% discount', 'Priority delivery', '24/7 support'],
    discountPercentage: 15,
  },
];

// Mock Subscriptions
export const mockSubscriptions: Subscription[] = [
  {
    id: 'sub1',
    customerId: 'c1',
    planId: 'sp2',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-01-31'),
    status: 'active',
    autoRenew: true,
  },
];

// Mock Client Queries
export const mockClientQueries: ClientQuery[] = [
  {
    id: 'q1',
    customerId: 'c1',
    customerName: 'Alice Johnson',
    subject: 'Delayed Delivery',
    message: 'My order was supposed to be delivered yesterday but I have not received it yet.',
    status: 'in-progress',
    priority: 'high',
    createdAt: new Date('2025-01-19'),
  },
  {
    id: 'q2',
    customerId: 'c2',
    customerName: 'Bob Smith',
    subject: 'Pricing Question',
    message: 'What are the rates for bulk orders?',
    status: 'resolved',
    priority: 'low',
    createdAt: new Date('2025-01-15'),
    resolvedAt: new Date('2025-01-16'),
    response: 'Bulk orders get 20% discount for orders above 50 items.',
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: '1',
    title: 'New Order Received',
    message: 'Order #o1 has been placed by Alice Johnson',
    type: 'info',
    read: false,
    createdAt: new Date('2025-01-20'),
  },
  {
    id: 'n2',
    userId: '1',
    title: 'Low Stock Alert',
    message: 'Detergent Powder is running low',
    type: 'warning',
    read: false,
    createdAt: new Date('2025-01-19'),
  },
];

// Mock Shops (for Super Admin)
export const mockShops: Shop[] = [
  {
    id: 'shop-1',
    name: 'Downtown Laundry',
    address: '100 Market St, New York, NY 10002',
    phone: '+1234567897',
    email: 'downtown@laundry.com',
    status: 'active',
    subscriptionStatus: 'active',
    revenue: 15000,
    adminId: '1',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'shop-2',
    name: 'Uptown Cleaners',
    address: '200 Broadway, New York, NY 10003',
    phone: '+1234567898',
    email: 'uptown@laundry.com',
    status: 'active',
    subscriptionStatus: 'active',
    revenue: 12000,
    adminId: '3',
    createdAt: new Date('2024-02-01'),
  },
];

// Mock Dashboard Stats
export const mockAdminDashboardStats: DashboardStats = {
  totalOrders: 156,
  revenue: 8500,
  totalCustomers: 45,
  pendingOrders: 12,
  completedOrders: 140,
  activeSubscriptions: 8,
};

export const mockSuperAdminDashboardStats: DashboardStats = {
  totalOrders: 1250,
  revenue: 75000,
  totalCustomers: 320,
  pendingOrders: 45,
  completedOrders: 1180,
  activeSubscriptions: 65,
};