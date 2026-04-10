// Finance API
// This is a mock implementation - replace with actual API calls when backend is ready

import type {
  DateRange,
  TimePeriod,
  CashFlowPeriod,
  FinancialMetricsResponse,
  ProfitLossResponse,
  TimeSeriesResponse,
  ExpenseBreakdownResponse,
  CashFlowResponse,
  BudgetComparisonResponse,
  FinancialRatiosResponse,
} from '@/lib/types/finance';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data generators
const generateFinancialMetrics = (): FinancialMetricsResponse => ({
  success: true,
  data: {
    totalRevenue: 487500,
    totalExpenses: 312400,
    netProfit: 175100,
    profitMargin: 35.92,
    cashFlow: 142800,
    outstandingReceivables: 45600,
    revenueChange: 12.5,
    expenseChange: 8.3,
    profitChange: 18.7,
    cashFlowChange: 5.2,
    receivablesChange: -3.1,
  },
});

const generateProfitLoss = (): ProfitLossResponse => {
  const revenue = {
    laundryServices: 245000,
    dryCleaningServices: 165000,
    ironingServices: 52500,
    additionalServices: 25000,
    total: 487500,
  };

  const expenses = {
    materials: 45000,
    detergents: 28000,
    labor: 125000,
    utilities: 35000,
    waterBill: 15000,
    electricity: 20000,
    marketing: 18000,
    rent: 32000,
    maintenance: 12000,
    equipment: 8000,
    transportation: 6400,
    other: 3000,
    total: 312400,
  };

  const grossProfit = revenue.total - expenses.total;
  const operatingIncome = grossProfit;
  const netProfit = operatingIncome;
  const profitMargin = (netProfit / revenue.total) * 100;

  return {
    success: true,
    data: {
      revenue,
      expenses,
      grossProfit,
      operatingIncome,
      netProfit,
      profitMargin,
    },
  };
};

const generateTrends = (period: TimePeriod): TimeSeriesResponse => {
  const dataPoints: Record<TimePeriod, number> = {
    weekly: 12,
    monthly: 12,
    quarterly: 8,
    yearly: 5,
  };

  const count = dataPoints[period];
  const data = Array.from({ length: count }, (_, i) => {
    const revenue = 35000 + Math.random() * 15000 + i * 2000;
    const expenses = 20000 + Math.random() * 8000 + i * 1000;
    const profit = revenue - expenses;
    const profitMargin = (profit / revenue) * 100;

    let date: string;
    if (period === 'weekly') {
      date = `Week ${i + 1}`;
    } else if (period === 'monthly') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      date = months[i];
    } else if (period === 'quarterly') {
      date = `Q${(i % 4) + 1} ${2024 + Math.floor(i / 4)}`;
    } else {
      date = `${2020 + i}`;
    }

    return {
      date,
      revenue: Math.round(revenue),
      expenses: Math.round(expenses),
      profit: Math.round(profit),
      profitMargin: Math.round(profitMargin * 10) / 10,
    };
  });

  return {
    success: true,
    data,
  };
};

const generateExpenseBreakdown = (): ExpenseBreakdownResponse => {
  const categories = [
    { category: 'Labor & Wages', amount: 125000, color: 'hsl(var(--chart-1))' },
    { category: 'Materials & Detergents', amount: 73000, color: 'hsl(var(--chart-2))' },
    { category: 'Utilities', amount: 35000, color: 'hsl(var(--chart-3))' },
    { category: 'Rent & Facilities', amount: 32000, color: 'hsl(var(--chart-4))' },
    { category: 'Marketing', amount: 18000, color: 'hsl(var(--chart-5))' },
    { category: 'Maintenance & Equipment', amount: 20000, color: '#f59e0b' },
    { category: 'Transportation', amount: 6400, color: '#ec4899' },
    { category: 'Other', amount: 3000, color: '#6b7280' },
  ];

  const total = categories.reduce((sum, cat) => sum + cat.amount, 0);

  const data = categories.map(cat => ({
    ...cat,
    percentage: Math.round((cat.amount / total) * 1000) / 10,
  }));

  return {
    success: true,
    data,
  };
};

