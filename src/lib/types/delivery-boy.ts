// Delivery Boy Types and Enums

export enum VehicleType {
  BICYCLE = 'BICYCLE',
  BIKE = 'BIKE',
  SCOOTER = 'SCOOTER',
  CAR = 'CAR',
  VAN = 'VAN',
}

export enum DeliveryBoyStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  SUSPENDED = 'SUSPENDED',
}

export enum UserStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

// API Response Structure
export interface ApiDeliveryBoyData {
  vehicleType: VehicleType;
  vehicleNumber?: string;
  licenseNumber?: string;
  isAvailable: boolean;
  status: DeliveryBoyStatus;
  totalDeliveries: number;
  successfulDeliveries: number;
  averageRating?: number;
  earnings: number;
}

export interface ApiDeliveryBoyItem {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  status: UserStatus;
  createdAt: string;
  deliveryBoy: ApiDeliveryBoyData;
  _count: {
    deliveryOrders: number;
  };
}

// Core Delivery Boy Interface (for internal use)
export interface DeliveryBoy {
  id: string;
  userId: string;
  vehicleType: VehicleType;
  vehicleNumber?: string;
  licenseNumber?: string;
  isAvailable: boolean;
  currentLat?: number;
  currentLng?: number;
  status: DeliveryBoyStatus;
  totalDeliveries: number;
  successfulDeliveries: number;
  averageRating?: number;
  earnings: number;
  joiningDate: Date;
  lastActiveAt?: Date;
  aadharNumber?: string;
  emergencyContact?: string;
  workingHoursStart?: string;
  workingHoursEnd?: string;
  createdAt: Date;
  updatedAt: Date;
  user: DeliveryBoyUser;
}

export interface DeliveryBoyUser {
  id: string;
  email: string;
  fullName: string;
  gender: string;
  phoneNumber: string;
  profileImage?: string;
  villageName?: string;
  streetName?: string;
  status: UserStatus;
}

// API Request/Response Types
export interface CreateDeliveryBoyRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  gender: string;
  villageName?: string;
  streetName?: string;
  vehicleType: VehicleType;
  vehicleNumber?: string;
  licenseNumber?: string;
  aadharNumber?: string;
  emergencyContact?: string;
  workingHoursStart?: string;
  workingHoursEnd?: string;
}

export interface UpdateDeliveryBoyRequest {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  gender?: string;
  villageName?: string;
  streetName?: string;
  vehicleType?: VehicleType;
  vehicleNumber?: string;
  licenseNumber?: string;
  aadharNumber?: string;
  emergencyContact?: string;
  workingHoursStart?: string;
  workingHoursEnd?: string;
}

export interface DeliveryBoyFilters {
  status?: DeliveryBoyStatus;
  vehicleType?: VehicleType;
  search?: string;
  isAvailable?: boolean;
}

export interface DeliveryBoyPagination {
  page: number;
  limit: number;
  total?: number;
  totalPages?: number;
}

export interface DeliveryBoysResponse {
  success: boolean;
  data: ApiDeliveryBoyItem[];
}

export interface DeliveryBoyResponse {
  success: boolean;
  message: string;
  data: DeliveryBoy;
}

export interface AssignOrderRequest {
  orderId: string;
  deliveryBoyId: string;
}

export interface UpdateStatusRequest {
  status: DeliveryBoyStatus;
}

export interface DeliveryBoyStats {
  todayDeliveries: number;
  pendingOrders: number;
  monthlyEarnings: number;
  rating: number;
}

// List item for display
export interface DeliveryBoyListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleType: VehicleType;
  vehicleNumber?: string;
  totalDeliveries: number;
  successfulDeliveries: number;
  rating: number;
  earnings: number;
  status: DeliveryBoyStatus;
  isAvailable: boolean;
  profileImage?: string;
  lastActiveAt?: Date;
}