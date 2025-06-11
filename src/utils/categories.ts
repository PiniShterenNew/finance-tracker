import type { Category, UserCategory, UserBudgets } from '../types/expense';

// הקטגוריות הבסיסיות נשארות
export const CATEGORIES: Category[] = [
  { name: 'אוכל', emoji: '🍕', color: '#ef4444', budget: 1500 },
  { name: 'תחבורה', emoji: '⛽', color: '#3b82f6', budget: 800 },
  { name: 'בילויים', emoji: '🎬', color: '#8b5cf6', budget: 600 },
  { name: 'קניות', emoji: '🛍️', color: '#f59e0b', budget: 1000 },
  { name: 'בריאות', emoji: '💊', color: '#10b981', budget: 400 },
  { name: 'אחר', emoji: '💰', color: '#6b7280', budget: 500 }
];

// 🆕 פונקציה שמשלבת קטגוריות ברירת מחדל + קטגוריות משתמש
export function getAllCategories(userCategories: UserCategory[] = []): UserCategory[] {
  const defaultCategories: UserCategory[] = CATEGORIES.map(cat => ({
    name: cat.name,
    emoji: cat.emoji,
    color: cat.color,
    isCustom: false
  }));
  
  return [...defaultCategories, ...userCategories];
}

// 🆕 פונקציה שמחזירה תקציב (משתמש או ברירת מחדל)
export function getCategoryBudget(
  categoryName: string, 
  userBudgets: UserBudgets
): number {
  // אם המשתמש הגדיר תקציב - קח את שלו
  if (userBudgets[categoryName]) {
    return userBudgets[categoryName];
  }
  
  // אחרת קח ברירת מחדל
  const defaultCategory = CATEGORIES.find(cat => cat.name === categoryName);
  return defaultCategory?.budget || 0;
}

// 🆕 פונקציה שמחזירה קטגוריה (כולל מותאמות אישית)
export function getCategoryByNameEnhanced(
  categoryName: string, 
  userCategories: UserCategory[] = []
): UserCategory | undefined {
  // חפש בקטגוריות המותאמות אישית
  const userCategory = userCategories.find(cat => cat.name === categoryName);
  if (userCategory) return userCategory;
  
  // חפש בקטגוריות ברירת מחדל
  const defaultCategory = CATEGORIES.find(cat => cat.name === categoryName);
  if (defaultCategory) {
    return {
      name: defaultCategory.name,
      emoji: defaultCategory.emoji,
      color: defaultCategory.color,
      isCustom: false
    };
  }
  
  return undefined;
}

// הפונקציות הישנות נשארות לתאימות
export const getCategoryByName = (name: string): Category | undefined => {
  return CATEGORIES.find(cat => cat.name === name);
};

export const getCategoryColor = (categoryName: string): string => {
  return getCategoryByName(categoryName)?.color || '#6b7280';
};

export const AVAILABLE_COLORS = [
  '#ef4444', '#f59e0b', '#10b981', '#3b82f6', 
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
  '#84cc16', '#6366f1', '#a855f7', '#06b6d4'
];

export const AVAILABLE_EMOJIS = [
  '🍕', '⛽', '🎬', '🛍️', '💊', '💰', '🏠', '📱',
  '✈️', '🎮', '📚', '🏃‍♂️', '🐕', '🚗', '💡', '🎵'
];