const generateCashFlow = (period: CashFlowPeriod): CashFlowResponse => {
  const count = period === 'monthly' ? 12 : 8;

  const data = Array.from({ length: count }, (_, i) => {
    const inflow = 35000 + Math.random() * 15000;
    const outflow = 22000 + Math.random() * 10000;
    const netCashFlow = inflow - outflow;

    let periodLabel: string;
    if (period === 'monthly') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      periodLabel = months[i];
    } else {
      periodLabel = `Q${(i % 4) + 1} ${2024 + Math.floor(i / 4)}`;
    }

    return {
      period: periodLabel,
      inflow: Math.round(inflow),
      outflow: Math.round(outflow),
      netCashFlow: Math.round(netCashFlow),
    };
  });

  return {
    success: true,
    data,
  };
};

const generateBudgetComparison = (): BudgetComparisonResponse => {
  const departments = [
    { department: 'Operations', budgeted: 180000, actual: 165000 },
    { department: 'Marketing', budgeted: 25000, actual: 28000 },
    { department: 'Facilities', budgeted: 45000, actual: 42000 },
    { department: 'HR & Admin', budgeted: 35000, actual: 33500 },
    { department: 'Technology', budgeted: 15000, actual: 18500 },
    { department: 'Customer Service', budgeted: 20000, actual: 19200 },
  ];

  const data = departments.map(dept => {
    const variance = dept.actual - dept.budgeted;
    const variancePercent = (variance / dept.budgeted) * 100;
    let status: 'under' | 'on-track' | 'over';

    if (variancePercent < -5) {
      status = 'under';
    } else if (variancePercent > 5) {
      status = 'over';
    } else {
      status = 'on-track';
    }

    return {
      ...dept,
      variance,
      variancePercent: Math.round(variancePercent * 10) / 10,
      status,
    };
  });

  return {
    success: true,
    data,
  };
};

const generateFinancialRatios = (): FinancialRatiosResponse => {
  const ratios = [
    {
      name: 'Current Ratio',
      value: 2.45,
      unit: ':1',
      description: 'Ability to pay short-term obligations',
      status: 'healthy' as const,
      target: 2.0,
    },
    {
      name: 'Quick Ratio',
      value: 1.85,
      unit: ':1',
      description: 'Liquidity without inventory',
      status: 'healthy' as const,
      target: 1.5,
    },
    {
      name: 'Gross Profit Margin',
      value: 35.92,
      unit: '%',
      description: 'Profitability after direct costs',
      status: 'healthy' as const,
      target: 30.0,
    },
    {
      name: 'Operating Margin',
      value: 28.5,
      unit: '%',
      description: 'Operating efficiency',
      status: 'healthy' as const,
      target: 25.0,
    },
    {
      name: 'ROI',
      value: 42.3,
      unit: '%',
      description: 'Return on investment',
      status: 'healthy' as const,
      target: 35.0,
    },
    {
      name: 'Debt-to-Equity',
      value: 0.35,
      unit: ':1',
      description: 'Financial leverage',
      status: 'healthy' as const,
      target: 0.5,
    },
  ];

  return {
    success: true,
    data: ratios,
  };
};

// API methods
export const financeApi = {
  getMetrics: async (dateRange?: DateRange): Promise<FinancialMetricsResponse> => {
    await delay(800);
    return generateFinancialMetrics();
  },

  getProfitLoss: async (dateRange?: DateRange): Promise<ProfitLossResponse> => {
    await delay(800);
    return generateProfitLoss();
  },

  getTrends: async (period: TimePeriod): Promise<TimeSeriesResponse> => {
    await delay(800);
    return generateTrends(period);
  },

  getExpenseBreakdown: async (dateRange?: DateRange): Promise<ExpenseBreakdownResponse> => {
    await delay(800);
    return generateExpenseBreakdown();
  },

  getCashFlow: async (period: CashFlowPeriod): Promise<CashFlowResponse> => {
    await delay(800);
    return generateCashFlow(period);
  },

  getBudgetComparison: async (dateRange?: DateRange): Promise<BudgetComparisonResponse> => {
    await delay(800);
    return generateBudgetComparison();
  },

  getFinancialRatios: async (): Promise<FinancialRatiosResponse> => {
    await delay(800);
    return generateFinancialRatios();
  },
};
