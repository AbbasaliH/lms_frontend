// Laundry Inventory Constants and Helper Functions

import {
  LaundryInventoryCategory,
  InventoryUnit,
  StockStatus,
  TransactionType,
  LocationType,
  AlertType,
} from '@/lib/types/laundry-inventory';

// Category Groups for Better Organization
export const CATEGORY_GROUPS = {
  'Cleaning Agents': [
    LaundryInventoryCategory.DETERGENT_LIQUID,
    LaundryInventoryCategory.DETERGENT_POWDER,
    LaundryInventoryCategory.DETERGENT_PODS,
    LaundryInventoryCategory.FABRIC_SOFTENER,
    LaundryInventoryCategory.STAIN_REMOVER,
    LaundryInventoryCategory.BLEACH_CHLORINE,
    LaundryInventoryCategory.BLEACH_OXYGEN,
    LaundryInventoryCategory.SPOT_CLEANER,
    LaundryInventoryCategory.SANITIZER,
    LaundryInventoryCategory.DISINFECTANT,
  ],
  'Finishing Supplies': [
    LaundryInventoryCategory.STARCH,
    LaundryInventoryCategory.SIZING,
    LaundryInventoryCategory.WRINKLE_RELEASE,
    LaundryInventoryCategory.FABRIC_PROTECTOR,
    LaundryInventoryCategory.IRONING_SPRAY,
  ],
  'Packaging Materials': [
    LaundryInventoryCategory.HANGERS_PLASTIC,
    LaundryInventoryCategory.HANGERS_WIRE,
    LaundryInventoryCategory.HANGERS_WOODEN,
    LaundryInventoryCategory.GARMENT_BAGS_PLASTIC,
    LaundryInventoryCategory.GARMENT_BAGS_CLOTH,
    LaundryInventoryCategory.POLY_BAGS,
    LaundryInventoryCategory.PAPER_BAGS,
    LaundryInventoryCategory.BOXES,
    LaundryInventoryCategory.TAGS,
    LaundryInventoryCategory.LABELS,
    LaundryInventoryCategory.STICKERS,
    LaundryInventoryCategory.RIBBONS,
    LaundryInventoryCategory.CLAIM_TICKETS,
  ],
  'Machine Maintenance': [
    LaundryInventoryCategory.DESCALER,
    LaundryInventoryCategory.MACHINE_CLEANER,
    LaundryInventoryCategory.FILTERS,
    LaundryInventoryCategory.BELTS,
    LaundryInventoryCategory.GASKETS,
    LaundryInventoryCategory.LUBRICANTS,
    LaundryInventoryCategory.SPARE_PARTS,
  ],
  'Dry Cleaning Solvents': [
    LaundryInventoryCategory.PERC,
    LaundryInventoryCategory.HYDROCARBON,
    LaundryInventoryCategory.GREEN_EARTH,
  ],
  'Utilities': [
    LaundryInventoryCategory.WATER,
    LaundryInventoryCategory.ELECTRICITY,
    LaundryInventoryCategory.GAS,
  ],
  'Office Supplies': [
    LaundryInventoryCategory.RECEIPT_PAPER,
    LaundryInventoryCategory.PRINTER_INK,
    LaundryInventoryCategory.PENS_MARKERS,
    LaundryInventoryCategory.INVOICES,
  ],
  'Miscellaneous': [
    LaundryInventoryCategory.LINT_ROLLERS,
    LaundryInventoryCategory.PRESSING_CLOTHS,
    LaundryInventoryCategory.SPOT_BRUSHES,
    LaundryInventoryCategory.SAFETY_EQUIPMENT,
    LaundryInventoryCategory.OTHER,
  ],
};

