import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ExpensesList } from '../ExpensesList';
import type { Expense } from '@/types/expense';

// Mock the categories module
jest.mock('@/utils/categories', () => ({
  getCategoryByName: jest.fn().mockImplementation((name) => ({
    name,
    emoji: '📦',
    color: '#000000',
  })),
  CATEGORIES: [
    { name: 'Food', emoji: '🍔', color: '#FF0000' },
    { name: 'Transport', emoji: '🚌', color: '#0000FF' },
  ],
}));

// Mock the window.matchMedia for mobile detection
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Helper function to render the component with test data
const renderExpensesList = (expenses: Expense[] = []) => {
  const mockOnDelete = jest.fn();
  const utils = render(
    <ExpensesList 
      expenses={expenses} 
      onDeleteExpense={mockOnDelete} 
    />
  );
  return {
    ...utils,
    mockOnDelete,
  };
};

describe('ExpensesList', () => {
  // Sample test data with required fields
  const mockExpenses: Expense[] = [
    {
      id: '1',
      amount: 100,
      category: 'Food',
      description: 'Lunch',
      date: '2023-01-02T12:00:00.000Z',
      createdAt: '2023-01-02T12:00:00.000Z',
    },
    {
      id: '2',
      amount: 200,
      category: 'Transport',
      description: 'Bus ticket',
      date: '2023-01-02T12:00:00.000Z',
      createdAt: '2023-01-02T12:00:00.000Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the list of expenses', () => {
    renderExpensesList(mockExpenses);
    
    // Check if all expenses are rendered by their descriptions and categories
    mockExpenses.forEach(expense => {
      // Check for description
      expect(screen.getByText(expense.description)).toBeInTheDocument();
      
      // Check for category
      expect(screen.getByText(expense.category)).toBeInTheDocument();
    });
    
    // Instead of checking for list items, we'll check for the presence of each expense's description
    // which should be unique in our test data
    const lunchElement = screen.getByText('Lunch');
    const busTicketElement = screen.getByText('Bus ticket');
    
    expect(lunchElement).toBeInTheDocument();
    expect(busTicketElement).toBeInTheDocument();
  });

  it('displays the search input', () => {
    renderExpensesList(mockExpenses);
    expect(screen.getByPlaceholderText(/חפש לפי תיאור או קטגוריה.../i)).toBeInTheDocument();
  });

  it('displays the total expenses count and amount', () => {
    renderExpensesList(mockExpenses);
    expect(screen.getByText(/2 הוצאות • סך הכל/)).toBeInTheDocument();
  });

  it('filters expenses when search term is entered', async () => {
    renderExpensesList(mockExpenses);
    
    // Find and type in search input
    const searchInput = screen.getByPlaceholderText(/חפש לפי תיאור או קטגוריה.../i);
    fireEvent.change(searchInput, { target: { value: 'Lunch' } });
    
    // Check that the matching expense is visible
    const lunchElements = screen.getAllByText('Lunch');
    expect(lunchElements.length).toBeGreaterThan(0);
    
    // Check that the other expense is not visible
    const busTicketElements = screen.queryAllByText('Bus ticket');
    expect(busTicketElements.length).toBe(0);
  });
});
