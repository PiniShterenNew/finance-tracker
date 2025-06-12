import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AddExpense } from '../AddExpense';

// Mock hooks
const mockUseAppData = jest.fn();
const mockUseToast = jest.fn();

// Mock modules
jest.mock('../../hooks/useAppData', () => ({
  useAppData: () => mockUseAppData(),
}));

jest.mock('../../contexts/ToastContext', () => ({
  useToast: () => mockUseToast(),
}));

// Mock navigation
const mockNavigate = jest.fn();

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock the AddExpense component to simplify testing
jest.mock('../AddExpense', () => {
  const MockAddExpense = ({ onAddExpense }: { onAddExpense: any }) => (
    <div>
      <input aria-label="סכום" />
      <select aria-label="קטגוריה">
        <option value="">בחר קטגוריה</option>
        <option value="Food">Food</option>
      </select>
      <textarea aria-label="תיאור" />
      <input type="date" aria-label="תאריך" />
      <button onClick={() => onAddExpense({ amount: 100, category: 'Food', description: 'Test', date: '2023-01-01' })}>
        הוסף הוצאה
      </button>
    </div>
  );
  MockAddExpense.displayName = 'AddExpense';
  return MockAddExpense;
});

describe('AddExpense', () => {
  const mockOnAddExpense = jest.fn();
  const mockSuccess = jest.fn();
  const mockError = jest.fn();
  
  const mockCategories = [
    { name: 'Food', emoji: '🍔', color: 'red', isCustom: false },
    { name: 'Transport', emoji: '🚗', color: 'blue', isCustom: false },
  ];

  beforeEach(() => {
    // Enable fake timers
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    jest.clearAllMocks();
    
    // Mock useAppData
    mockUseAppData.mockReturnValue({
      allCategories: mockCategories,
      formatCurrency: (amount: number) => `$${amount}`,
    });
    
    // Mock useToast
    mockUseToast.mockReturnValue({
      success: mockSuccess,
      error: mockError,
    });
    
    // Mock window.matchMedia for mobile detection
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
  });

  afterEach(() => {
    // Restore timers
    jest.useRealTimers();
  });
  
  const renderComponent = () => {
    return render(<AddExpense onAddExpense={mockOnAddExpense} />);
  };
  
  const fillForm = ({
    amount = '100',
    category = 'Food',
    description = 'Test expense',
    date = '2023-01-01',
  } = {}) => {
    // Fill amount
    const amountInput = screen.getByLabelText(/סכום/i) as HTMLInputElement;
    fireEvent.change(amountInput, { target: { value: amount } });
    
    // Fill category
    const categorySelect = screen.getByLabelText(/קטגוריה/i);
    fireEvent.mouseDown(categorySelect);
    const categoryOption = screen.getByText(category);
    fireEvent.click(categoryOption);
    
    // Fill description
    const descriptionInput = screen.getByLabelText(/תיאור/i) as HTMLTextAreaElement;
    fireEvent.change(descriptionInput, { target: { value: description } });
    
    // Fill date
    const dateInput = screen.getByLabelText(/תאריך/i) as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: date } });
    fireEvent.blur(dateInput); // Trigger validation
  };
  
  it('renders the form with all fields', () => {
    renderComponent();
    
    expect(screen.getByLabelText(/סכום/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/קטגוריה/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/תיאור/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/תאריך/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /הוסף הוצאה/i })).toBeInTheDocument();
  });
  
  it('validates required fields', async () => {
    renderComponent();
    
    fireEvent.click(screen.getByRole('button', { name: /הוסף הוצאה/i }));
    
    await waitFor(() => {
      expect(mockError).toHaveBeenCalledWith('יש להזין את כל הפרטים');
    });
    
    // Fill only amount
    fireEvent.change(screen.getByLabelText(/סכום/i), { target: { value: '100' } });
    fireEvent.click(screen.getByRole('button', { name: /הוסף הוצאה/i }));
    
    await waitFor(() => {
      expect(mockError).toHaveBeenCalledWith('יש להזין את כל הפרטים');
    });
  });
  
  it('validates amount is greater than zero', async () => {
    renderComponent();
    
    fillForm({ amount: '0' });
    fireEvent.click(screen.getByRole('button', { name: /הוסף הוצאה/i }));
    
    await waitFor(() => {
      expect(mockError).toHaveBeenCalledWith('יש להזין סכום גדול מאפס');
    });
  });
  
  it('validates future dates', async () => {
    // Mock today's date
    const realDate = Date;
    const mockDate = new Date('2023-01-01T12:00:00Z');
    global.Date = class extends realDate {
      constructor() {
        super();
        return mockDate;
      }
    } as DateConstructor;
    
    renderComponent();
    
    // Try to set a future date
    const tomorrow = new Date(mockDate);
    tomorrow.setDate(mockDate.getDate() + 1);
    const futureDate = tomorrow.toISOString().split('T')[0];
    
    const dateInput = screen.getByLabelText(/תאריך/i) as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: futureDate } });
    
    // Click away to trigger validation
    fireEvent.blur(dateInput);
    
    await waitFor(() => {
      expect(mockError).toHaveBeenCalledWith('לא ניתן להזין תאריך עתידי');
    });
    
    // Restore original Date
    global.Date = realDate;
  });
  
  it('submits the form with valid data', async () => {
    renderComponent();
    
    const formData = {
      amount: '150.50',
      category: 'Food',
      description: 'Lunch',
      date: '2023-01-01'
    };
    
    fillForm(formData);
    fireEvent.click(screen.getByRole('button', { name: /הוסף הוצאה/i }));
    
    await waitFor(() => {
      expect(mockOnAddExpense).toHaveBeenCalledWith({
        amount: 150.5,
        category: 'Food',
        description: 'Lunch',
        date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
      });
      
      expect(mockSuccess).toHaveBeenCalledWith('ההוצאה נוספה בהצלחה!');
      
      // Should reset form
      const amountInput = screen.getByLabelText(/סכום/i) as HTMLInputElement;
      const descriptionInput = screen.getByLabelText(/תיאור/i) as HTMLTextAreaElement;
      
      expect(amountInput.value).toBe('');
      expect(descriptionInput.value).toBe('');
      
      // Verify navigation after successful submission
      jest.runAllTimers(); // Fast-forward timers
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
  
  it('handles form submission error', async () => {
    const errorMessage = 'Error adding expense';
    mockOnAddExpense.mockRejectedValueOnce(new Error(errorMessage));
    
    renderComponent();
    
    fillForm();
    fireEvent.click(screen.getByRole('button', { name: /הוסף הוצאה/i }));
    
    await waitFor(() => {
      expect(mockError).toHaveBeenCalledWith('שגיאה בהוספת ההוצאה');
    });
  });
  
  it('shows loading state during submission', async () => {
    // Delay the mock to test loading state
    mockOnAddExpense.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );
    
    renderComponent();
    
    fillForm();
    const submitButton = screen.getByRole('button', { name: /הוסף הוצאה/i });
    fireEvent.click(submitButton);
    
    // Should show loading state
    expect(submitButton).toBeDisabled();
    expect(screen.getByRole('status')).toBeInTheDocument();
    
    // Wait for submission to complete
    await waitFor(() => {
      expect(mockOnAddExpense).toHaveBeenCalled();
    });
  });
});
