// Analytics API Types

export interface AnalyticsOverview {
  revenue: {
    total: number;
    average: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
    completionRate: number;
  };
  users: {
    total: number;
    deliveryBoys: number;
  };
  subscriptions: {
    active: number;
  };
  wallet: {
    totalBalance: number;
  };
  queries: {
    pending: number;
  };
}

export interface AnalyticsResponse {
  success: boolean;
  message: string;
  data: AnalyticsOverview;
}