// Customer Types - Full Spec

export enum CustomerTier {
  REGULAR = 'REGULAR',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  VIP = 'VIP'
}

export enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  BLACKLISTED = 'BLACKLISTED',
  DORMANT = 'DORMANT'
}

export enum InteractionType {
  INQUIRY = 'INQUIRY',
  COMPLAINT = 'COMPLAINT',
  FEEDBACK = 'FEEDBACK',
  SUPPORT = 'SUPPORT',
  FOLLOW_UP = 'FOLLOW_UP',
  SALES = 'SALES',
  OTHER = 'OTHER'
}

export enum InteractionStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  ESCALATED = 'ESCALATED'
}

export enum InteractionPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface Customer {
  id: string;
  userId: string;
  customerCode: string;
  tier: CustomerTier;
  status: CustomerStatus;
  tags: string[];
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate?: Date;
  firstOrderDate?: Date;
  averageRating?: number;
  totalReviews: number;
  preferredPickupTime?: string;
  preferredDeliveryTime?: string;
  specialInstructions?: string;
  preferredPaymentMethod?: string;
  loyaltyPoints: number;
  lifetimePoints: number;
  acquisitionSource?: string;
  referredBy?: string;
  isVerified: boolean;
  verifiedAt?: Date;
  verifiedBy?: string;
  creditLimit: number;
  currentCredit: number;
  creditAllowed: boolean;
  isBusinessCustomer: boolean;
  companyName?: string;
  gstin?: string;
  businessType?: string;
  notes?: string;
  isBlacklisted: boolean;
  blacklistReason?: string;
  blacklistedAt?: Date;
  blacklistedBy?: string;
  joiningDate: Date;
  lastActiveAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
}

export interface CustomerInteraction {
  id: string;
  customerId: string;
  interactionType: InteractionType;
  channel?: string;
  subject?: string;
  description?: string;
  status: InteractionStatus;
  priority: InteractionPriority;
  assignedTo?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface ApiCustomer {
  id: string;
  customerCode: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  tier: CustomerTier;
  status: CustomerStatus;
  totalSpent: number;
  totalOrders: number;
  averageRating?: number;
  loyaltyPoints: number;
}

export interface CustomerFilters {
  tier?: CustomerTier;
  status?: CustomerStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export type CreateCustomerRequest = Partial<Customer> & { userId: string };
export type UpdateCustomerRequest = Partial<Customer>;

