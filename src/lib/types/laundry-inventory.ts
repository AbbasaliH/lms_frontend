// Advanced Laundry Inventory Management Types

// ==================== ENUMS ====================
export enum LaundryInventoryCategory {
  // Cleaning Agents
  DETERGENT_LIQUID = 'DETERGENT_LIQUID',
  DETERGENT_POWDER = 'DETERGENT_POWDER',
  DETERGENT_PODS = 'DETERGENT_PODS',
  FABRIC_SOFTENER = 'FABRIC_SOFTENER',
  STAIN_REMOVER = 'STAIN_REMOVER',
  BLEACH_CHLORINE = 'BLEACH_CHLORINE',
  BLEACH_OXYGEN = 'BLEACH_OXYGEN',
  SPOT_CLEANER = 'SPOT_CLEANER',
  SANITIZER = 'SANITIZER',
  DISINFECTANT = 'DISINFECTANT',
  
  // Finishing Supplies
  STARCH = 'STARCH',
  SIZING = 'SIZING',
  WRINKLE_RELEASE = 'WRINKLE_RELEASE',
  FABRIC_PROTECTOR = 'FABRIC_PROTECTOR',
  IRONING_SPRAY = 'IRONING_SPRAY',
  
  // Packaging Materials
  HANGERS_PLASTIC = 'HANGERS_PLASTIC',
  HANGERS_WIRE = 'HANGERS_WIRE',
  HANGERS_WOODEN = 'HANGERS_WOODEN',
  GARMENT_BAGS_PLASTIC = 'GARMENT_BAGS_PLASTIC',
  GARMENT_BAGS_CLOTH = 'GARMENT_BAGS_CLOTH',
  POLY_BAGS = 'POLY_BAGS',
  PAPER_BAGS = 'PAPER_BAGS',
  BOXES = 'BOXES',
  TAGS = 'TAGS',
  LABELS = 'LABELS',
  STICKERS = 'STICKERS',
  RIBBONS = 'RIBBONS',
  CLAIM_TICKETS = 'CLAIM_TICKETS',
  
  // Machine Maintenance
  DESCALER = 'DESCALER',
  MACHINE_CLEANER = 'MACHINE_CLEANER',
  FILTERS = 'FILTERS',
  BELTS = 'BELTS',
  GASKETS = 'GASKETS',
  LUBRICANTS = 'LUBRICANTS',
  SPARE_PARTS = 'SPARE_PARTS',
  
  // Dry Cleaning Solvents
  PERC = 'PERC',
  HYDROCARBON = 'HYDROCARBON',
  GREEN_EARTH = 'GREEN_EARTH',
  
  // Utilities & Consumables
  WATER = 'WATER',
  ELECTRICITY = 'ELECTRICITY',
  GAS = 'GAS',
  
  // Office Supplies
  RECEIPT_PAPER = 'RECEIPT_PAPER',
  PRINTER_INK = 'PRINTER_INK',
  PENS_MARKERS = 'PENS_MARKERS',
  INVOICES = 'INVOICES',
  
  // Miscellaneous
  LINT_ROLLERS = 'LINT_ROLLERS',
  PRESSING_CLOTHS = 'PRESSING_CLOTHS',
  SPOT_BRUSHES = 'SPOT_BRUSHES',
  SAFETY_EQUIPMENT = 'SAFETY_EQUIPMENT',
  OTHER = 'OTHER',
}

export enum InventoryUnit {
  // Weight
  KG = 'KG',
  G = 'G',
  LB = 'LB',
  OZ = 'OZ',
  
  // Volume
  LITER = 'LITER',
  ML = 'ML',
  GALLON = 'GALLON',
  
  // Quantity
  PIECES = 'PIECES',
  BOXES = 'BOXES',
  PACKETS = 'PACKETS',
  ROLLS = 'ROLLS',
  SETS = 'SETS',
  PAIRS = 'PAIRS',
  
  // Utility
  KWH = 'KWH',
  CUBIC_METER = 'CUBIC_METER',
}

export enum StockStatus {
  IN_STOCK = 'IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  REORDER_REQUIRED = 'REORDER_REQUIRED',
  OVERSTOCKED = 'OVERSTOCKED',
  EXPIRED = 'EXPIRED',
  NEAR_EXPIRY = 'NEAR_EXPIRY',
  DISCONTINUED = 'DISCONTINUED',
}

export enum TransactionType {
  PURCHASE = 'PURCHASE',
  USAGE = 'USAGE',
  WASTAGE = 'WASTAGE',
  RETURN = 'RETURN',
  TRANSFER_IN = 'TRANSFER_IN',
  TRANSFER_OUT = 'TRANSFER_OUT',
  ADJUSTMENT = 'ADJUSTMENT',
  DAMAGE = 'DAMAGE',
  EXPIRED = 'EXPIRED',
}

