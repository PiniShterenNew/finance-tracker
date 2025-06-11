import { Navbar } from './Navbar';
import { ToastContainer } from '@/components/ui/ToastContainer';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8 lg:py-12 animate-in fade-in duration-500">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
      {/* Enhanced Footer */}
      <footer className="border-t border-white/20 bg-white/40 backdrop-blur-sm mt-16 md:mt-24">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Footer Brand */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-gray-900">מעקב הוצאות</div>
                <div className="text-sm text-gray-600">נהל את הכספים שלך בפשטות</div>
              </div>
            </div>
            
            {/* Footer Stats/Info */}
            <div className="flex flex-col md:flex-row items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>מערכת פעילה</span>
              </div>
              
              <div className="flex items-center gap-4">
                <span>גרסה 1.0.0</span>
                <span className="hidden md:inline">•</span>
                <span>נבנה עם ❤️ ו-React</span>
              </div>
            </div>
            
            {/* Footer Links */}
            <div className="flex items-center gap-4 text-sm">
              <button className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
                עזרה
              </button>
              <span className="text-gray-300">•</span>
              <button className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
                פרטיות
              </button>
              <span className="text-gray-300">•</span>
              <button className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
                תמיכה
              </button>
            </div>
          </div>
          
          {/* Bottom Border */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center text-xs text-gray-500">
              © 2024 מעקב הוצאות. כל הזכויות שמורות. 
              <span className="hidden md:inline mx-2">•</span>
              <span className="block md:inline mt-1 md:mt-0">
                הנתונים שלך נשמרים באופן מקומי במכשיר
              </span>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Toast Container with improved positioning */}
      <ToastContainer />
      
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}