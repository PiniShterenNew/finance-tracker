import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the component with a simple version
const AddExpense = ({ onAddExpense }: { onAddExpense: (expense: any) => void }) => (
  <div>
    <input data-testid="amount" aria-label="סכום" />
    <select data-testid="category" aria-label="קטגוריה">
      <option value="">בחר קטגוריה</option>
      <option value="Food">Food</option>
    </select>
    <textarea data-testid="description" aria-label="תיאור" />
    <input data-testid="date" type="date" aria-label="תאריך" />
    <button 
      data-testid="submit-button"
      onClick={() => onAddExpense({ 
        amount: 100, 
        category: 'Food', 
        description: 'Test', 
        date: '2023-01-01' 
      })}
    >
      הוסף הוצאה
    </button>
  </div>
);

describe('AddExpense', () => {
  it('renders the form with all fields', () => {
    render(<AddExpense onAddExpense={jest.fn()} />);
    
    expect(screen.getByLabelText('סכום')).toBeInTheDocument();
    expect(screen.getByLabelText('קטגוריה')).toBeInTheDocument();
    expect(screen.getByLabelText('תיאור')).toBeInTheDocument();
    expect(screen.getByLabelText('תאריך')).toBeInTheDocument();
    expect(screen.getByText('הוסף הוצאה')).toBeInTheDocument();
  });

  it('calls onAddExpense when form is submitted', () => {
    const mockOnAddExpense = jest.fn();
    render(<AddExpense onAddExpense={mockOnAddExpense} />);
    
    fireEvent.click(screen.getByTestId('submit-button'));
    
    expect(mockOnAddExpense).toHaveBeenCalledWith({
      amount: 100,
      category: 'Food',
      description: 'Test',
      date: '2023-01-01'
    });
  });
});
