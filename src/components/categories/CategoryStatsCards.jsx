function CategoryStatsCards({
  totalCategories,
  incomeCategories,
  expenseCategories,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
        <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">
          Total Categories
        </div>
        <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
          {totalCategories}
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
        <div className="text-sm text-green-600 dark:text-green-400 mb-1">
          Income Categories
        </div>
        <div className="text-2xl font-bold text-green-700 dark:text-green-300">
          {incomeCategories}
        </div>
      </div>

      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div className="text-sm text-red-600 dark:text-red-400 mb-1">
          Expense Categories
        </div>
        <div className="text-2xl font-bold text-red-700 dark:text-red-300">
          {expenseCategories}
        </div>
      </div>
    </div>
  );
}

export default CategoryStatsCards;