export enum LocationType {
  MAIN_STORE = 'MAIN_STORE',
  BRANCH = 'BRANCH',
  PRODUCTION_FLOOR = 'PRODUCTION_FLOOR',
  DRY_CLEANING_AREA = 'DRY_CLEANING_AREA',
  PACKAGING_AREA = 'PACKAGING_AREA',
  WAREHOUSE = 'WAREHOUSE',
  VEHICLE = 'VEHICLE',
  TEMPORARY = 'TEMPORARY',
}

export enum AlertType {
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  EXPIRY_WARNING = 'EXPIRY_WARNING',
  REORDER_POINT = 'REORDER_POINT',
  OVERSTOCK = 'OVERSTOCK',
  PRICE_CHANGE = 'PRICE_CHANGE',
}

// ==================== INTERFACES ====================

export interface InventoryItem {
  id: string;
  sku: string;
  barcode?: string;
  itemName: string;
  description?: string;
  category: LaundryInventoryCategory;
  subCategory?: string;
  
  // Stock Information
  quantity: number;
  unit: InventoryUnit;
  minimumStock: number;
  maximumStock?: number;
  reorderLevel: number;
  reorderQuantity: number;
  status: StockStatus;
  
  // Pricing
  costPerUnit: number;
  sellingPrice?: number;
  currency: string;
  taxRate?: number;
  
  // Supplier Information
  supplierId?: string;
  supplierName: string;
  supplierContact?: string;
  supplierEmail?: string;
  leadTimeDays?: number;
  
  // Location
  locationId?: string;
  location: string;
  locationType: LocationType;
  shelf?: string;
  bin?: string;
  
  // Batch & Expiry
  batchNumber?: string;
  lotNumber?: string;
  manufacturingDate?: string;
  expiryDate?: string;
  expiryWarningDays?: number;
  
  // Usage Tracking
  averageUsagePerDay?: number;
  lastUsedDate?: string;
  totalUsageThisMonth?: number;
  totalUsageThisYear?: number;
  
  // Metadata
  notes?: string;
  imageUrl?: string;
  isHazardous?: boolean;
  storageInstructions?: string;
  usageInstructions?: string;
  
  // Audit
  lastRestockedAt?: string;
  lastRestockedBy?: string;
  lastRestockedQuantity?: number;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  batches?: InventoryBatch[];
  transactions?: InventoryTransaction[];
  alerts?: InventoryAlert[];
}

export interface InventoryBatch {
  id: string;
  inventoryItemId: string;
  batchNumber: string;
  lotNumber?: string;
  quantity: number;
  remainingQuantity: number;
  costPerUnit: number;
  manufacturingDate?: string;
  expiryDate?: string;
  receivedDate: string;
  supplierId?: string;
  purchaseOrderId?: string;
  status: 'ACTIVE' | 'DEPLETED' | 'EXPIRED' | 'RECALLED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryTransaction {
  id: string;
  inventoryItemId: string;
  batchId?: string;
  transactionType: TransactionType;
  quantity: number;
  unitCost?: number;
  totalCost?: number;
  balanceAfter: number;
  
  // Reference Information
  referenceType?: 'ORDER' | 'PURCHASE' | 'TRANSFER' | 'ADJUSTMENT';
  referenceId?: string;
  referenceNumber?: string;
  
  // Location
  fromLocationId?: string;
  toLocationId?: string;
  
  // Details
  reason?: string;
  notes?: string;
  performedBy: string;
  approvedBy?: string;
  transactionDate: string;
  createdAt: string;
}

