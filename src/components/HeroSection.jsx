import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'

function HeroSection() {
  const { user } = useAuth()

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 text-white">
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Take Control of Your
            <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              Financial Future
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-purple-100 mb-10 leading-relaxed">
            Track expenses, manage budgets, and achieve your financial goals with real-time insights 
            and powerful analytics.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link
                to="/transactions"
                className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-all transform hover:-translate-y-1 hover:shadow-xl"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-all transform hover:-translate-y-1 hover:shadow-xl"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          <p className="mt-8 text-sm text-purple-200">
            ✨ Real-time sync • 🔒 Secure & Private • 📊 Powerful Analytics
          </p>
        </div>
      </div>

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" 
                fill="rgb(249 250 251)" 
                className="dark:fill-gray-950"/>
        </svg>
      </div>
    </section>
  )
}

export default HeroSection
