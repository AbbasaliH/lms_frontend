export enum ServiceCategory {
  WASHING = 'WASHING',
  DRY_CLEANING = 'DRY_CLEANING',
  DRYING = 'DRYING',
  IRONING_AND_PRESS = 'IRONING_AND_PRESS',
  FOLDING = 'FOLDING',
  STAIN_REMOVAL = 'STAIN_REMOVAL',
  PREMIUM_CARE = 'PREMIUM_CARE',
  OTHER = 'OTHER'
}

export interface LaundryService {
  id: string;
  name: string;
  description?: string;
  category: ServiceCategory;
  basePrice: number;
  pricePerUnit?: number;
  unitType?: string;
  isActive: boolean;
  durationHours?: number;
  iconUrl?: string;
  taxRate: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CreateLaundryServiceRequest {
  name: string;
  description?: string;
  category: ServiceCategory;
  basePrice: number;
  pricePerUnit?: number;
  unitType?: string;
  isActive?: boolean;
  durationHours?: number;
  iconUrl?: string;
  taxRate?: number;
}

export interface UpdateLaundryServiceRequest extends Partial<CreateLaundryServiceRequest> {
  isActive?: boolean;
}

export interface ServiceFilters {
  category?: ServiceCategory;
  isActive?: boolean;
}

export interface ServicesResponse {
  success: boolean;
  data: LaundryService[];
  count: number;
}

export interface ServiceResponse {
  success: boolean;
  data: LaundryService;
}
