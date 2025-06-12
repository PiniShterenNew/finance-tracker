import React, { createContext, useContext } from 'react';
import { useSettings } from '@/hooks/useLocalStorage';

const translations = {
  he: {
    // Navbar
    'nav.dashboard': 'דשבורד',
    'nav.addExpense': 'הוסף הוצאה',
    'nav.expenses': 'רשימת הוצאות',
    'nav.settings': 'הגדרות',
    'nav.light': 'בהיר',
    'nav.dark': 'כהה',
    'addExpense.title': 'הוסף הוצאה חדשה',
    'addExpense.desc': 'רשום את ההוצאה החדשה שלך',
    'addExpense.amount': 'סכום (₪)',
    'addExpense.date': 'תאריך',
    'addExpense.category': 'קטגוריה',
    'addExpense.description': 'תיאור',
    'addExpense.header': 'פרטי ההוצאה',
    'addExpense.headerDesc': 'מלא את הפרטים של ההוצאה החדשה',
    'addExpense.selectDate': 'בחר תאריך',
    'addExpense.add': 'הוסף הוצאה',
    'addExpense.adding': 'מוסיף...',
    'addExpense.back': 'חזור לדשבורד',
    'addExpense.success': 'ההוצאה נוספה בהצלחה!',
    'addExpense.error': 'שגיאה בהוספת ההוצאה',
    'addExpense.dateFuture': 'לא ניתן להזין תאריך עתידי',
    'addExpense.missingFields': 'יש להזין את כל הפרטים',
    'addExpense.amountPositive': 'יש להזין סכום גדול מאפס',
    'addExpense.previewTitle': 'תצוגה מקדימה',
    'addExpense.previewDesc': 'איך ההוצאה תיראה',
    'addExpense.previewAmount': 'סכום:',
    'addExpense.previewDate': 'תאריך:',
    'addExpense.previewEmpty': 'מלא את הפרטים לתצוגה מקדימה',
  },
  en: {
    // Navbar
    'nav.dashboard': 'Dashboard',
    'nav.addExpense': 'Add Expense',
    'nav.expenses': 'Expenses',
    'nav.settings': 'Settings',
    'nav.light': 'Light',
    'nav.dark': 'Dark',

    'addExpense.title': 'Add New Expense',
    'addExpense.desc': 'Record your new expense',
    'addExpense.amount': 'Amount (₪)',
    'addExpense.date': 'Date',
    'addExpense.category': 'Category',
    'addExpense.description': 'Description',
    'addExpense.header': 'Expense Details',
    'addExpense.headerDesc': 'Fill in the details for the new expense',
    'addExpense.selectDate': 'Select date',
    'addExpense.add': 'Add Expense',
    'addExpense.adding': 'Adding...',
    'addExpense.back': 'Back to Dashboard',
    'addExpense.success': 'Expense added successfully!',
    'addExpense.error': 'Error adding expense',
    'addExpense.dateFuture': 'Cannot select a future date',
    'addExpense.missingFields': 'Please fill in all fields',
    'addExpense.amountPositive': 'Amount must be greater than zero',
    'addExpense.previewTitle': 'Preview',
    'addExpense.previewDesc': 'How the expense will look',
    'addExpense.previewAmount': 'Amount:',
    'addExpense.previewDate': 'Date:',
    'addExpense.previewEmpty': 'Fill in details to preview',
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
