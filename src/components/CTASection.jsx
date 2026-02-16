import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'

function CTASection() {
  const { user } = useAuth()

  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
          Ready to Take Control of Your Finances?
        </h2>
        <p className="text-xl text-purple-100 mb-10">
          Join thousands of users who are already managing their money smarter with FinTracker.
        </p>
        
        {!user && (
          <Link
            to="/register"
            className="inline-block px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-all transform hover:-translate-y-1 hover:shadow-xl"
          >
            Start Free Today
          </Link>
        )}
      </div>
    </section>
  )
}

export default CTASection
