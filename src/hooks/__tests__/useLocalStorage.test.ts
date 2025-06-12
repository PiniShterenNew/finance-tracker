import { renderHook, act } from '@testing-library/react';
import { useLocalStorage, useExpenses, useUserCategories, useBudgets, useSettings } from '../useLocalStorage';
import type { Expense, UserBudgets, UserCategory } from '../../types/expense';

// Mock the localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

// Mock the window.localStorage
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  it('should initialize with initial value', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));
    expect(result.current[0]).toBe('initialValue');
  });

  it('should get value from localStorage if it exists', () => {
    const storedValue = JSON.stringify('storedValue');
    window.localStorage.setItem('testKey', storedValue);

    const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));
    expect(result.current[0]).toBe(JSON.parse(storedValue));
  });

  it('should save value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));
    const [, setValue] = result.current;

    act(() => {
      setValue('newValue');
    });

    expect(result.current[0]).toBe('newValue');
    expect(window.localStorage.getItem('testKey')).toBe(JSON.stringify('newValue'));
  });

  it('should handle function updates', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 1));
    const [, setValue] = result.current;

    act(() => {
      setValue(prev => prev + 1);
    });

    expect(result.current[0]).toBe(2);
    expect(window.localStorage.getItem('counter')).toBe('2');
  });
});

describe('useExpenses', () => {
  const mockExpense: Expense = {
    id: '1',
    amount: 100,
    category: 'Food',
    description: 'Lunch',
    date: '2023-01-01T12:00:00.000Z',
    createdAt: '2023-01-01T12:00:00.000Z'
  };

  it('should initialize with empty array', () => {
    const { result } = renderHook(() => useExpenses());
    expect(result.current[0]).toEqual([]);
  });

  it('should save expenses to localStorage', () => {
    const { result } = renderHook(() => useExpenses());
    const [, setExpenses] = result.current;

    act(() => {
      setExpenses([mockExpense]);
    });

    expect(result.current[0]).toEqual([mockExpense]);
    expect(window.localStorage.getItem('expenses')).toBe(JSON.stringify([mockExpense]));
  });
});

describe('useUserCategories', () => {
  const mockCategory: Omit<UserCategory, 'id'> & { id?: string } = {
    name: 'New Category',
    emoji: '🛒',
    color: '#ff0000',
    isCustom: true
  };

  it('should initialize with empty array', () => {
    const { result } = renderHook(() => useUserCategories());
    expect(result.current[0]).toEqual([]);
  });

  it('should save categories to localStorage', () => {
    const { result } = renderHook(() => useUserCategories());
    const [, setCategories] = result.current;

    act(() => {
      setCategories([mockCategory as UserCategory]);
    });

    expect(result.current[0]).toEqual([mockCategory]);
    expect(window.localStorage.getItem('userCategories')).toBe(JSON.stringify([mockCategory]));
  });
});

describe('useBudgets', () => {
  const mockBudgets: UserBudgets = {
    Food: 1000,
    Transport: 500
  };

  it('should initialize with empty object', () => {
    const { result } = renderHook(() => useBudgets());
    expect(result.current[0]).toEqual({});
  });

  it('should save budgets to localStorage', () => {
    const { result } = renderHook(() => useBudgets());
    const [, setBudgets] = result.current;

    act(() => {
      setBudgets(mockBudgets);
    });

    expect(result.current[0]).toEqual(mockBudgets);
    expect(window.localStorage.getItem('budgets')).toBe(JSON.stringify(mockBudgets));
  });
});

describe('useSettings', () => {
  const defaultSettings = {
    monthlyBudget: 5000,
    currency: '₪',
    language: 'he'
  };

  it('should initialize with default settings', () => {
    const { result } = renderHook(() => useSettings());
    expect(result.current[0]).toEqual(defaultSettings);
  });

  it('should save settings to localStorage', () => {
    const { result } = renderHook(() => useSettings());
    const [, setSettings] = result.current;
    const newSettings = { ...defaultSettings, currency: '$' };

    act(() => {
      setSettings(newSettings);
    });

    expect(result.current[0]).toEqual(newSettings);
    expect(window.localStorage.getItem('settings')).toBe(JSON.stringify(newSettings));
  });
});
