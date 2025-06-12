import { renderHook } from '@testing-library/react';
import { useAppData } from '../useAppData';
import { useUserCategories, useBudgets, useSettings } from '../useLocalStorage';

// Mock the dependencies
jest.mock('../useLocalStorage');

// Mock the categories utils
const mockGetAllCategories = jest.fn();
const mockGetCategoryBudget = jest.fn();
const mockGetCategoryByNameEnhanced = jest.fn();

jest.mock('@/utils/categories', () => ({
  getAllCategories: (cats: any) => mockGetAllCategories(cats),
  getCategoryBudget: (name: string, budgets: any) => mockGetCategoryBudget(name, budgets),
  getCategoryByNameEnhanced: (name: string, categories: any) => 
    mockGetCategoryByNameEnhanced(name, categories)
}));

describe('useAppData', () => {
  const mockUserCategories = [
    { name: 'Food', emoji: '🍔', color: 'red', isCustom: true },
  ];

  const mockBudgets = {
    Food: 1000,
  };

  const mockSettings = {
    monthlyBudget: 5000,
    currency: '₪',
    language: 'he',
  };

  const mockAllCategories = [
    { name: 'Default', emoji: '📦', color: 'gray', isCustom: false },
    ...mockUserCategories,
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock implementations
    (useUserCategories as jest.Mock).mockReturnValue([mockUserCategories, jest.fn()]);
    (useBudgets as jest.Mock).mockReturnValue([mockBudgets, jest.fn()]);
    (useSettings as jest.Mock).mockReturnValue([mockSettings, jest.fn()]);
    
    mockGetAllCategories.mockImplementation(() => mockAllCategories);
    mockGetCategoryBudget.mockImplementation((name: string) => {
      // Type assertion to tell TypeScript that name is a key of mockBudgets
      const budgets = mockBudgets as Record<string, number>;
      return budgets[name] || 0;
    });
    mockGetCategoryByNameEnhanced.mockImplementation((name) => 
      mockUserCategories.find(cat => cat.name === name) || null
    );
  });

  it('should return all categories', () => {
    const { result } = renderHook(() => useAppData());
    expect(mockGetAllCategories).toHaveBeenCalledWith(mockUserCategories);
    expect(result.current.allCategories).toEqual(mockAllCategories);
  });

  it('should return budget for a category', () => {
    const { result } = renderHook(() => useAppData());
    
    const budget = result.current.getBudgetForCategory('Food');
    expect(mockGetCategoryBudget).toHaveBeenCalledWith('Food', mockBudgets);
    expect(budget).toBe(1000);
  });

  it('should return category info', () => {
    const { result } = renderHook(() => useAppData());
    
    const categoryInfo = result.current.getCategoryInfo('Food');
    expect(mockGetCategoryByNameEnhanced).toHaveBeenCalledWith('Food', mockUserCategories);
    expect(categoryInfo).toEqual(mockUserCategories[0]);
  });

  it('should format currency correctly', () => {
    // Test ILS (₪)
    const { result } = renderHook(() => useAppData());
    expect(result.current.formatCurrency(1000)).toMatch(/1,000/);
    
    // Test USD ($)
    (useSettings as jest.Mock).mockReturnValueOnce([{ ...mockSettings, currency: '$' }, jest.fn()]);
    const { result: usdResult } = renderHook(() => useAppData());
    expect(usdResult.current.formatCurrency(1000)).toMatch('1,000 $');
  });

  it('should expose user data', () => {
    const { result } = renderHook(() => useAppData());
    
    expect(result.current.userCategories).toEqual(mockUserCategories);
    expect(result.current.budgets).toEqual(mockBudgets);
    expect(result.current.settings).toEqual(mockSettings);
  });
});
