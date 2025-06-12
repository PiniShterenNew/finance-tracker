import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AddExpense } from '../AddExpense';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

it('renders english text when language is en', () => {
  // Force english via initial settings
  localStorage.setItem('settings', JSON.stringify({ monthlyBudget: 5000, currency: '₪', language: 'en' }));
  render(
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <AddExpense onAddExpense={jest.fn()} />
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
  expect(screen.getByText('Add New Expense')).toBeInTheDocument();
});
