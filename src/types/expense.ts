export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO string format
  createdAt: string;
}

export interface Category {
  name: string;
  emoji: string;
  color: string;
  budget?: number; // אופציונלי - תקציב חודשי
}

export interface ExpenseStats {
  totalSpent: number;
  categoryBreakdown: Record<string, number>;
  dailyAverage: number;
  remainingBudget: number;
}

export interface UserCategory {
  name: string;
  emoji: string;
  color: string;
  isCustom: boolean; // האם זה קטגוריה שהמשתמש הוסיף
}

export interface UserBudgets {
  [categoryName: string]: number;
}