// Category Display Names
export const CATEGORY_LABELS: Record<LaundryInventoryCategory, string> = {
  [LaundryInventoryCategory.DETERGENT_LIQUID]: 'Liquid Detergent',
  [LaundryInventoryCategory.DETERGENT_POWDER]: 'Powder Detergent',
  [LaundryInventoryCategory.DETERGENT_PODS]: 'Detergent Pods',
  [LaundryInventoryCategory.FABRIC_SOFTENER]: 'Fabric Softener',
  [LaundryInventoryCategory.STAIN_REMOVER]: 'Stain Remover',
  [LaundryInventoryCategory.BLEACH_CHLORINE]: 'Chlorine Bleach',
  [LaundryInventoryCategory.BLEACH_OXYGEN]: 'Oxygen Bleach',
  [LaundryInventoryCategory.SPOT_CLEANER]: 'Spot Cleaner',
  [LaundryInventoryCategory.SANITIZER]: 'Sanitizer',
  [LaundryInventoryCategory.DISINFECTANT]: 'Disinfectant',
  [LaundryInventoryCategory.STARCH]: 'Starch',
  [LaundryInventoryCategory.SIZING]: 'Sizing',
  [LaundryInventoryCategory.WRINKLE_RELEASE]: 'Wrinkle Release',
  [LaundryInventoryCategory.FABRIC_PROTECTOR]: 'Fabric Protector',
  [LaundryInventoryCategory.IRONING_SPRAY]: 'Ironing Spray',
  [LaundryInventoryCategory.HANGERS_PLASTIC]: 'Plastic Hangers',
  [LaundryInventoryCategory.HANGERS_WIRE]: 'Wire Hangers',
  [LaundryInventoryCategory.HANGERS_WOODEN]: 'Wooden Hangers',
  [LaundryInventoryCategory.GARMENT_BAGS_PLASTIC]: 'Plastic Garment Bags',
  [LaundryInventoryCategory.GARMENT_BAGS_CLOTH]: 'Cloth Garment Bags',
  [LaundryInventoryCategory.POLY_BAGS]: 'Poly Bags',
  [LaundryInventoryCategory.PAPER_BAGS]: 'Paper Bags',
  [LaundryInventoryCategory.BOXES]: 'Boxes',
  [LaundryInventoryCategory.TAGS]: 'Tags',
  [LaundryInventoryCategory.LABELS]: 'Labels',
  [LaundryInventoryCategory.STICKERS]: 'Stickers',
  [LaundryInventoryCategory.RIBBONS]: 'Ribbons',
  [LaundryInventoryCategory.CLAIM_TICKETS]: 'Claim Tickets',
  [LaundryInventoryCategory.DESCALER]: 'Descaler',
  [LaundryInventoryCategory.MACHINE_CLEANER]: 'Machine Cleaner',
  [LaundryInventoryCategory.FILTERS]: 'Filters',
  [LaundryInventoryCategory.BELTS]: 'Belts',
  [LaundryInventoryCategory.GASKETS]: 'Gaskets/Seals',
  [LaundryInventoryCategory.LUBRICANTS]: 'Lubricants',
  [LaundryInventoryCategory.SPARE_PARTS]: 'Spare Parts',
  [LaundryInventoryCategory.PERC]: 'Perchloroethylene (PERC)',
  [LaundryInventoryCategory.HYDROCARBON]: 'Hydrocarbon Solvent',
  [LaundryInventoryCategory.GREEN_EARTH]: 'GreenEarth Solvent',
  [LaundryInventoryCategory.WATER]: 'Water',
  [LaundryInventoryCategory.ELECTRICITY]: 'Electricity',
  [LaundryInventoryCategory.GAS]: 'Gas',
  [LaundryInventoryCategory.RECEIPT_PAPER]: 'Receipt Paper',
  [LaundryInventoryCategory.PRINTER_INK]: 'Printer Ink/Toner',
  [LaundryInventoryCategory.PENS_MARKERS]: 'Pens & Markers',
  [LaundryInventoryCategory.INVOICES]: 'Invoice Forms',
  [LaundryInventoryCategory.LINT_ROLLERS]: 'Lint Rollers',
  [LaundryInventoryCategory.PRESSING_CLOTHS]: 'Pressing Cloths',
  [LaundryInventoryCategory.SPOT_BRUSHES]: 'Spot Brushes',
  [LaundryInventoryCategory.SAFETY_EQUIPMENT]: 'Safety Equipment',
  [LaundryInventoryCategory.OTHER]: 'Other',
};

// Unit Display Names
export const UNIT_LABELS: Record<InventoryUnit, string> = {
  [InventoryUnit.KG]: 'Kilograms (kg)',
  [InventoryUnit.G]: 'Grams (g)',
  [InventoryUnit.LB]: 'Pounds (lb)',
  [InventoryUnit.OZ]: 'Ounces (oz)',
  [InventoryUnit.LITER]: 'Liters (L)',
  [InventoryUnit.ML]: 'Milliliters (ml)',
  [InventoryUnit.GALLON]: 'Gallons (gal)',
  [InventoryUnit.PIECES]: 'Pieces (pcs)',
  [InventoryUnit.BOXES]: 'Boxes',
  [InventoryUnit.PACKETS]: 'Packets',
  [InventoryUnit.ROLLS]: 'Rolls',
  [InventoryUnit.SETS]: 'Sets',
  [InventoryUnit.PAIRS]: 'Pairs',
  [InventoryUnit.KWH]: 'Kilowatt-hours (kWh)',
  [InventoryUnit.CUBIC_METER]: 'Cubic Meters (m³)',
};

// Status Display Information
export const STATUS_INFO: Record<StockStatus, { label: string; color: string; variant: 'default' | 'destructive' | 'outline' | 'secondary' }> = {
  [StockStatus.IN_STOCK]: { label: 'In Stock', color: 'text-green-600', variant: 'default' },
  [StockStatus.LOW_STOCK]: { label: 'Low Stock', color: 'text-yellow-600', variant: 'outline' },
  [StockStatus.OUT_OF_STOCK]: { label: 'Out of Stock', color: 'text-red-600', variant: 'destructive' },
  [StockStatus.REORDER_REQUIRED]: { label: 'Reorder Required', color: 'text-orange-600', variant: 'secondary' },
  [StockStatus.OVERSTOCKED]: { label: 'Overstocked', color: 'text-blue-600', variant: 'outline' },
  [StockStatus.EXPIRED]: { label: 'Expired', color: 'text-red-800', variant: 'destructive' },
  [StockStatus.NEAR_EXPIRY]: { label: 'Near Expiry', color: 'text-orange-500', variant: 'secondary' },
  [StockStatus.DISCONTINUED]: { label: 'Discontinued', color: 'text-gray-600', variant: 'outline' },
};

