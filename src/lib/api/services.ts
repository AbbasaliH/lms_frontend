import { apiClient } from './client';
import type { 
  LaundryService, 
  ServiceFilters, 
  CreateLaundryServiceRequest, 
  UpdateLaundryServiceRequest,
  ServicesResponse,
  ServiceResponse
} from '../types/service';

export const servicesApi = {
  getServices: async (filters?: ServiceFilters) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    
    const query = params.toString();
    const endpoint = `/services${query ? `?${query}` : ''}`;
    return apiClient.get<ServicesResponse>(endpoint);
  },

  getService: async (id: string) => {
    return apiClient.get<ServiceResponse>(`/services/${id}`);
  },

  createService: async (data: CreateLaundryServiceRequest) => {
    return apiClient.post<ServiceResponse>('/services', data);
  },

  updateService: async (id: string, data: UpdateLaundryServiceRequest) => {
    return apiClient.put<ServiceResponse>(`/services/${id}`, data);
  },

  deleteService: async (id: string) => {
    return apiClient.delete<{ success: boolean; message: string }>(`/services/${id}`);
  }
};
