function BudgetStatsCards({ totalBudgets, totalAmount, activeBudgets }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
        <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">
          Total Budgets
        </div>
        <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
          {totalBudgets}
        </div>
      </div>

      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
        <div className="text-sm text-indigo-600 dark:text-indigo-400 mb-1">
          Total Budget Amount
        </div>
        <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
          ${totalAmount.toFixed(2)}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">
          Active Budgets
        </div>
        <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
          {activeBudgets}
        </div>
      </div>
    </div>
  );
}

export default BudgetStatsCards;
