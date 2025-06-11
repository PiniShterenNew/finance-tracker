import { Link, useLocation } from 'react-router-dom';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { BarChart3, Plus, List, Home, Settings, Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const location = useLocation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;

  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };

  const navItems = [
    { path: '/', icon: Home, label: 'דשבורד' },
    { path: '/add', icon: Plus, label: 'הוסף הוצאה' },
    { path: '/expenses', icon: List, label: 'רשימת הוצאות' },
    { path: '/settings', icon: Settings, label: 'הגדרות' }
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo - Enhanced */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group transition-all duration-300 hover:scale-105"
          >
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
              <BarChart3 className="h-6 w-6 md:h-7 md:w-7" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-xl md:text-2xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                מעקב הוצאות
              </span>
              <div className="text-xs text-muted-foreground font-medium">
                נהל את הכספים שלך
              </div>
            </div>
          </Link>

          {/* Desktop Navigation - Enhanced */}
          <NavigationMenu className='hidden md:flex '>
            <NavigationMenuList className="gap-2 flex-row-reverse">
              {navItems.map(({ path, icon: Icon, label }) => (
                <NavigationMenuItem key={path}>
                  <Button
                    variant={isActive(path) ? 'default' : 'ghost'}
                    size="sm"
                    asChild
                    className={cn(
                      "h-11 px-4 rounded-xl font-medium transition-all duration-300",
                      isActive(path) 
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl" 
                        : "hover:bg-gray-100 hover:scale-105"
                    )}
                  >
                    <Link to={path} className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span className="hidden lg:inline">{label}</span>
                    </Link>
                  </Button>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Menu - Enhanced */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="md:hidden h-11 w-11 rounded-xl hover:bg-gray-100 transition-all duration-300"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">תפריט</span>
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-80 p-0 border-none bg-white/95 backdrop-blur-xl"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-bold text-lg">מעקב הוצאות</span>
                    <div className="text-xs text-muted-foreground">נהל את הכספים שלך</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSheetOpen(false)}
                  className="h-9 w-9 rounded-lg"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile Navigation */}
              <div className="flex flex-col gap-2 p-6">
                {navItems.map(({ path, icon: Icon, label }) => (
                  <Button
                    key={path}
                    variant={isActive(path) ? 'default' : 'ghost'}
                    size="lg"
                    asChild
                    className={cn(
                      "justify-start h-14 rounded-xl font-medium transition-all duration-300",
                      isActive(path) 
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg" 
                        : "hover:bg-gray-100 hover:translate-x-1"
                    )}
                    onClick={handleLinkClick}
                  >
                    <Link to={path} className="flex items-center gap-4">
                      <div className={cn(
                        "p-2 rounded-lg transition-all duration-300",
                        isActive(path) ? "bg-white/20" : "bg-gray-100"
                      )}>
                        <Icon className={cn(
                          "h-5 w-5 transition-all duration-300",
                          isActive(path) ? "text-white" : "text-gray-600"
                        )} />
                      </div>
                      <span className="text-base">{label}</span>
                    </Link>
                  </Button>
                ))}
              </div>

              {/* Mobile Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100 bg-gray-50/50">
                <div className="text-center text-sm text-muted-foreground">
                  <div className="font-medium">גרסה 1.0</div>
                  <div className="text-xs">נבנה עם ❤️</div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}