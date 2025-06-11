import { useState } from "react";
import type { Expense, UserBudgets, UserCategory } from "../types/expense";

export function useLocalStorage<T>(
    key: string,
    initialValue: T
    ): [T, (value: T | ((val: T) => T)) => void] {

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);

      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

export function useExpenses() {
    return useLocalStorage<Expense[]>('expenses', []);
}

export function useUserCategories() {
    return useLocalStorage<UserCategory[]>('userCategories', []);
}

export function useBudgets() {
    return useLocalStorage<UserBudgets>('budgets', {});
}

export function useSettings() {
    return useLocalStorage('settings', {
        monthlyBudget: 5000,
        currency: '₪',
        language: 'he'
    });
}

