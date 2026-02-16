function TransactionStatsCards({ totalIncome, totalExpense, balance }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
        <div className="text-sm text-green-600 dark:text-green-400 mb-1">
          Total Income
        </div>
        <div className="text-2xl font-bold text-green-700 dark:text-green-300">
          ${totalIncome.toFixed(2)}
        </div>
      </div>

      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div className="text-sm text-red-600 dark:text-red-400 mb-1">
          Total Expenses
        </div>
        <div className="text-2xl font-bold text-red-700 dark:text-red-300">
          ${totalExpense.toFixed(2)}
        </div>
      </div>

      <div
        className={`${
          balance >= 0
            ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
            : "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
        } border rounded-lg p-6`}
      >
        <div
          className={`text-sm ${
            balance >= 0
              ? "text-blue-600 dark:text-blue-400"
              : "text-orange-600 dark:text-orange-400"
          } mb-1`}
        >
          Balance
        </div>
        <div
          className={`text-2xl font-bold ${
            balance >= 0
              ? "text-blue-700 dark:text-blue-300"
              : "text-orange-700 dark:text-orange-300"
          }`}
        >
          ${balance.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

export default TransactionStatsCards;