export interface InventoryLocation {
  id: string;
  name: string;
  code: string;
  type: LocationType;
  address?: string;
  managerId?: string;
  managerName?: string;
  isActive: boolean;
  capacity?: number;
  currentUtilization?: number;
  items?: InventoryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface InventoryAlert {
  id: string;
  inventoryItemId: string;
  alertType: AlertType;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  threshold?: number;
  currentValue?: number;
  isRead: boolean;
  isResolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface StockTransfer {
  id: string;
  transferNumber: string;
  fromLocationId: string;
  toLocationId: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
  items: StockTransferItem[];
  requestedBy: string;
  approvedBy?: string;
  receivedBy?: string;
  transferDate: string;
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockTransferItem {
  id: string;
  transferId: string;
  inventoryItemId: string;
  batchId?: string;
  requestedQuantity: number;
  approvedQuantity?: number;
  receivedQuantity?: number;
  notes?: string;
}

export interface InventoryAnalytics {
  totalValue: number;
  totalItems: number;
  totalCategories: number;
  lowStockItems: number;
  outOfStockItems: number;
  expiredItems: number;
  nearExpiryItems: number;
  
  // Usage Analytics
  dailyConsumption: number;
  weeklyConsumption: number;
  monthlyConsumption: number;
  
  // Top Items
  topUsedItems: TopItemUsage[];
  topExpensiveItems: TopItemValue[];
  fastMovingItems: TopItemUsage[];
  slowMovingItems: TopItemUsage[];
  
  // Category Breakdown
  categoryDistribution: CategoryDistribution[];
  valueByCategory: CategoryValue[];
  
  // Alerts Summary
  activeAlerts: number;
  criticalAlerts: number;
  pendingReorders: number;
  
  // Cost Analytics
  totalPurchaseValue: number;
  totalWastageValue: number;
  wastePercentage: number;
  averageStockTurnover: number;
}

export interface TopItemUsage {
  itemId: string;
  itemName: string;
  category: LaundryInventoryCategory;
  quantity: number;
  unit: InventoryUnit;
  value: number;
  usageCount: number;
}

export interface TopItemValue {
  itemId: string;
  itemName: string;
  category: LaundryInventoryCategory;
  quantity: number;
  unit: InventoryUnit;
  totalValue: number;
  percentage: number;
}

export interface CategoryDistribution {
  category: LaundryInventoryCategory;
  itemCount: number;
  totalQuantity: number;
  percentage: number;
}

export interface CategoryValue {
  category: LaundryInventoryCategory;
  totalValue: number;
  percentage: number;
}

export interface UsageTrend {
  date: string;
  totalUsage: number;
  totalValue: number;
  topCategories: {
    category: LaundryInventoryCategory;
    usage: number;
  }[];
}

export interface StockReport {
  date: string;
  openingStock: number;
  purchases: number;
  usage: number;
  wastage: number;
  returns: number;
  transfers: number;
  closingStock: number;
  stockValue: number;
}

// ==================== REQUEST/RESPONSE TYPES ====================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface CreateInventoryItemRequest {
  sku?: string;
  barcode?: string;
  itemName: string;
  description?: string;
  category: LaundryInventoryCategory;
  subCategory?: string;
  quantity: number;
  unit: InventoryUnit;
  minimumStock: number;
  maximumStock?: number;
  reorderLevel: number;
  reorderQuantity: number;
  costPerUnit: number;
  sellingPrice?: number;
  currency?: string;
  taxRate?: number;
  supplierId?: string;
  supplierName: string;
  supplierContact?: string;
  supplierEmail?: string;
  leadTimeDays?: number;
  locationId?: string;
  location: string;
  locationType: LocationType;
  shelf?: string;
  bin?: string;
  batchNumber?: string;
  lotNumber?: string;
  manufacturingDate?: string;
  expiryDate?: string;
  expiryWarningDays?: number;
  notes?: string;
  imageUrl?: string;
  isHazardous?: boolean;
  storageInstructions?: string;
  usageInstructions?: string;
}

export interface UpdateInventoryItemRequest extends Partial<CreateInventoryItemRequest> {}

export interface RecordUsageRequest {
  inventoryItemId: string;
  quantity: number;
  batchId?: string;
  referenceType?: 'ORDER' | 'PRODUCTION';
  referenceId?: string;
  referenceNumber?: string;
  notes?: string;
}

export interface RecordWastageRequest {
  inventoryItemId: string;
  quantity: number;
  batchId?: string;
  reason: string;
  notes?: string;
}

export interface AdjustStockRequest {
  inventoryItemId: string;
  adjustmentQuantity: number; // positive or negative
  reason: string;
  notes?: string;
}

export interface CreateStockTransferRequest {
  fromLocationId: string;
  toLocationId: string;
  items: {
    inventoryItemId: string;
    batchId?: string;
    quantity: number;
    notes?: string;
  }[];
  expectedDeliveryDate?: string;
  notes?: string;
}

export interface ReceiveStockTransferRequest {
  items: {
    transferItemId: string;
    receivedQuantity: number;
    notes?: string;
  }[];
}

export interface CreateBatchRequest {
  inventoryItemId: string;
  batchNumber: string;
  lotNumber?: string;
  quantity: number;
  costPerUnit: number;
  manufacturingDate?: string;
  expiryDate?: string;
  supplierId?: string;
  purchaseOrderId?: string;
  notes?: string;
}

export interface InventoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: LaundryInventoryCategory;
  status?: StockStatus;
  locationId?: string;
  locationType?: LocationType;
  supplierId?: string;
  minQuantity?: number;
  maxQuantity?: number;
  minCost?: number;
  maxCost?: number;
  hasExpiry?: boolean;
  expiryBefore?: string;
  expiryAfter?: string;
  isHazardous?: boolean;
  sortBy?: 'itemName' | 'quantity' | 'costPerUnit' | 'expiryDate' | 'lastUsedDate' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  inventoryItemId?: string;
  transactionType?: TransactionType;
  fromDate?: string;
  toDate?: string;
  locationId?: string;
  performedBy?: string;
  sortBy?: 'transactionDate' | 'quantity' | 'totalCost';
  sortOrder?: 'asc' | 'desc';
}

export interface AlertFilters {
  page?: number;
  limit?: number;
  alertType?: AlertType;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  isRead?: boolean;
  isResolved?: boolean;
  inventoryItemId?: string;
}

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  locationId?: string;
  category?: LaundryInventoryCategory;
}
