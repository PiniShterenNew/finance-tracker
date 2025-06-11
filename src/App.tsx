import { Dashboard } from '@/pages/Dashboard';
import { useExpenses } from '@/hooks/useLocalStorage';
import type { Expense } from '@/types/expense';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { AddExpense } from '@/pages/AddExpense';
import { ExpensesList } from '@/pages/ExpensesList';
import { Settings } from '@/pages/Settings';
import { ToastProvider } from './contexts/ToastContext';

function App() {
  const [expenses, setExpenses] = useExpenses();

  const handleAddExpense = (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      id: Date.now().toString(), // מזהה ייחודי פשוט
      ...expenseData,
      createdAt: new Date().toISOString()
    };

    setExpenses(prevExpenses => [...prevExpenses, newExpense]);
  };

  // פונקציה למחיקת הוצאה
  const handleDeleteExpense = (id: string) => {
    setExpenses(prevExpenses =>
      prevExpenses.filter(expense => expense.id !== id)
    );
  };

  return (
    <ToastProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route
              path="/"
              element={<Dashboard expenses={expenses} />}
            />
            <Route
              path="/add"
              element={<AddExpense onAddExpense={handleAddExpense} />}
            />
            <Route
              path="/expenses"
              element={
                <ExpensesList
                  expenses={expenses}
                  onDeleteExpense={handleDeleteExpense}
                />
              }
            />
            <Route
              path="/settings"
              element={<Settings />}
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App
