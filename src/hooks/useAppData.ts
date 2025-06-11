import { useUserCategories, useBudgets, useSettings } from './useLocalStorage';
import { getAllCategories, getCategoryBudget, getCategoryByNameEnhanced } from '@/utils/categories';

export function useAppData() {
  const [userCategories] = useUserCategories();
  const [budgets] = useBudgets();
  const [settings] = useSettings();

  const allCategories = getAllCategories(userCategories);
  
  const getBudgetForCategory = (categoryName: string) => {
    return getCategoryBudget(categoryName, budgets);
  };

  const getCategoryInfo = (categoryName: string) => {
    return getCategoryByNameEnhanced(categoryName, userCategories);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: settings.currency === '₪' ? 'ILS' : settings.currency === '$' ? 'USD' : 'EUR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return {
    allCategories,
    userCategories,
    budgets,
    settings,
    getBudgetForCategory,
    getCategoryInfo,
    formatCurrency
  };
}