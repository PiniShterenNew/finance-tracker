import React, { createContext, useContext } from 'react';
import { useSettings } from '@/hooks/useLocalStorage';

const translations = {
  he: {
    'addExpense.title': 'הוסף הוצאה חדשה',
    'addExpense.desc': 'רשום את ההוצאה החדשה שלך',
    'addExpense.amount': 'סכום (₪)',
    'addExpense.date': 'תאריך',
    'addExpense.category': 'קטגוריה',
    'addExpense.description': 'תיאור',
    'addExpense.add': 'הוסף הוצאה',
    'addExpense.adding': 'מוסיף...',
    'addExpense.back': 'חזור לדשבורד',
  },
  en: {
    'addExpense.title': 'Add New Expense',
    'addExpense.desc': 'Record your new expense',
    'addExpense.amount': 'Amount (₪)',
    'addExpense.date': 'Date',
    'addExpense.category': 'Category',
    'addExpense.description': 'Description',
    'addExpense.add': 'Add Expense',
    'addExpense.adding': 'Adding...',
    'addExpense.back': 'Back to Dashboard',
  },
};

interface LanguageContextType {
  lang: 'he' | 'en';
  setLang: (l: 'he' | 'en') => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useSettings();
  const lang = settings.language as 'he' | 'en';
  const setLang = (l: 'he' | 'en') => setSettings(prev => ({ ...prev, language: l }));
  const t = (key: string) => translations[lang][key] || key;
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
