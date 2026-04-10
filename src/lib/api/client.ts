// API Client with automatic token refresh

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://your-api-domain.com/api/v1';

export class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async getAuthToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) return null;

    try {
      const { state } = JSON.parse(authStorage);
      return state?.token || null;
    } catch {
      return null;
    }
  }

  private async getRefreshToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) return null;

    try {
      const { state } = JSON.parse(authStorage);
      return state?.refreshToken || null;
    } catch {
      return null;
    }
  }

  private async refreshAccessToken(): Promise<string | null> {
    const refreshToken = await this.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      
      // Update tokens in storage
      if (typeof window !== 'undefined') {
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          const parsed = JSON.parse(authStorage);
          parsed.state.token = data.data.token;
          parsed.state.refreshToken = data.data.refreshToken;
          localStorage.setItem('auth-storage', JSON.stringify(parsed));
        }
      }

      return data.data.token;
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    // If unauthorized and we have a refresh token, try to refresh
    if (response.status === 401 && token) {
      const newToken = await this.refreshAccessToken();
      
      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`;
        response = await fetch(`${this.baseURL}${endpoint}`, {
          ...options,
          headers,
        });
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'An error occurred',
      }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  async patch<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  async getBlob(endpoint: string, options?: RequestInit): Promise<Blob> {
    const token = await this.getAuthToken();
    
    const headers: Record<string, string> = {
      ...(options?.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Download failed');
    }

    return response.blob();
  }
}

export const apiClient = new ApiClient();