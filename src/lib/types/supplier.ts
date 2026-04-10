// Supplier Management Types

// ==================== ENUMS ====================
export enum SupplierType {
  MATERIAL = 'MATERIAL',
  EQUIPMENT = 'EQUIPMENT',
  CHEMICAL = 'CHEMICAL',
  PACKAGING = 'PACKAGING',
  SERVICE = 'SERVICE',
  MIXED = 'MIXED'
}

export enum SupplierStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  BLACKLISTED = 'BLACKLISTED'
}

export enum VerificationStatus {
  UNVERIFIED = 'UNVERIFIED',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED'
}

export enum SupplierTier {
  PREMIUM = 'PREMIUM',
  STANDARD = 'STANDARD',
  BASIC = 'BASIC'
}

export enum PurchaseOrderStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ORDERED = 'ORDERED',
  PARTIALLY_RECEIVED = 'PARTIALLY_RECEIVED',
  RECEIVED = 'RECEIVED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum PaymentMethod {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CHEQUE = 'CHEQUE',
  UPI = 'UPI',
  CARD = 'CARD',
  NET_BANKING = 'NET_BANKING'
}

export enum ContractStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  TERMINATED = 'TERMINATED',
  RENEWED = 'RENEWED'
}

export enum DocumentType {
  GST_CERTIFICATE = 'GST_CERTIFICATE',
  PAN_CARD = 'PAN_CARD',
  TRADE_LICENSE = 'TRADE_LICENSE',
  INCORPORATION_CERTIFICATE = 'INCORPORATION_CERTIFICATE',
  BANK_STATEMENT = 'BANK_STATEMENT',
  CONTRACT = 'CONTRACT',
  QUALITY_CERTIFICATE = 'QUALITY_CERTIFICATE',
  ISO_CERTIFICATE = 'ISO_CERTIFICATE',
  OTHER = 'OTHER'
}

// ==================== INTERFACES ====================
export interface Supplier {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  alternatePhone?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  gstin?: string;
  panNumber?: string;
  supplierType: SupplierType;
  status: SupplierStatus;
  verificationStatus: VerificationStatus;
  tier: SupplierTier;
  rating?: number;
  totalOrders: number;
  completedOrders: number;
  onTimeDeliveryRate?: number;
  qualityRating?: number;
  creditLimit: number;
  currentOutstanding: number;
  paymentTermsDays: number;
  bankName?: string;
  bankAccountNumber?: string;
  bankIFSC?: string;
  bankBranch?: string;
  accountHolderName?: string;
  website?: string;
  categoriesSupplied: string[];
  notes?: string;
  isBlacklisted: boolean;
  blacklistReason?: string;
  blacklistedAt?: string;
  blacklistedBy?: string;
  approvedBy?: string;
  approvedAt?: string;
  lastOrderDate?: string;
  lastPaymentDate?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  _count?: {
    purchaseOrders: number;
    contracts: number;
    ratings: number;
    payments?: number;
  };
  contracts?: SupplierContract[];
  purchaseOrders?: PurchaseOrder[];
  payments?: SupplierPayment[];
  ratings?: SupplierRating[];
  inventoryLinks?: SupplierInventoryLink[];
  documents?: SupplierDocument[];
}

export interface PurchaseOrderItem {
  inventoryId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  orderNumber: string;
  orderDate: string;
  expectedDelivery: string;
  actualDelivery?: string;
  status: PurchaseOrderStatus;
  totalAmount: number;
  taxAmount: number;
  discount: number;
  grandTotal: number;
  paymentStatus: PaymentStatus;
  paymentTerms?: string;
  deliveryAddress: string;
  notes?: string;
  items: PurchaseOrderItem[];
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedReason?: string;
  receivedBy?: string;
  receivedAt?: string;
  qualityCheckDone: boolean;
  qualityCheckBy?: string;
  qualityCheckAt?: string;
  qualityIssues?: string;
  createdAt: string;
  updatedAt: string;
  supplier?: {
    id: string;
    companyName: string;
    contactPerson: string;
    phoneNumber: string;
    email: string;
  };
  payments?: SupplierPayment[];
}

export interface SupplierPayment {
  id: string;
  supplierId: string;
  purchaseOrderId?: string;
  paymentDate: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  referenceNumber?: string;
  notes?: string;
  status: PaymentStatus;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  supplier?: {
    id: string;
    companyName: string;
    contactPerson: string;
  };
  purchaseOrder?: {
    orderNumber: string;
    grandTotal: number;
  };
}

