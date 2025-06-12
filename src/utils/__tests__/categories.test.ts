import { CATEGORIES, getAllCategories, getCategoryBudget, getCategoryByNameEnhanced, getCategoryColor, getCategoryByName } from '../categories';
import type { UserCategory, UserBudgets } from '../../types/expense';

describe('categories utils', () => {
  const mockUserCategories: UserCategory[] = [
    { name: 'Custom1', emoji: '🎮', color: '#ff0000', isCustom: true },
    { name: 'Custom2', emoji: '🎨', color: '#00ff00', isCustom: true },
  ];

  const mockBudgets: UserBudgets = {
    'Custom1': 500,
    'אוכל': 2000, // Override default
  };

  describe('getAllCategories', () => {
    it('should return default categories when no user categories', () => {
      const result = getAllCategories();
      expect(result).toHaveLength(CATEGORIES.length);
      expect(result.every(cat => !cat.isCustom)).toBe(true);
    });

    it('should combine default and user categories', () => {
      const result = getAllCategories(mockUserCategories);
      expect(result).toHaveLength(CATEGORIES.length + mockUserCategories.length);
      
      // Default categories should be first
      CATEGORIES.forEach((cat, index) => {
        expect(result[index].name).toBe(cat.name);
        expect(result[index].isCustom).toBe(false);
      });
      
      // User categories should be after
      mockUserCategories.forEach((cat, index) => {
        expect(result[CATEGORIES.length + index].name).toBe(cat.name);
        expect(result[CATEGORIES.length + index].isCustom).toBe(true);
      });
    });
  });

  describe('getCategoryBudget', () => {
    it('should return user budget if exists', () => {
      expect(getCategoryBudget('Custom1', mockBudgets)).toBe(500);
      expect(getCategoryBudget('אוכל', mockBudgets)).toBe(2000);
    });

    it('should return default budget if user budget not set', () => {
      const foodCategory = CATEGORIES.find(c => c.name === 'אוכל');
      expect(getCategoryBudget('תחבורה', mockBudgets)).toBe(800);
      expect(getCategoryBudget('לא קיים', mockBudgets)).toBe(0);
    });
  });

  describe('getCategoryByNameEnhanced', () => {
    it('should find user categories first', () => {
      const result = getCategoryByNameEnhanced('Custom1', mockUserCategories);
      expect(result).toEqual(mockUserCategories[0]);
    });

    it('should fall back to default categories', () => {
      const foodCategory = CATEGORIES.find(c => c.name === 'אוכל');
      const result = getCategoryByNameEnhanced('אוכל', mockUserCategories);
      expect(result).toEqual({
        name: foodCategory!.name,
        emoji: foodCategory!.emoji,
        color: foodCategory!.color,
        isCustom: false
      });
    });

    it('should return undefined for non-existent category', () => {
      const result = getCategoryByNameEnhanced('לא קיים', mockUserCategories);
      expect(result).toBeUndefined();
    });
  });

  describe('getCategoryColor', () => {
    it('should return color for existing category', () => {
      const foodCategory = CATEGORIES.find(c => c.name === 'אוכל');
      expect(getCategoryColor('אוכל')).toBe(foodCategory!.color);
    });

    it('should return default color for non-existent category', () => {
      expect(getCategoryColor('לא קיים')).toBe('#6b7280'); // Default color
    });
  });

  describe('getCategoryByName', () => {
    it('should find category by name', () => {
      const foodCategory = CATEGORIES.find(c => c.name === 'אוכל');
      expect(getCategoryByName('אוכל')).toBe(foodCategory);
    });

    it('should return undefined for non-existent category', () => {
      expect(getCategoryByName('לא קיים')).toBeUndefined();
    });
  });
});
