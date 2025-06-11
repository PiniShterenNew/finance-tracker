import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, ShoppingBag, Calendar } from 'lucide-react';
import type { ChartConfig } from '@/components/ui/chart';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { Expense } from '@/types/expense';
import { useAppData } from '@/hooks/useAppData';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DashboardProps {
  expenses: Expense[];
}

export function Dashboard({ expenses }: DashboardProps) {
  const { allCategories, getBudgetForCategory, formatCurrency, getCategoryInfo } = useAppData();

  const [selectedPeriod, setSelectedPeriod] = useState<'thisMonth' | 'lastMonth' | 'last3Months' | 'last6Months' | 'thisYear'>('thisMonth');

  const getFilteredExpensesByPeriod = () => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    switch (selectedPeriod) {
      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'lastMonth':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'last3Months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'last6Months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'thisYear':
        startDate = new Date(now.getFullYear(), 0, 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        startDate.setHours(0, 0, 0, 0);
    }

    return expenses.filter(expense => {
      let expenseDate: Date;
      expenseDate = new Date(expense.date);

      if (isNaN(expenseDate.getTime())) {
        expenseDate = new Date(expense.date + 'T00:00:00');
        if (isNaN(expenseDate.getTime())) {
          return false;
        }
      }

      if (isNaN(expenseDate.getTime())) {
        return false;
      }

      const expenseDateNormalized = new Date(expenseDate.getFullYear(), expenseDate.getMonth(), expenseDate.getDate());
      const startDateNormalized = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

      if (selectedPeriod === 'lastMonth') {
        const endDateNormalized = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
        return expenseDateNormalized >= startDateNormalized && expenseDateNormalized <= endDateNormalized;
      }

      return expenseDateNormalized >= startDateNormalized;
    });
  };

  const getPeriodLabel = () => {
    const now = new Date();
    switch (selectedPeriod) {
      case 'thisMonth':
        return now.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' });
      case 'lastMonth':
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        return lastMonth.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' });
      case 'last3Months':
        return '3 חודשים אחרונים';
      case 'last6Months':
        return '6 חודשים אחרונים';
      case 'thisYear':
        return `שנת ${now.getFullYear()}`;
      default:
        return '';
    }
  };

  const getPeriodDetails = () => {
    const now = new Date();
    let startDate: Date;
    let endDate = now;

    switch (selectedPeriod) {
      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'lastMonth':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case 'last3Months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        break;
      case 'last6Months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        break;
      case 'thisYear':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return {
      startDate: startDate.toLocaleDateString('he-IL'),
      endDate: endDate.toLocaleDateString('he-IL')
    };
  };

  const calculateDailyTrend = (filteredExpenses: Expense[]) => {
    if (filteredExpenses.length === 0) return [];

    // ניסיון ראשון - 7 ימים אחרונים
    const dailyData = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const dayExpenses = filteredExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.toDateString() === date.toDateString();
      });

      const total = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);

      dailyData.push({
        date: date.toLocaleDateString('he-IL', { day: 'numeric', month: 'short' }),
        amount: total,
        fullDate: date.toISOString().split('T')[0]
      });
    }

    // בדיקה אם יש נתונים בשבוע האחרון
    const hasRecentData = dailyData.some(day => day.amount > 0);

    if (hasRecentData) {
      return dailyData;
    }

    // אם אין נתונים בשבוע האחרון, הצג את כל הימים עם הוצאות
    const expenseDates = [...new Set(filteredExpenses.map(expense => {
      const date = new Date(expense.date);
      return date.toISOString().split('T')[0];
    }))].sort();

    return expenseDates.map(dateString => {
      const date = new Date(dateString);
      const dayExpenses = filteredExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.toISOString().split('T')[0] === dateString;
      });

      const total = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);

      return {
        date: date.toLocaleDateString('he-IL', { day: 'numeric', month: 'short' }),
        amount: total,
        fullDate: dateString
      };
    });
  };

  const filteredExpenses = getFilteredExpensesByPeriod();

  const calculateCategoryData = () => {
    const categoryTotals: Record<string, number> = {};
    filteredExpenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category: getCategoryInfo(category)?.name,
      amount: amount,
      fill: getCategoryInfo(category)?.color
    }));
  };

  const calculateAveragePerDay = (filteredExpenses: Expense[], selectedPeriod: string) => {
    if (filteredExpenses.length === 0) return 0;

    const now = new Date();
    let totalDays: number;

    switch (selectedPeriod) {
      case 'thisMonth':
        totalDays = now.getDate();
        break;
      case 'lastMonth':
        const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        totalDays = lastDayOfLastMonth.getDate();
        break;
      case 'last3Months':
        totalDays = 90;
        break;
      case 'last6Months':
        totalDays = 180;
        break;
      case 'thisYear':
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        totalDays = Math.ceil((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
        break;
      default:
        totalDays = 30;
    }

    const totalSpent = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    return totalSpent / totalDays;
  };

  const totalSpent = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalBudget = allCategories.reduce((sum, cat) => sum + getBudgetForCategory(cat.name), 0);
  const averagePerDay = calculateAveragePerDay(filteredExpenses, selectedPeriod);
  const categoryData = calculateCategoryData();
  const mostExpensiveCategory = categoryData.sort((a, b) => b.amount - a.amount)[0];
  const dailyTrendData = calculateDailyTrend(filteredExpenses);

  // Chart configs
  const categoryConfig = {
    amount: {
      label: "סכום",
    },
  } satisfies ChartConfig;

  const trendConfig = {
    amount: {
      label: "סכום",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  if (expenses.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">דשבורד</h1>
          <p className="text-muted-foreground">סקירה כללית של ההוצאות שלך</p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <CardTitle className="mb-2">עדיין אין נתונים להצגה</CardTitle>
            <CardDescription>
              הוסף כמה הוצאות כדי לראות את הדשבורד שלך
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">דשבורד</h1>
        <p className="text-muted-foreground">סקירה כללית של ההוצאות שלך</p>
      </div>

      {/* Period Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>תקופת תצוגה</span>
            <Badge variant="outline">{getPeriodLabel()}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select
              value={selectedPeriod}
              onValueChange={(value: 'thisMonth' | 'lastMonth' | 'last3Months' | 'last6Months' | 'thisYear') => setSelectedPeriod(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thisMonth">החודש הנוכחי</SelectItem>
                <SelectItem value="lastMonth">החודש הקודם</SelectItem>
                <SelectItem value="last3Months">3 חודשים אחרונים</SelectItem>
                <SelectItem value="last6Months">6 חודשים אחרונים</SelectItem>
                <SelectItem value="thisYear">השנה הנוכחית</SelectItem>
              </SelectContent>
            </Select>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">מתאריך:</span>
                <div className="font-medium">{getPeriodDetails().startDate}</div>
              </div>
              <div>
                <span className="text-muted-foreground">עד תאריך:</span>
                <div className="font-medium">{getPeriodDetails().endDate}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-muted-foreground">
                {filteredExpenses.length} הוצאות בתקופה
              </span>
              <span className="text-sm font-medium">
                {formatCurrency(filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0))}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סך הוצאות</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">תקציב חודשי</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ממוצע יומי</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(Math.round(averagePerDay))}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">קטגוריה עיקרית</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{mostExpensiveCategory?.category || 'אין'}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(mostExpensiveCategory?.amount || 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pie Chart */}
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>פילוח קטגוריות</CardTitle>
            <CardDescription>התפלגות ההוצאות בתקופה</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={categoryConfig}
              className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: number, name: string) => [formatCurrency(value), name]}
                />
                <Pie
                  data={categoryData}
                  dataKey="amount"
                  nameKey="category"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
              סך הכל {formatCurrency(totalSpent)} בתקופה <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground leading-none">
              {categoryData.length} קטגוריות עם הוצאות
            </div>
          </CardFooter>
        </Card>

        {/* Daily Trend */}
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>טרנד יומי</CardTitle>
            <CardDescription>הוצאות לפי יום - שבוע אחרון</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={trendConfig}
              className="mx-auto aspect-auto max-h-[250px] w-full"
            >
              <LineChart
                accessibilityLayer
                data={dailyTrendData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [formatCurrency(value), 'סכום']}
                />
                <Line
                  dataKey="amount"
                  type="monotone"
                  stroke="var(--color-amount)"
                  strokeWidth={2}
                  dot={{
                    fill: "var(--color-amount)",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
              ממוצע יומי {formatCurrency(Math.round(averagePerDay))} <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground leading-none">
              נתונים עבור השבוע האחרון
            </div>
          </CardFooter>
        </Card>

        {/* Budget Progress */}
        <Card>
          <CardHeader>
            <CardTitle>תקציב</CardTitle>
            <CardDescription>מעקב קטגוריות</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[300px] overflow-y-auto">
            {allCategories.map(category => {
              const spent = categoryData.find(c => c.category === category.name)?.amount || 0;
              const budget = getBudgetForCategory(category.name);
              const percentage = budget > 0 ? (spent / budget) * 100 : 0;
              const isOverBudget = percentage > 100;

              return (
                <div key={category.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span>{category.emoji}</span>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className="text-xs">{percentage.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(percentage, 100)}%`,
                        backgroundColor: isOverBudget ? '#ef4444' : category.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}