export interface SupplierRating {
  id: string;
  supplierId: string;
  purchaseOrderId?: string;
  rating: number;
  qualityRating?: number;
  deliveryRating?: number;
  serviceRating?: number;
  comment?: string;
  ratedBy: string;
  createdAt: string;
}

export interface SupplierContract {
  id: string;
  supplierId: string;
  contractNumber: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  autoRenewal: boolean;
  renewalNoticeDays?: number;
  value: number;
  status: ContractStatus;
  terms?: string;
  documentUrl?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  supplier?: {
    companyName: string;
    contactPerson: string;
    email: string;
    phoneNumber: string;
  };
}

export interface SupplierDocument {
  id: string;
  supplierId: string;
  documentType: DocumentType;
  documentName: string;
  documentUrl: string;
  expiryDate?: string;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierInventoryLink {
  id: string;
  supplierId: string;
  inventoryId: string;
  isPrimary: boolean;
  unitPrice: number;
  leadTimeDays: number;
  minimumOrderQty: number;
  lastSuppliedDate?: string;
  lastSuppliedPrice?: number;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  supplier?: Supplier;
  inventory?: {
    id: string;
    itemName: string;
    category: string;
    unit: string;
  };
}

// ==================== REQUEST/RESPONSE TYPES ====================
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items?: T[];
    suppliers?: T[];
    orders?: T[];
    payments?: T[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface DashboardStats {
  totalSuppliers: number;
  activeSuppliers: number;
  pendingApprovals: number;
  totalPurchaseOrders: number;
  pendingOrders: number;
  totalOutstanding: number;
  avgRating: number;
  expiringContractsCount: number;
}

export interface SupplierPerformance {
  supplier: {
    id: string;
    companyName: string;
    rating?: number;
    tier: SupplierTier;
  };
  performance: {
    totalOrders: number;
    completedOrders: number;
    onTimeDeliveryRate?: number;
    qualityRating?: number;
    totalSpent: number;
    avgDeliveryTime: number;
    qualityIssues: number;
    currentOutstanding: number;
  };
}

// ==================== FORM TYPES ====================
export interface CreateSupplierRequest {
  companyName: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  alternatePhone?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  gstin?: string;
  panNumber?: string;
  supplierType: SupplierType;
  categoriesSupplied?: string[];
  paymentTermsDays?: number;
  creditLimit?: number;
  bankName?: string;
  bankAccountNumber?: string;
  bankIFSC?: string;
  bankBranch?: string;
  accountHolderName?: string;
  website?: string;
  notes?: string;
}

export interface CreatePurchaseOrderRequest {
  supplierId: string;
  expectedDelivery: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  taxAmount?: number;
  discount?: number;
  deliveryAddress: string;
  paymentTerms?: string;
  notes?: string;
}

export interface CreatePaymentRequest {
  supplierId: string;
  purchaseOrderId?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  referenceNumber?: string;
  notes?: string;
}

export interface CreateRatingRequest {
  supplierId: string;
  purchaseOrderId?: string;
  rating: number;
  qualityRating?: number;
  deliveryRating?: number;
  serviceRating?: number;
  comment?: string;
}

export interface CreateContractRequest {
  supplierId: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  autoRenewal?: boolean;
  renewalNoticeDays?: number;
  value: number;
  terms?: string;
  documentUrl?: string;
}

export interface CreateDocumentRequest {
  supplierId: string;
  documentType: DocumentType;
  documentName: string;
  documentUrl: string;
  expiryDate?: string;
  notes?: string;
}

export interface CreateInventoryLinkRequest {
  supplierId: string;
  inventoryId: string;
  isPrimary?: boolean;
  unitPrice: number;
  leadTimeDays?: number;
  minimumOrderQty?: number;
  notes?: string;
}

// ==================== FILTER TYPES ====================
export interface SupplierFilters {
  status?: SupplierStatus;
  supplierType?: SupplierType;
  verificationStatus?: VerificationStatus;
  tier?: SupplierTier;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PurchaseOrderFilters {
  supplierId?: string;
  status?: PurchaseOrderStatus;
  paymentStatus?: PaymentStatus;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export interface PaymentFilters {
  supplierId?: string;
  status?: PaymentStatus;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}