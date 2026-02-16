# 💰 React + Supabase Real-time Financial Tracker

A fully-featured financial management application built with **React**, **Supabase**, and **Tailwind CSS v4**. Features real-time data synchronization across multiple browser tabs/devices, authentication, and a modern dark mode UI.

![Project Status](https://img.shields.io/badge/status-production--ready-green)
![React](https://img.shields.io/badge/React-18.3-blue)
![Supabase](https://img.shields.io/badge/Supabase-Realtime-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-cyan)

## 🌐 Live Demo

**🚀 [View Live Demo](https://react-supabase-realtime.vercel.app/)**

Try out the application with full real-time synchronization! 

**Demo Credentials:**
- **Email:** `supabaseuser@yopmail.com`
- **Password:** `User@123`

> 💡 **Note:** Demo credentials are intentionally public for testing purposes. Data may be reset periodically.

---

## 🎥 Video Preview

Watch the application in action with real-time synchronization across multiple browser tabs:

[![Video Preview](https://img.shields.io/badge/▶️_Watch_Demo-purple?style=for-the-badge)](https://tinyurl.com/2bc3mwzy)

**Click above to watch:** Real-time transaction updates, multi-tab sync, and all features demonstrated!

---

## ✨ Features

### 🔐 Authentication
- **Email/Password Registration & Login**
- **Email Verification Required**
- **Protected Routes** with automatic redirect
- **Session Management** with proper cleanup

### 💸 Transaction Management
- ➕ Add/Edit/Delete transactions
- 📊 Real-time income/expense tracking
- 📈 Automatic balance calculation
- 🔄 **Live sync across all browser tabs**

### 🏷️ Category Management
- 🎨 Custom color picker (8 preset colors)
- 😀 Emoji icon support
- 🔀 Income/Expense/Both types
- 🔄 **Real-time updates**

### 💰 Budget Management
- 📅 Period-based budgets (Daily/Weekly/Monthly/Yearly)
- 📊 Active/Ended budget tracking
- 📈 Total budget amount calculation
- 🔄 **Real-time synchronization**

### 🎨 UI/UX
- 🌓 **Dark Mode Support**
- 📱 **Fully Responsive** (Mobile, Tablet, Desktop)
- 🎯 Modern gradient design
- 🔔 Toast notifications for all actions
- ⚡ Smooth transitions and animations

### 🔒 Security
- 🛡️ **Row Level Security (RLS)** on all tables
- 👤 User-specific data isolation
- 🔐 Protected API routes
- ✅ Email verification enforcement

---

## 🚀 Quick Start

See **[QUICKSTART.md](./QUICKSTART.md)** for detailed setup instructions and deployment guide.

### Prerequisites
- Node.js 18+ and pnpm
- Supabase account ([supabase.com](https://supabase.com))

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd react-supabase-realtime-interaction

# Install dependencies
pnpm install

# Configure environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Run database migrations
# (See QUICKSTART.md for SQL setup)

# Start development server
pnpm run dev
```

---

## 🏗️ Project Structure

```
react-supabase-realtime-interaction/
├── src/
│   ├── components/
│   │   ├── budgets/              # Budget components
│   │   │   ├── BudgetStatsCards.jsx
│   │   │   ├── BudgetList.jsx
│   │   │   ├── BudgetListItem.jsx
│   │   │   └── BudgetCreateEdit.jsx
│   │   ├── categories/           # Category components
│   │   │   ├── CategoryStatsCards.jsx
│   │   │   ├── CategoryGrid.jsx
│   │   │   ├── CategoryCard.jsx
│   │   │   └── CategoryCreateEdit.jsx
│   │   ├── transactions/         # Transaction components
│   │   │   ├── TransactionStatsCards.jsx
│   │   │   ├── TransactionList.jsx
│   │   │   ├── TransactionListItem.jsx
│   │   │   └── TransactionCreateEdit.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   └── Layout.jsx
│   ├── pages/
│   │   ├── Budgets.jsx
│   │   ├── Categories.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Transactions.jsx
│   ├── App.jsx                   # Main app with routing
│   ├── AuthContext.jsx           # Authentication context
│   ├── ProtectedRoute.jsx        # Route protection
│   ├── supabaseClient.js         # Supabase configuration
│   ├── main.jsx                  # App entry point
│   └── index.css                 # Tailwind imports
├── supabase-schema.sql           # Database schema & RLS
├── supabase-realtime-fix.sql     # Realtime configuration
├── .env.example                  # Environment template
└── package.json
```

---

## 🔧 Technology Stack

| Technology | Purpose |
|-----------|---------|
| **React 18.3** | UI Framework |
| **Vite 6.2** | Build tool & dev server |
| **Supabase** | Backend (Auth, Database, Realtime) |
| **Tailwind CSS v4** | Styling framework |
| **React Router v7** | Client-side routing |
| **React Toastify** | Toast notifications |
| **pnpm** | Package manager |

---

## 🗄️ Database Schema

### Tables

#### `transactions`
- Stores all financial transactions (income/expense)
- Fields: `id`, `user_id`, `amount`, `description`, `category`, `type`, `date`

#### `categories`
- Stores user-defined categories
- Fields: `id`, `user_id`, `name`, `color`, `icon`, `type`

#### `budgets`
- Stores budget plans
- Fields: `id`, `user_id`, `category`, `amount`, `period`, `start_date`, `end_date`

### Security Features
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ User-specific policies (SELECT, INSERT, UPDATE, DELETE)
- ✅ `REPLICA IDENTITY FULL` for real-time DELETE events

---

## 🔄 Real-time Implementation

### How It Works

1. **Subscription Setup**: Each page subscribes to real-time changes on mount
2. **Event Handling**: Listens for INSERT, UPDATE, DELETE events
3. **State Updates**: Automatically updates React state when changes occur
4. **Cleanup**: Properly removes channels on component unmount

### Key Features
- ✅ Multi-tab synchronization
- ✅ User-specific filtering (`user_id=eq.${userId}`)
- ✅ Automatic reconnection handling
- ✅ Console logging for debugging

---

## 🎯 Component Architecture

All CRUD pages follow the same modular structure:

```
Page Component (Main)
├── StatsCards Component (Stats display)
├── CreateEdit Component (Form with submit/reset)
└── List/Grid Component (Display)
    └── ListItem/Card Component (Individual items)
```

**Benefits:**
- 📦 Reusable components
- 🔧 Easy maintenance
- 🧪 Testable code
- 📖 Clear separation of concerns

---

## 🌐 Deployment

### Build for Production

```bash
# Build optimized production bundle
pnpm run build

# Preview production build locally
pnpm run preview
```

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

See **[QUICKSTART.md](./QUICKSTART.md)** for detailed deployment guides (Vercel, Netlify, Railway).

---

## 📝 Environment Variables

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 🧪 Testing Checklist

- ✅ User registration with email verification
- ✅ Login/Logout flow
- ✅ CRUD operations on all three pages
- ✅ Real-time sync across multiple tabs
- ✅ RLS policies preventing unauthorized access
- ✅ Toast notifications on all actions
- ✅ Dark mode toggle
- ✅ Responsive design on mobile/tablet

---

## 🛠️ Development Commands

```bash
# Start dev server (default: http://localhost:5173)
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview

# Lint code (if configured)
pnpm run lint
```

---

## 📚 Additional Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Setup & Deployment Guide
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Detailed deployment options
- **[supabase-schema.sql](./supabase-schema.sql)** - Database schema with RLS

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) - Open source Firebase alternative
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [React](https://react.dev) - JavaScript library for building UIs
- [Vite](https://vitejs.dev) - Next generation frontend tooling

---

## 💬 Support

If you have questions or need help:

1. Check the [QUICKSTART.md](./QUICKSTART.md) guide
2. Review [Supabase Documentation](https://supabase.com/docs)
3. Open an issue on GitHub

---

**Built with ❤️ using React, Supabase, and Tailwind CSS**
