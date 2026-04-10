# Finance Management Dashboard - Documentation

## Overview

An advanced Finance Management Dashboard has been created for your Laundry Management system. This comprehensive dashboard provides real-time financial analytics, profit & loss statements, expense tracking, cash flow monitoring, and budget performance metrics.

## 📍 Location

**Route:** `/admin/finance`
**File:** `src/app/(dashboard)/admin/finance/page.tsx`

## 🎯 Features

### 1. **Key Financial Metrics (KPI Cards)**
Six interactive metric cards displaying:
- **Total Revenue** - Overall revenue with monthly change percentage
- **Total Expenses** - Total spending with trend indicators
- **Net Profit** - Profit after all expenses
- **Profit Margin** - Percentage profitability
- **Cash Flow** - Available cash with change tracking
- **Outstanding Receivables** - Pending payments from customers

Each card shows:
- Current value with currency formatting
- Percentage change from previous month
- Visual trend indicator (up/down arrows)
- Color-coded positive/negative changes

### 2. **Profit & Loss Statement**
Comprehensive P&L breakdown with:

**Revenue Sources:**
- Laundry Services
- Dry Cleaning Services
- Ironing Services
- Additional Services
- Total Revenue calculation

**Expense Categories:**
- Materials & Detergents
- Labor & Wages
- Utilities (Water, Electricity)
- Marketing
- Rent & Facilities
- Maintenance & Equipment
- Transportation
- Other expenses
- Total Expenses calculation

**Financial Summary:**
- Gross Profit
- Operating Income
- Net Profit
- Profit Margin percentage

### 3. **Revenue vs Expenses Chart**
Interactive area chart showing:
- Revenue trends over time
- Expense trends over time
- Profit visualization
- Time period filters: Weekly, Monthly, Quarterly, Yearly
- Smooth animations and gradient fills
- Hover tooltips with detailed values

### 4. **Expense Breakdown Chart**
Visual pie chart displaying:
- Expense distribution by category
- Percentage breakdown for each category
- Color-coded categories
- Interactive legend with amounts
- Detailed breakdown table showing:
  - Category name
  - Amount in currency
  - Percentage of total expenses

### 5. **Cash Flow Analysis**
Bar chart monitoring:
- Cash inflows (green bars)
- Cash outflows (purple bars)
- Net cash flow (orange bars)
- Period selection: Monthly or Quarterly
- Zero reference line for context
- Positive/negative cash flow visualization

### 6. **Budget vs Actual Comparison**
Horizontal bar chart with:
- Budgeted amounts by department
- Actual spending by department
- Variance calculations
- Color-coded status indicators:
  - 🟢 Under Budget (green)
  - 🔵 On Track (blue)
  - 🔴 Over Budget (red)

**Department Summary Cards:**
Each department shows:
- Budgeted amount
- Actual spending
- Variance (difference)
- Variance percentage
- Status badge

### 7. **Financial Ratios & Health Indicators**
Six key financial ratios:

1. **Current Ratio** (2.45:1)
   - Measures ability to pay short-term obligations
   - Target: 2.0:1

2. **Quick Ratio** (1.85:1)
   - Liquidity without inventory
   - Target: 1.5:1

3. **Gross Profit Margin** (35.92%)
   - Profitability after direct costs
   - Target: 30.0%

4. **Operating Margin** (28.5%)
   - Operating efficiency measure
   - Target: 25.0%

5. **ROI - Return on Investment** (42.3%)
   - Overall investment returns
   - Target: 35.0%

6. **Debt-to-Equity Ratio** (0.35:1)
   - Financial leverage indicator
   - Target: 0.5:1

Each ratio displays:
- Current value
- Unit of measurement
- Description
- Health status (Healthy/Warning/Critical)
- Target value for comparison
- Visual status indicator

## 📁 File Structure

```
src/
├── app/(dashboard)/admin/finance/
│   └── page.tsx                          # Main dashboard page
├── components/finance/
│   ├── revenue-expense-chart.tsx         # Revenue vs Expenses chart
│   ├── expense-breakdown-chart.tsx       # Expense pie chart
│   ├── cash-flow-chart.tsx              # Cash flow bar chart
│   ├── budget-comparison-chart.tsx       # Budget vs Actual chart
│   ├── profit-loss-card.tsx             # P&L statement card
│   └── financial-ratios-section.tsx     # Financial ratios display
├── lib/
│   ├── types/finance.ts                  # TypeScript type definitions
│   ├── api/finance.ts                    # API functions (mock data)
│   └── hooks/use-finance.ts             # React Query hooks
└── components/layout/
    └── advanced-sidebar.tsx              # Updated sidebar navigation
```

## 🔧 Technical Implementation

### Technologies Used
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **TanStack Query** - Data fetching and caching
- **Recharts** - Chart library for data visualization
- **shadcn/ui** - UI component library
- **Tailwind CSS v4** - Styling
- **Lucide React** - Icons

### API Hooks

All hooks use TanStack Query for efficient data fetching and caching:

```typescript
// Get overall financial metrics
useFinancialMetrics(dateRange?)

// Get profit & loss data
useProfitLoss(dateRange?)

// Get revenue vs expense trends
useRevenueExpenseTrends(period: 'weekly' | 'monthly' | 'quarterly' | 'yearly')

// Get expense breakdown by category
useExpenseBreakdown(dateRange?)

// Get cash flow data
useCashFlow(period: 'monthly' | 'quarterly')

// Get budget vs actual comparison
useBudgetComparison(dateRange?)

// Get financial ratios
useFinancialRatios()
```

### Mock Data Implementation

Currently using mock data for demonstration. The API layer is in `src/lib/api/finance.ts` and generates realistic financial data with:
- Simulated API delays (800ms)
- Randomized but realistic values
- Proper data structures
- Success/error responses

### Type Definitions

All TypeScript interfaces are in `src/lib/types/finance.ts`:
- `FinancialMetrics` - KPI data
- `ProfitLossData` - P&L statement
- `TimeSeriesData` - Chart time series
- `ExpenseCategory` - Expense breakdown
- `CashFlowData` - Cash flow information
- `BudgetComparison` - Budget vs actual
- `FinancialRatio` - Financial health metrics

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Adaptive grid layouts
- Collapsible sidebar on mobile
- Touch-friendly interactions

### Visual Elements
- Gradient-filled area charts
- Color-coded categories
- Animated loading skeletons
- Smooth transitions
- Hover effects on interactive elements

### Color Scheme
- Revenue: Blue (`hsl(var(--chart-1))`)
- Expenses: Purple (`hsl(var(--chart-2))`)
- Profit: Green (`hsl(var(--chart-3))`)
- Cash Flow: Orange (`hsl(var(--chart-4))`)
- Budget: Cyan (`hsl(var(--chart-5))`)

### Accessibility
- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader friendly
- High contrast ratios

## 🚀 Usage

### Accessing the Dashboard
1. Navigate to `/admin/finance` from the admin panel
2. Or click "Finance > Dashboard" in the sidebar
3. Keyboard shortcut: Press `F` (when sidebar is focused)

### Interacting with Charts
- **Hover** over chart elements for detailed tooltips
- **Click** time period tabs to change data granularity
- **Switch** between monthly/quarterly views on cash flow
- **Scroll** through the page to see all sections

### Exporting Data
- Click "Generate Report" to create detailed financial reports (to be implemented)
- Click "Export Data" to download data in various formats (to be implemented)

## 🔄 Future Enhancements

### Backend Integration
Replace mock data in `src/lib/api/finance.ts` with actual API calls:

```typescript
export const financeApi = {
  getMetrics: async (dateRange?: DateRange) => {
    const response = await fetch('/api/finance/metrics', {
      method: 'POST',
      body: JSON.stringify({ dateRange }),
    });
    return response.json();
  },
  // ... other methods
};
```

### Planned Features
1. **Date Range Picker** - Filter all data by custom date ranges
2. **PDF Report Generation** - Export formatted financial reports
3. **Excel Export** - Download data in Excel format
4. **Comparison Views** - Compare current vs previous periods
5. **Forecasting** - AI-powered financial projections
6. **Alert System** - Notifications for budget overruns
7. **Drill-down Views** - Click metrics for detailed breakdowns
8. **Custom Dashboard** - Drag-and-drop widgets
9. **Real-time Updates** - WebSocket integration for live data
10. **Multi-currency Support** - Currency conversion and display

## 📊 Data Flow

```
User Request
    ↓
React Component (Finance Page)
    ↓
Custom Hook (useFinancialMetrics, etc.)
    ↓
TanStack Query (Caching & State Management)
    ↓
API Layer (src/lib/api/finance.ts)
    ↓
Backend API (To be implemented)
    ↓
Database
```

## 🐛 Troubleshooting

### Charts not rendering
- Ensure Recharts is installed: `npm install recharts`
- Check if chart component is installed: `npx shadcn@latest add chart`
- Verify data structure matches expected types

### Data not loading
- Check browser console for errors
- Verify API endpoints are accessible
- Ensure TanStack Query is properly configured

### Styling issues
- Confirm Tailwind CSS v4 is properly set up
- Check `globals.css` for required CSS variables
- Verify chart color variables are defined in theme

## 📝 Notes

- All currency values are in Indian Rupees (₹)
- Mock data is generated with realistic values for demonstration
- The dashboard updates automatically via TanStack Query's refetch mechanism
- All components are client-side rendered for interactivity
- Loading states are handled with skeleton loaders for better UX

## 🔐 Security Considerations

When implementing backend:
- Implement proper authentication and authorization
- Validate date ranges and input parameters
- Sanitize user inputs
- Use HTTPS for all API calls
- Implement rate limiting
- Add audit logging for financial data access

## 📚 Additional Resources

- [Recharts Documentation](https://recharts.org/)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS v4](https://tailwindcss.com/)

---

**Created:** 2026-02-12
**Version:** 1.0.0
**Status:** Production Ready (with mock data)
