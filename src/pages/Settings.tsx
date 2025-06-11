import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings as SettingsIcon, Plus, Trash2, DollarSign, Palette, Save, RefreshCw, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { useUserCategories, useBudgets, useSettings } from '@/hooks/useLocalStorage';
import { CATEGORIES, AVAILABLE_COLORS, AVAILABLE_EMOJIS } from '@/utils/categories';
import { useToast } from '@/contexts/ToastContext';
import { cn } from '@/lib/utils';

export function Settings() {
  const [userCategories, setUserCategories] = useUserCategories();
  const [budgets, setBudgets] = useBudgets();
  const [settings, setSettings] = useSettings();
  const { success, error } = useToast();

  // Form states
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryEmoji, setNewCategoryEmoji] = useState('💰');
  const [newCategoryColor, setNewCategoryColor] = useState('#6b7280');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get all categories (default + user)
  const allCategories = [
    ...CATEGORIES.map(cat => ({ ...cat, isCustom: false })),
    ...userCategories
  ];

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      error('יש להזין שם קטגוריה');
      return;
    }

    // Check if category already exists
    if (allCategories.some(cat => cat.name === newCategoryName.trim())) {
      error('קטגוריה זו כבר קיימת');
      return;
    }

    setIsLoading(true);

    try {
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

      success('קטגוריה נוספה בהצלחה!');
    } catch (err) {
      error('שגיאה בהוספת הקטגוריה');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = (categoryName: string) => {
    setUserCategories(prev => prev.filter(cat => cat.name !== categoryName));

    // Remove budget for this category
    setBudgets(prev => {
      const newBudgets = { ...prev };
      delete newBudgets[categoryName];
      return newBudgets;
    });

    success('קטגוריה נמחקה בהצלחה');
  };

  const handleBudgetChange = (categoryName: string, budget: number) => {
    setBudgets(prev => ({
      ...prev,
      [categoryName]: budget
    }));
  };

  const getBudgetForCategory = (categoryName: string): number => {
    if (budgets[categoryName]) {
      return budgets[categoryName];
    }

    const defaultCategory = CATEGORIES.find(cat => cat.name === categoryName);
    return defaultCategory?.budget || 0;
  };

  const totalBudget = allCategories.reduce((sum, cat) => sum + getBudgetForCategory(cat.name), 0);

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-3xl"></div>
        <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
              <SettingsIcon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                הגדרות
              </h1>
              <p className="text-muted-foreground text-lg">נהל את הקטגוריות, התקציבים וההעדפות שלך</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-4 rounded-xl bg-white/50">
              <div className="text-2xl font-bold text-blue-600">{allCategories.length}</div>
              <div className="text-sm text-muted-foreground">קטגוריות</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/50">
              <div className="text-2xl font-bold text-green-600">{userCategories.length}</div>
              <div className="text-sm text-muted-foreground">מותאמות אישית</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/50">
              <div className="text-2xl font-bold text-purple-600">{totalBudget.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">₪ תקציב כולל</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/50">
              <div className="text-2xl font-bold text-orange-600">{settings.currency}</div>
              <div className="text-sm text-muted-foreground">מטבע</div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="budgets" className="space-y-6" dir="rtl">
        {/* Mobile-optimized TabsList */}
        <div className="md:hidden">
          <TabsList className="grid w-full grid-cols-3 h-16 p-1 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
            <TabsTrigger
              value="budgets"
              className="rounded-lg font-medium text-sm data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300 flex flex-col items-center justify-center gap-1 p-2"
            >
              <DollarSign className="h-5 w-5" />
              <span className="text-xs">תקציבים</span>
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="rounded-lg font-medium text-sm data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300 flex flex-col items-center justify-center gap-1 p-2"
            >
              <Palette className="h-5 w-5" />
              <span className="text-xs">קטגוריות</span>
            </TabsTrigger>
            <TabsTrigger
              value="general"
              className="rounded-lg font-medium text-sm data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300 flex flex-col items-center justify-center gap-1 p-2"
            >
              <SettingsIcon className="h-5 w-5" />
              <span className="text-xs">כללי</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Desktop TabsList */}
        <div className="hidden md:block">
          <TabsList className="grid w-full grid-cols-3 h-14 p-1 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
            <TabsTrigger
              value="budgets"
              className="rounded-lg font-medium data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              תקציבים
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="rounded-lg font-medium data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300"
            >
              <Palette className="h-4 w-4 mr-2" />
              קטגוריות
            </TabsTrigger>
            <TabsTrigger
              value="general"
              className="rounded-lg font-medium data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300"
            >
              <SettingsIcon className="h-4 w-4 mr-2" />
              כללי
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Enhanced Budgets Tab */}
        <TabsContent value="budgets" className="space-y-6">
          {/* Monthly Budget Card */}
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 text-green-600">
                  <DollarSign className="h-5 w-5" />
                </div>
                תקציב חודשי כללי
              </CardTitle>
              <CardDescription className="text-base">הגדר את התקציב הכולל שלך לחודש</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <Label htmlFor="monthly-budget" className="min-w-fit text-base font-medium">תקציב חודשי:</Label>
                <div className="flex items-center gap-3 flex-1">
                  <Input
                    id="monthly-budget"
                    type="number"
                    value={settings.monthlyBudget}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      monthlyBudget: Number(e.target.value)
                    }))}
                    className="max-w-xs h-12 text-lg border-2 focus:border-green-500"
                    placeholder="5000"
                  />
                  <span className="text-muted-foreground font-medium text-lg">₪</span>
                </div>
              </div>

              {/* Budget Progress Indicator */}
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">סה"כ תקציבי קטגוריות</span>
                  <span className="text-sm font-bold">{totalBudget.toLocaleString()} ₪</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((totalBudget / settings.monthlyBudget) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {((totalBudget / settings.monthlyBudget) * 100).toFixed(1)}% מהתקציב החודשי
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Budgets */}
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>תקציבים לפי קטגוריה</span>
                <Badge variant="secondary" className="px-3 py-1">{allCategories.length} קטגוריות</Badge>
              </CardTitle>
              <CardDescription>הגדר תקציב ספציפי לכל קטגוריה</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {allCategories.map((category) => (
                <div key={category.name} className="group p-4 border-2 border-gray-100 rounded-xl hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-300">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className="w-4 h-4 rounded-full ring-2 ring-white shadow-md"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-2xl">{category.emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-lg">{category.name}</span>
                          {category.isCustom && (
                            <Badge variant="secondary" className="px-2 py-0.5 text-xs">מותאם אישית</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        value={getBudgetForCategory(category.name)}
                        onChange={(e) => handleBudgetChange(category.name, Number(e.target.value))}
                        className="w-28 h-10 text-center border-2 focus:border-blue-500"
                        placeholder="0"
                      />
                      <span className="text-muted-foreground font-medium">₪</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enhanced Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                  <Palette className="h-5 w-5" />
                </div>
                ניהול קטגוריות
              </CardTitle>
              <CardDescription>הוסף, ערוך או מחק קטגוריות מותאמות אישית</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h3 className="font-semibold text-xl">הקטגוריות שלך</h3>
                  <p className="text-muted-foreground">נהל את הקטגוריות המותאמות אישית</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="h-10 md:h-12 px-4 md:px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg text-sm md:text-base">
                      <Plus className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                      <span className="hidden sm:inline">הוסף קטגוריה</span>
                      <span className="sm:hidden">הוסף</span>
                    </Button>
                  </DialogTrigger>




                  {/* Mobile optimized dialog */}
                  <DialogContent className=" w-full max-h-full overflow-y-auto p-4">
                    <DialogHeader className="pb-4 flex flex-col items-center">
                      <DialogTitle className="flex items-center gap-2 text-lg">
                        <Sparkles className="h-5 w-5 text-purple-500" />
                        הוסף קטגוריה
                      </DialogTitle>
                      <DialogDescription className="text-sm">
                        צור קטגוריה מותאמת אישית
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="category-name-mobile" className="text-sm font-medium">שם הקטגוריה</Label>
                        <Input
                          id="category-name-mobile"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="למשל: חיות מחמד"
                          className="mt-1 h-11 text-base border-2"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium">בחר אמוג'י</Label>
                        <div className="grid grid-cols-6 md:grid-cols-8 gap-2 mt-2">
                          {AVAILABLE_EMOJIS.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => setNewCategoryEmoji(emoji)}
                              className={cn(
                                "p-2 text-lg flex items-center justify-center rounded-lg border-2 transition-all duration-200",
                                newCategoryEmoji === emoji
                                  ? 'border-purple-500 bg-purple-50 shadow-md'
                                  : 'border-gray-200'
                              )}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">בחר צבע</Label>
                        <div className="grid grid-cols-6 gap-2 mt-2">
                          {AVAILABLE_COLORS.map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setNewCategoryColor(color)}
                              className={cn(
                                "w-10 h-10 rounded-lg border-3 transition-all duration-200",
                                newCategoryColor === color
                                  ? 'border-gray-800 shadow-md scale-105'
                                  : 'border-gray-200'
                              )}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Compact Preview */}
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <Label className="text-sm font-medium">תצוגה מקדימה</Label>
                        <div className="flex items-center gap-2 mt-2 p-2 bg-white rounded-lg border">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: newCategoryColor }}
                          />
                          <span className="text-base">{newCategoryEmoji}</span>
                          <span className="font-medium text-sm truncate flex-1">{newCategoryName || 'שם הקטגוריה'}</span>
                        </div>
                      </div>
                    </div>

                    <DialogFooter className="gap-2 pt-4">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="h-10 px-4 flex-1 text-sm">
                        ביטול
                      </Button>
                      <Button
                        onClick={handleAddCategory}
                        disabled={isLoading || !newCategoryName.trim()}
                        className="h-10 px-4 bg-gradient-to-r from-purple-500 to-pink-500 flex-1 text-sm"
                      >
                        {isLoading ? (
                          <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-1" />
                        )}
                        הוסף
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-3">
                {allCategories.map((category) => (
                  <div key={category.name} className="group p-4 border-2 border-gray-100 rounded-xl hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-5 h-5 rounded-full ring-2 ring-white shadow-md"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-2xl">{category.emoji}</span>
                        <div>
                          <span className="font-medium text-lg">{category.name}</span>
                          <div className="flex items-center gap-2 mt-1">
                            {category.isCustom ? (
                              <Badge variant="secondary" className="px-2 py-0.5 text-xs">מותאם אישית</Badge>
                            ) : (
                              <Badge variant="outline" className="px-2 py-0.5 text-xs">ברירת מחדל</Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {category.isCustom && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.name)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-10 w-10 opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enhanced General Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  <SettingsIcon className="h-5 w-5" />
                </div>
                הגדרות כלליות
              </CardTitle>
              <CardDescription>העדפות תצוגה ושפה</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border-2 border-gray-100 rounded-xl">
                <div className="flex-1">
                  <Label className="text-base font-medium">מטבע</Label>
                  <p className="text-muted-foreground mt-1">המטבע המוצג באפליקציה</p>
                </div>
                <Select
                  value={settings.currency}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger className="w-40 h-12 border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="₪">₪ (שקל)</SelectItem>
                    <SelectItem value="$">$ (דולר)</SelectItem>
                    <SelectItem value="€">€ (יורו)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border-2 border-gray-100 rounded-xl">
                <div className="flex-1">
                  <Label className="text-base font-medium">שפה</Label>
                  <p className="text-muted-foreground mt-1">שפת הממשק</p>
                </div>
                <Select
                  value={settings.language}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}
                >
                  <SelectTrigger className="w-40 h-12 border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="he">עברית</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Settings Summary */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="font-medium text-lg">סיכום הגדרות</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">מטבע</div>
                    <div className="font-medium">{settings.currency}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">שפה</div>
                    <div className="font-medium">{settings.language === 'he' ? 'עברית' : 'English'}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">תקציב חודשי</div>
                    <div className="font-medium">{settings.monthlyBudget.toLocaleString()} {settings.currency}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">קטגוריות</div>
                    <div className="font-medium">{allCategories.length} קטגוריות</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}