// Transaction Type Labels
export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  [TransactionType.PURCHASE]: 'Purchase',
  [TransactionType.USAGE]: 'Usage',
  [TransactionType.WASTAGE]: 'Wastage',
  [TransactionType.RETURN]: 'Return',
  [TransactionType.TRANSFER_IN]: 'Transfer In',
  [TransactionType.TRANSFER_OUT]: 'Transfer Out',
  [TransactionType.ADJUSTMENT]: 'Adjustment',
  [TransactionType.DAMAGE]: 'Damage',
  [TransactionType.EXPIRED]: 'Expired',
};

// Location Type Labels
export const LOCATION_TYPE_LABELS: Record<LocationType, string> = {
  [LocationType.MAIN_STORE]: 'Main Store',
  [LocationType.BRANCH]: 'Branch',
  [LocationType.PRODUCTION_FLOOR]: 'Production Floor',
  [LocationType.DRY_CLEANING_AREA]: 'Dry Cleaning Area',
  [LocationType.PACKAGING_AREA]: 'Packaging Area',
  [LocationType.WAREHOUSE]: 'Warehouse',
  [LocationType.VEHICLE]: 'Vehicle',
  [LocationType.TEMPORARY]: 'Temporary',
};

// Alert Type Labels and Colors
export const ALERT_TYPE_INFO: Record<AlertType, { label: string; severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' }> = {
  [AlertType.LOW_STOCK]: { label: 'Low Stock Alert', severity: 'MEDIUM' },
  [AlertType.OUT_OF_STOCK]: { label: 'Out of Stock Alert', severity: 'CRITICAL' },
  [AlertType.EXPIRY_WARNING]: { label: 'Expiry Warning', severity: 'HIGH' },
  [AlertType.REORDER_POINT]: { label: 'Reorder Point Reached', severity: 'MEDIUM' },
  [AlertType.OVERSTOCK]: { label: 'Overstock Alert', severity: 'LOW' },
  [AlertType.PRICE_CHANGE]: { label: 'Price Change', severity: 'LOW' },
};

// Helper Functions
export const getCategoryGroup = (category: LaundryInventoryCategory): string => {
  for (const [group, categories] of Object.entries(CATEGORY_GROUPS)) {
    if (categories.includes(category)) {
      return group;
    }
  }
  return 'Miscellaneous';
};

export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatQuantity = (quantity: number, unit: InventoryUnit): string => {
  const unitLabel = UNIT_LABELS[unit];
  return `${quantity.toLocaleString('en-IN')} ${unitLabel}`;
};

export const calculateStockPercentage = (current: number, minimum: number, maximum?: number): number => {
  if (!maximum) {
    return current > minimum ? 100 : (current / minimum) * 100;
  }
  return ((current - minimum) / (maximum - minimum)) * 100;
};

export const getStockStatusFromQuantity = (
  quantity: number,
  minimumStock: number,
  reorderLevel: number,
  maximumStock?: number,
  expiryDate?: string,
): StockStatus => {
  // Check expiry first
  if (expiryDate) {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 0) {
      return StockStatus.EXPIRED;
    }
    if (daysUntilExpiry <= 30) {
      return StockStatus.NEAR_EXPIRY;
    }
  }
  
  // Check stock levels
  if (quantity === 0) {
    return StockStatus.OUT_OF_STOCK;
  }
  if (quantity <= minimumStock) {
    return StockStatus.LOW_STOCK;
  }
  if (quantity <= reorderLevel) {
    return StockStatus.REORDER_REQUIRED;
  }
  if (maximumStock && quantity > maximumStock) {
    return StockStatus.OVERSTOCKED;
  }
  
  return StockStatus.IN_STOCK;
};

export const calculateDaysUntilExpiry = (expiryDate: string): number => {
  const expiry = new Date(expiryDate);
  const now = new Date();
  return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

export const isExpiringSoon = (expiryDate: string, warningDays: number = 30): boolean => {
  const daysUntilExpiry = calculateDaysUntilExpiry(expiryDate);
  return daysUntilExpiry > 0 && daysUntilExpiry <= warningDays;
};

export const isExpired = (expiryDate: string): boolean => {
  return calculateDaysUntilExpiry(expiryDate) <= 0;
};

// Default values for new items
export const DEFAULT_REORDER_LEVEL_PERCENTAGE = 0.3; // 30% of maximum stock
export const DEFAULT_MINIMUM_STOCK_PERCENTAGE = 0.2; // 20% of maximum stock
export const DEFAULT_EXPIRY_WARNING_DAYS = 30;
export const DEFAULT_CURRENCY = 'INR';

export const calculateReorderQuantity = (
  currentQuantity: number,
  minimumStock: number,
  maximumStock?: number,
): number => {
  if (maximumStock) {
    return maximumStock - currentQuantity;
  }
  return minimumStock * 3 - currentQuantity; // Reorder to 3x minimum if no max set
};
