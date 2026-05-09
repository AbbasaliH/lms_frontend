import { apiClient } from './client';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  isActive: boolean;
  addOns: string[];
  clothTypes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  isActive?: boolean;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  category: string;
  addOns?: string[];
  clothTypes?: string[];
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  isActive?: boolean;
  addOns?: string[];
  clothTypes?: string[];
}

export const productsApi = {
  getProducts: async (filters: ProductFilters = {}): Promise<ProductsResponse> => {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.category) params.append('category', filters.category);
    if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    const query = params.toString();
    return apiClient.get(`/admin/products${query ? `?${query}` : ''}`);
  },

  getProduct: async (id: string): Promise<ProductResponse> => {
    return apiClient.get(`/admin/products/${id}`);
  },

  createProduct: async (data: CreateProductRequest): Promise<ProductResponse> => {
    return apiClient.post('/admin/products', data);
  },

  updateProduct: async (id: string, data: UpdateProductRequest): Promise<ProductResponse> => {
    return apiClient.put(`/admin/products/${id}`, data);
  },
};
