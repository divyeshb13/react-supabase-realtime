import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { supabase } from '../supabaseClient'

function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [budgets, setBudgets] = useState([])

  useEffect(() => {
    if (user) {
      loadData()
      setupRealtimeSubscriptions()
    }
  }, [user])

  const loadData = async () => {
    try {
      const [transactionsData, categoriesData, budgetsData] = await Promise.all([
        supabase.from('transactions').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*'),
        supabase.from('budgets').select('*')
      ])

      if (transactionsData.data) setTransactions(transactionsData.data)
      if (categoriesData.data) setCategories(categoriesData.data)
      if (budgetsData.data) setBudgets(budgetsData.data)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const setupRealtimeSubscriptions = () => {
    const transactionsChannel = supabase
      .channel('transactions-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, 
        (payload) => handleRealtimeUpdate('transactions', payload))
      .subscribe()

    const categoriesChannel = supabase
      .channel('categories-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, 
        (payload) => handleRealtimeUpdate('categories', payload))
      .subscribe()

    const budgetsChannel = supabase
      .channel('budgets-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'budgets' }, 
        (payload) => handleRealtimeUpdate('budgets', payload))
      .subscribe()

    return () => {
      supabase.removeChannel(transactionsChannel)
      supabase.removeChannel(categoriesChannel)
      supabase.removeChannel(budgetsChannel)
    }
  }

  const handleRealtimeUpdate = (table, payload) => {
    console.log(`Real-time update on ${table}:`, payload)

    const updateState = (setter) => {
      if (payload.eventType === 'INSERT') {
        setter(prev => [payload.new, ...prev])
      } else if (payload.eventType === 'UPDATE') {
        setter(prev => prev.map(item => item.id === payload.new.id ? payload.new : item))
      } else if (payload.eventType === 'DELETE') {
        setter(prev => prev.filter(item => item.id !== payload.old.id))
      }
    }

    switch (table) {
      case 'transactions':
        updateState(setTransactions)
        break
      case 'categories':
        updateState(setCategories)
        break
      case 'budgets':
        updateState(setBudgets)
        break
    }
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Loading your financial data...</h2>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold">Financial Tracker Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm opacity-90">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg transition-all duration-200 hover:-translate-y-0.5 text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to your Financial Tracker!
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Real-time sync enabled across all your devices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-3">Transactions</h3>
            <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{transactions.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total records</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-3">Categories</h3>
            <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{categories.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Active categories</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-lg font-semibold text-pink-600 dark:text-pink-400 mb-3">Budgets</h3>
            <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{budgets.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Budget items</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-2 border-purple-200 dark:border-purple-700 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
            <span className="text-2xl">✅</span> Real-time Sync Active
          </h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
              <span>All 3 tables connected to Supabase</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
              <span>Changes sync instantly across all browsers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
              <span>Data persists securely in the cloud</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
              <span>Row Level Security (RLS) configured</span>
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            Ready to Add Your Features
          </h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            This dashboard is connected to Supabase with real-time subscriptions active.
            You can now add your financial tracking components here. The authentication
            system is fully functional with user registration, login, and protected routes.
          </p>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
