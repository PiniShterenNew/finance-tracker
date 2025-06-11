import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Search, Filter, Calendar, Tag, ChevronDown, X } from 'lucide-react';
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // זיהוי מכשיר מובייל
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

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
      year: isMobile ? '2-digit' : 'numeric'
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

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setIsFilterOpen(false);
  };

  const hasActiveFilters = searchTerm || selectedCategory;

  if (expenses.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">רשימת הוצאות</h1>
          <p className="text-muted-foreground">כל ההוצאות שלך במקום אחד</p>
        </div>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <CardTitle className="mb-2 text-center">עדיין לא הוספת הוצאות</CardTitle>
            <CardDescription className="text-center">
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
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">רשימת הוצאות</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          {expenses.length} הוצאות • סך הכל {formatAmount(totalFiltered)}
        </p>
      </div>

      {/* Mobile Search Bar */}
      {isMobile && (
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="חפש הוצאה..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Mobile Filter Toggle */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              סינון
              <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </Button>
            
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                נקה
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Desktop Filters */}
      {!isMobile && (
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
            {hasActiveFilters && (
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
                  onClick={clearFilters}
                  className="h-6 px-2 text-xs"
                >
                  נקה הכל
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Mobile Filters Dropdown */}
      {isMobile && isFilterOpen && (
        <Card>
          <CardContent className="p-4 space-y-4">
            {/* Category Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">קטגוריה</label>
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
            </div>

            {/* Sort Options */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-2 block">מיון לפי</label>
                <Select value={sortBy} onValueChange={(value: 'date' | 'amount' | 'category') => setSortBy(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">תאריך</SelectItem>
                    <SelectItem value="amount">סכום</SelectItem>
                    <SelectItem value="category">קטגוריה</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">סדר</label>
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
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      {filteredAndSortedExpenses.length !== expenses.length && (
        <Card>
          <CardContent className="py-3 md:py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                מציג {filteredAndSortedExpenses.length} מתוך {expenses.length}
              </span>
              <span className="font-medium">
                {formatAmount(totalFiltered)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expenses List */}
      <div className="space-y-3 md:space-y-4">
        {filteredAndSortedExpenses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <CardTitle className="mb-2 text-center">לא נמצאו תוצאות</CardTitle>
              <CardDescription className="text-center">
                נסה לשנות את הסינון או החיפוש
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedExpenses.map((expense) => {
            const category = getCategoryByName(expense.category);
            
            return (
              <Card key={expense.id} className="transition-all hover:shadow-md">
                <CardContent className={`p-3 md:p-4 ${isMobile ? 'space-y-3' : ''}`}>
                  {isMobile ? (
                    // Mobile Layout - Stacked
                    <div className="space-y-3">
                      {/* Top Row - Emoji, Description, Amount */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-xl">{category?.emoji || '💰'}</span>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{expense.description}</h3>
                          </div>
                        </div>
                        <div className="text-lg font-bold shrink-0">
                          {formatAmount(expense.amount)}
                        </div>
                      </div>

                      {/* Bottom Row - Category, Date, Delete */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            <span className="truncate">{expense.category}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(expense.date)}
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteExpense(expense.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Desktop Layout - Side by Side
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
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}