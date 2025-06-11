import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Search, Filter, Calendar, Tag } from 'lucide-react';
import type { Expense } from '@/types/expense';
import { getCategoryByName, CATEGORIES } from '@/utils/categories';

interface ExpensesListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

export function ExpensesList({ expenses, onDeleteExpense }: ExpensesListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort expenses
  const filteredAndSortedExpenses = useMemo(() => {
    let filtered = expenses.filter(expense => {
      const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           expense.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || expense.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [expenses, searchTerm, selectedCategory, sortBy, sortOrder]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const totalFiltered = filteredAndSortedExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (expenses.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">רשימת הוצאות</h1>
          <p className="text-muted-foreground">כל ההוצאות שלך במקום אחד</p>
        </div>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <CardTitle className="mb-2">עדיין לא הוספת הוצאות</CardTitle>
            <CardDescription>
              התחל בהוספת ההוצאה הראשונה שלך
            </CardDescription>
            <Button className="mt-4" asChild>
              <a href="/add">הוסף הוצאה ראשונה</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">רשימת הוצאות</h1>
        <p className="text-muted-foreground">
          {expenses.length} הוצאות • סך הכל {formatAmount(totalFiltered)}
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            סינון וחיפוש
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חפש לפי תיאור או קטגוריה..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="כל הקטגוריות" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">כל הקטגוריות</SelectItem>
                {CATEGORIES.map((cat, index) => (
                  <SelectItem key={index} value={cat.name}>
                    <div className="flex items-center gap-2">
                      <span>{cat.emoji}</span>
                      <span>{cat.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={(value: 'date' | 'amount' | 'category') => setSortBy(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">מיון לפי תאריך</SelectItem>
                <SelectItem value="amount">מיון לפי סכום</SelectItem>
                <SelectItem value="category">מיון לפי קטגוריה</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Order */}
            <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">יורד</SelectItem>
                <SelectItem value="asc">עולה</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active filters summary */}
          {(searchTerm || selectedCategory) && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">מסננים פעילים:</span>
              {searchTerm && (
                <Badge variant="secondary" className="gap-1">
                  <Search className="h-3 w-3" />
                  {searchTerm}
                </Badge>
              )}
              {selectedCategory && (
                <Badge variant="secondary" className="gap-1">
                  <Tag className="h-3 w-3" />
                  {selectedCategory}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
                className="h-6 px-2 text-xs"
              >
                נקה הכל
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Summary */}
      {filteredAndSortedExpenses.length !== expenses.length && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                מציג {filteredAndSortedExpenses.length} מתוך {expenses.length} הוצאות
              </span>
              <span className="font-medium">
                סך הכל מסונן: {formatAmount(totalFiltered)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expenses List */}
      <div className="space-y-4">
        {filteredAndSortedExpenses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <CardTitle className="mb-2">לא נמצאו תוצאות</CardTitle>
              <CardDescription>
                נסה לשנות את הסינון או החיפוש
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedExpenses.map((expense) => {
            const category = getCategoryByName(expense.category);
            
            return (
              <Card key={expense.id} className="transition-all hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    {/* Left side - Expense details */}
                    <div className="flex items-center gap-4 flex-1">
                      <div 
                        className="w-3 h-full rounded-full"
                        style={{ backgroundColor: category?.color || '#6b7280' }}
                      />
                      
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{category?.emoji || '💰'}</span>
                        <div>
                          <h3 className="font-semibold">{expense.description}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(expense.date)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              {expense.category}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Amount and actions */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xl font-bold">
                          {formatAmount(expense.amount)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(expense.createdAt)}
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteExpense(expense.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}