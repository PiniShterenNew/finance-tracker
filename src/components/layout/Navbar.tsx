import { Link, useLocation } from 'react-router-dom';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { BarChart3, Plus, List, Home, Settings, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

export function Navbar() {
  const location = useLocation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;

  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            <span className="font-bold text-lg">מעקב הוצאות</span>
          </Link>

          {/* Navigation */}
          <NavigationMenu className='hidden md:flex'>
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <Button
                  variant={isActive('/') ? 'default' : 'ghost'}
                  size="sm"
                  asChild
                >
                  <Link to="/" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    דשבורד
                  </Link>
                </Button>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Button
                  variant={isActive('/add') ? 'default' : 'ghost'}
                  size="sm"
                  asChild
                >
                  <Link to="/add" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    הוסף הוצאה
                  </Link>
                </Button>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Button
                  variant={isActive('/expenses') ? 'default' : 'ghost'}
                  size="sm"
                  asChild
                >
                  <Link to="/expenses" className="flex items-center gap-2">
                    <List className="h-4 w-4" />
                    רשימת הוצאות
                  </Link>
                </Button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Button
                  variant={isActive('/settings') ? 'default' : 'ghost'}
                  size="sm"
                  asChild
                >
                  <Link to="/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    הגדרות
                  </Link>
                </Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          {/* naviagation mobile */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-4 mt-8">
                <Button
                  variant={isActive('/') ? 'default' : 'ghost'}
                  size="sm"
                  asChild
                  className="justify-start"
                  onClick={handleLinkClick}
                >
                  <Link to="/" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    דשבורד
                  </Link>
                </Button>

                <Button
                  variant={isActive('/add') ? 'default' : 'ghost'}
                  size="sm"
                  asChild
                  className="justify-start"
                  onClick={handleLinkClick}
                >
                  <Link to="/add" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    הוסף הוצאה
                  </Link>
                </Button>

                <Button
                  variant={isActive('/expenses') ? 'default' : 'ghost'}
                  size="sm"
                  asChild
                  className="justify-start"
                  onClick={handleLinkClick}
                >
                  <Link to="/expenses" className="flex items-center gap-2">
                    <List className="h-4 w-4" />
                    רשימת הוצאות
                  </Link>
                </Button>

                <Button
                  variant={isActive('/settings') ? 'default' : 'ghost'}
                  size="sm"
                  asChild
                  className="justify-start"
                  onClick={handleLinkClick}
                >
                  <Link to="/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    הגדרות
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}