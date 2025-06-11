# 💰 Finance Tracker

A modern, mobile-first personal expense tracking application built with React, TypeScript, and Tailwind CSS.

## ✨ Features

- **📊 Interactive Dashboard** - Comprehensive overview with charts and statistics
- **📝 Smart Expense Management** - Add, edit, and categorize expenses with ease
- **🎯 Budget Tracking** - Set and monitor budgets per category
- **📱 Mobile Optimized** - Perfect responsive design for all devices
- **🎨 Custom Categories** - Create personalized categories with emojis and colors
- **📈 Data Visualization** - Pie charts, trend analysis, and budget progress
- **🔍 Advanced Filtering** - Search and filter expenses by date, category, or amount
- **💾 Local Storage** - All data stored securely in your browser

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/finance-tracker.git

# Navigate to project directory
cd finance-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🛠️ Tech Stack

### Core Technologies
- **React 19** - Modern UI library with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router Dom** - Client-side routing

### UI Components
- **Radix UI** - Accessible, unstyled UI primitives
- **Shadcn/ui** - Beautiful, reusable components
- **Lucide React** - Modern icon library
- **Recharts** - Interactive chart library
- **Vaul** - Mobile-friendly drawer component

### State Management
- **React Hooks** - Built-in state management
- **Local Storage** - Persistent data storage
- **Context API** - Global state for notifications

## 📦 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Navbar, Footer)
│   └── ui/             # Base UI components (Button, Card, etc.)
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── pages/              # Main application pages
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── styles/             # Global styles and CSS
```

## 🎯 Key Features

### Dashboard
- Real-time expense overview
- Interactive pie charts for category breakdown
- Daily spending trends
- Budget progress indicators
- Period selection (monthly, quarterly, yearly)

### Expense Management
- Quick expense entry with validation
- Smart date picker (native on mobile, calendar on desktop)
- Category selection with visual indicators
- Live preview before saving
- Bulk operations and filtering

### Category System
- 6 default categories with budgets
- Custom category creation
- 16+ emoji options
- 12+ color themes
- Easy category management

### Budget Tracking
- Per-category budget setting
- Visual progress indicators
- Overspending alerts
- Monthly budget overview

## 📱 Mobile Experience

- **Touch-Optimized Interface** - Large touch targets and smooth gestures
- **Native Input Support** - Platform-specific date pickers and keyboards
- **Responsive Design** - Adapts perfectly to all screen sizes
- **Optimized Performance** - Fast loading and smooth animations
- **Offline Capable** - Works without internet connection

## 🎨 Design Philosophy

- **Mobile-First** - Designed for mobile, enhanced for desktop
- **Accessibility** - WCAG compliant with proper ARIA labels
- **Modern Aesthetics** - Glass morphism, gradients, and smooth animations
- **Intuitive UX** - Clear navigation and user-friendly interactions

## 🔧 Configuration

### Environment Variables

```bash
# Optional: Custom development server settings
VITE_PORT=5173
VITE_HOST=localhost
```

### Customization

The app supports various customizations:
- **Currency Settings** - ILS (₪), USD ($), EUR (€)
- **Language** - Hebrew, English
- **Color Themes** - 12 predefined colors for categories
- **Budget Periods** - Monthly, quarterly, yearly tracking

## 🏗️ Architecture

### Component Architecture
- **Atomic Design** - Reusable components built from smallest to largest
- **Compound Components** - Complex UI patterns with flexible APIs
- **Custom Hooks** - Business logic separation and reusability

### Data Flow
- **Local State** - Component-level state with React hooks
- **Persistent Storage** - Browser localStorage with custom hooks
- **Type Safety** - Full TypeScript coverage for reliability

### Performance
- **Code Splitting** - Lazy loading for optimal bundle size
- **Memoization** - React.memo and useMemo for expensive operations
- **Optimistic Updates** - Immediate UI feedback

---

<div align="center">
  <strong>Built with ❤️ using React & TypeScript</strong>
</div>
