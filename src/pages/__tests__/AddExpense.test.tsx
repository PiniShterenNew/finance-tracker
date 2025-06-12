import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AddExpense } from '../AddExpense';

describe('AddExpense Component', () => {
  const mockAdd = jest.fn();
  const mockError = jest.fn();
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <AddExpense onAddExpense={mockAdd} />
      </BrowserRouter>
    );

  const fillForm = async (overrides: Partial<{ date: string; amount: string; category: string; description: string }> = {}) => {
    const date = overrides.date || '2025-06-10';
    const amount = overrides.amount || '50';
    const category = overrides.category || '🍔Food';
    const description = overrides.description || 'Test expense';

    fireEvent.change(screen.getByLabelText(/תאריך/i), { target: { value: date } });
    fireEvent.change(screen.getByLabelText(/סכום/i), { target: { value: amount } });
    fireEvent.change(screen.getByLabelText(/תיאור/i), { target: { value: description } });

    const categorySelect = screen.getByText(/בחר קטגוריה/i);
    fireEvent.mouseDown(categorySelect);
    const option = screen.getByText(category);
    fireEvent.click(option);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all fields and buttons', () => {
    renderComponent();
    expect(screen.getByLabelText(/תאריך/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/סכום/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/קטגוריה/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/תיאור/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /הוסף הוצאה/i })).toBeInTheDocument();
  });

  it('submits form and resets', async () => {
    renderComponent();
    await fillForm();
    fireEvent.click(screen.getByRole('button', { name: /הוסף הוצאה/i }));
    await waitFor(() => {
      expect(mockAdd).toHaveBeenCalled();
    });
  });

  it('shows error on missing fields', async () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /הוסף הוצאה/i }));
    await waitFor(() => {
      expect(mockError).toHaveBeenCalled();
    });
  });

  it('shows error for future date', async () => {
    renderComponent();
    await fillForm({ date: '3000-01-01' });
    fireEvent.click(screen.getByRole('button', { name: /הוסף הוצאה/i }));
    await waitFor(() => {
      expect(mockError).toHaveBeenCalled();
    });
  });

  it('shows error if amount is 0', async () => {
    renderComponent();
    await fillForm({ amount: '0' });
    fireEvent.click(screen.getByRole('button', { name: /הוסף הוצאה/i }));
    await waitFor(() => {
      expect(mockError).toHaveBeenCalled();
    });
  });

  it('handles error if onAddExpense throws', async () => {
    mockAdd.mockImplementation(() => {
      throw new Error('Mock failure');
    });

    renderComponent();
    await fillForm();
    fireEvent.click(screen.getByRole('button', { name: /הוסף הוצאה/i }));
    await waitFor(() => {
      expect(mockError).toHaveBeenCalledWith('שגיאה בהוספת ההוצאה');
    });
  });
});