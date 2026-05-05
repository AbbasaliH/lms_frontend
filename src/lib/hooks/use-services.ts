import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { servicesApi } from '../api/services';
import type { 
  ServiceFilters, 
  CreateLaundryServiceRequest, 
  UpdateLaundryServiceRequest 
} from '../types/service';

const serviceKeys = {
  all: ['services'] as const,
  lists: (filters?: ServiceFilters) => [...serviceKeys.all, 'list', filters] as const,
  details: () => [...serviceKeys.all, 'detail'] as const,
  detail: (id: string) => [...serviceKeys.details(), id] as const,
};

export const useServices = (filters?: ServiceFilters) => {
  return useQuery({
    queryKey: serviceKeys.lists(filters),
    queryFn: () => servicesApi.getServices(filters),
    staleTime: 30 * 1000,
  });
};

export const useService = (id: string) => {
  return useQuery({
    queryKey: serviceKeys.detail(id),
    queryFn: () => servicesApi.getService(id),
    enabled: !!id,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLaundryServiceRequest) => servicesApi.createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      toast.success('Service created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create service');
    }
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLaundryServiceRequest }) => 
      servicesApi.updateService(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      queryClient.invalidateQueries({ queryKey: serviceKeys.detail(variables.id) });
      toast.success('Service updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update service');
    }
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => servicesApi.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      toast.success('Service deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete service');
    }
  });
};
