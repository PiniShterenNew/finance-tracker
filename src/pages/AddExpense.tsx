import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Plus, ArrowRight, Calendar as CalendarIcon } from 'lucide-react';
import { useAppData } from '@/hooks/useAppData';
import type { Expense } from '@/types/expense';
import { useToast } from '@/contexts/ToastContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { cn } from '@/lib/utils';

interface AddExpenseProps {
  onAddExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
}

export function AddExpense({ onAddExpense }: AddExpenseProps) {
  const navigate = useNavigate();

  const { allCategories } = useAppData();
  const { success, error } = useToast();

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!amount || !category || !description) {
      error('יש להזין את כל הפרטים');
      return;
    }

    const numAmount = parseFloat(amount);
    if (numAmount <= 0) {
      error('יש להזין סכום גדול מאפס');
      return;
    }

    // Check if date is in the future
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    if (date > today) {
      error('לא ניתן להזין תאריך עתידי');
      return;
    }

    setIsSubmitting(true);

    try {
      const expense = {
        amount: numAmount,
        category,
        description,
        date: date.toISOString()
      };

      onAddExpense(expense);

      // Reset form
      setAmount('');
      setCategory('');
      setDescription('');
      setDate(new Date());

      success('ההוצאה נוספה בהצלחה!');
      // Navigate to dashboard after successful add
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      error('שגיאה בהוספת ההוצאה');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = allCategories.find(cat => cat.name === category);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">הוסף הוצאה חדשה</h1>
        <p className="text-muted-foreground">רשום את ההוצאה החדשה שלך</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                פרטי ההוצאה
              </CardTitle>
              <CardDescription>
                מלא את הפרטים של ההוצאה החדשה
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">סכום (₪)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  {/* Date */}
                  <div className="space-y-2">
                    <Label>תאריך</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? date.toLocaleDateString('he-IL', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }) : "בחר תאריך"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(selectedDate) => selectedDate && setDate(selectedDate)}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(23, 59, 59, 999);
                            return date > today || date < new Date("2020-01-01");
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">קטגוריה</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="בחר קטגוריה" />
                    </SelectTrigger>
                    <SelectContent>
                      {allCategories.map((cat) => (
                        <SelectItem key={cat.name} value={cat.name}>
                          <div className="flex items-center gap-2">
                            <span>{cat.emoji}</span>
                            <span>{cat.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">תיאור</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="למשל: קפה בבית קפה, דלק לרכב..."
                    rows={3}
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        מוסיף...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        הוסף הוצאה
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/')}
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    חזור לדשבורד
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>תצוגה מקדימה</CardTitle>
              <CardDescription>איך ההוצאה תיראה</CardDescription>
            </CardHeader>
            <CardContent>
              {amount && category && description ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {selectedCategory?.emoji || '💰'}
                    </div>
                    <div>
                      <div className="font-semibold">{description}</div>
                      <div className="text-sm text-muted-foreground">{category}</div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">סכום:</span>
                      <span className="font-bold text-lg">
                        {parseFloat(amount || '0').toLocaleString('he-IL')} ₪
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">תאריך:</span>
                      <span className="text-sm">
                        {date.toLocaleDateString('he-IL', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <div className="text-4xl mb-2">📝</div>
                  <p>מלא את הפרטים לתצוגה מקדימה</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}