import { Navbar } from './Navbar';
import { ToastContainer } from '@/components/ui/ToastContainer';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 animate-in fade-in duration-300">
        {children}
      </main>
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground text-sm">
          <p>נבנה עם ❤️ בעזרת React + TypeScript + shadcn/ui</p>
        </div>
      </footer>
      <ToastContainer />
    </div>
  );
}