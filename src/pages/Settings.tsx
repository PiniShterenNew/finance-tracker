import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings as SettingsIcon, Plus, Edit, Trash2, DollarSign, Palette } from 'lucide-react';
import { useUserCategories, useBudgets, useSettings } from '@/hooks/useLocalStorage';
import { CATEGORIES, AVAILABLE_COLORS, AVAILABLE_EMOJIS } from '@/utils/categories';

export function Settings() {
  const [userCategories, setUserCategories] = useUserCategories();
  const [budgets, setBudgets] = useBudgets();
  const [settings, setSettings] = useSettings();
  
  // Form states
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryEmoji, setNewCategoryEmoji] = useState('💰');
  const [newCategoryColor, setNewCategoryColor] = useState('#6b7280');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Get all categories (default + user)
  const allCategories = [
    ...CATEGORIES.map(cat => ({ ...cat, isCustom: false })),
    ...userCategories
  ];

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCategory = {
      name: newCategoryName.trim(),
      emoji: newCategoryEmoji,
      color: newCategoryColor,
      isCustom: true
    };

    setUserCategories(prev => [...prev, newCategory]);
    
    // Reset form
    setNewCategoryName('');
    setNewCategoryEmoji('💰');
    setNewCategoryColor('#6b7280');
    setIsDialogOpen(false);
  };

  const handleDeleteCategory = (categoryName: string) => {
    setUserCategories(prev => prev.filter(cat => cat.name !== categoryName));
    
    // Remove budget for this category
    setBudgets(prev => {
      const newBudgets = { ...prev };
      delete newBudgets[categoryName];
      return newBudgets;
    });
  };

  const handleBudgetChange = (categoryName: string, budget: number) => {
    setBudgets(prev => ({
      ...prev,
      [categoryName]: budget
    }));
  };

  const getBudgetForCategory = (categoryName: string): number => {
    // Check user budget first
    if (budgets[categoryName]) {
      return budgets[categoryName];
    }
    
    // Fallback to default budget
    const defaultCategory = CATEGORIES.find(cat => cat.name === categoryName);
    return defaultCategory?.budget || 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">הגדרות</h1>
        <p className="text-muted-foreground">נהל את הקטגוריות, התקציבים וההעדפות שלך</p>
      </div>

      <Tabs defaultValue="budgets" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="budgets">תקציבים</TabsTrigger>
          <TabsTrigger value="categories">קטגוריות</TabsTrigger>
          <TabsTrigger value="general">כללי</TabsTrigger>
        </TabsList>

        {/* Budgets Tab */}
        <TabsContent value="budgets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                תקציב חודשי כללי
              </CardTitle>
              <CardDescription>הגדר את התקציב הכולל שלך לחודש</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Label htmlFor="monthly-budget" className="min-w-fit">תקציב חודשי:</Label>
                <Input
                  id="monthly-budget"
                  type="number"
                  value={settings.monthlyBudget}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    monthlyBudget: Number(e.target.value)
                  }))}
                  className="max-w-xs"
                />
                <span className="text-muted-foreground">₪</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>תקציבים לפי קטגוריה</CardTitle>
              <CardDescription>הגדר תקציב ספציפי לכל קטגוריה</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {allCategories.map((category) => (
                <div key={category.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{category.emoji}</span>
                    <div>
                      <span className="font-medium">{category.name}</span>
                      {category.isCustom && (
                        <Badge variant="secondary" className="mr-2">מותאם אישית</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={getBudgetForCategory(category.name)}
                      onChange={(e) => handleBudgetChange(category.name, Number(e.target.value))}
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground">₪</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ניהול קטגוריות</CardTitle>
              <CardDescription>הוסף, ערוך או מחק קטגוריות מותאמות אישית</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">הקטגוריות שלך</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      הוסף קטגוריה
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>הוסף קטגוריה חדשה</DialogTitle>
                      <DialogDescription>
                        צור קטגוריה מותאמת אישית להוצאות שלך
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="category-name">שם הקטגוריה</Label>
                        <Input
                          id="category-name"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="למשל: חיות מחמד"
                        />
                      </div>
                      
                      <div>
                        <Label>אמוג'י</Label>
                        <div className="grid grid-cols-8 gap-2 mt-2">
                          {AVAILABLE_EMOJIS.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => setNewCategoryEmoji(emoji)}
                              className={`p-2 text-xl rounded border ${
                                newCategoryEmoji === emoji ? 'border-primary bg-primary/10' : 'border-border'
                              }`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label>צבע</Label>
                        <div className="grid grid-cols-6 gap-2 mt-2">
                          {AVAILABLE_COLORS.map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setNewCategoryColor(color)}
                              className={`w-8 h-8 rounded border-2 ${
                                newCategoryColor === color ? 'border-foreground' : 'border-border'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        ביטול
                      </Button>
                      <Button onClick={handleAddCategory}>
                        הוסף קטגוריה
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-3">
                {allCategories.map((category) => (
                  <div key={category.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-xl">{category.emoji}</span>
                      <span className="font-medium">{category.name}</span>
                      {category.isCustom ? (
                        <Badge variant="secondary">מותאם אישית</Badge>
                      ) : (
                        <Badge variant="outline">ברירת מחדל</Badge>
                      )}
                    </div>
                    
                    {category.isCustom && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.name)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                הגדרות כלליות
              </CardTitle>
              <CardDescription>העדפות תצוגה ושפה</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>מטבע</Label>
                  <p className="text-sm text-muted-foreground">המטבע המוצג באפליקציה</p>
                </div>
                <Select 
                  value={settings.currency} 
                  onValueChange={(value) => setSettings(prev => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="₪">₪ (שקל)</SelectItem>
                    <SelectItem value="$">$ (דולר)</SelectItem>
                    <SelectItem value="€">€ (יורו)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>שפה</Label>
                  <p className="text-sm text-muted-foreground">שפת הממשק</p>
                </div>
                <Select 
                  value={settings.language} 
                  onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="he">עברית</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}