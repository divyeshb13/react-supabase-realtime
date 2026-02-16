function FeaturesSection() {
  const features = [
    {
      icon: '💰',
      title: 'Track Transactions',
      description: 'Monitor all your income and expenses in one place with detailed categorization.'
    },
    {
      icon: '📊',
      title: 'Manage Budgets',
      description: 'Set spending limits and track progress towards your financial goals.'
    },
    {
      icon: '🏷️',
      title: 'Custom Categories',
      description: 'Organize your finances with personalized categories that fit your lifestyle.'
    },
    {
      icon: '⚡',
      title: 'Real-time Sync',
      description: 'Access your data from any device with instant synchronization.'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your financial data is encrypted and protected with industry-standard security.'
    },
    {
      icon: '📱',
      title: 'Multi-device',
      description: 'Seamlessly switch between desktop, tablet, and mobile devices.'
    }
  ]

  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to Manage Your Money
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Powerful features designed to give you complete control over your personal finances.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-800"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
