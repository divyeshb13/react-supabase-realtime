function BudgetListItem({ budget, onEdit, onDelete }) {
  const isActive = !budget.end_date || new Date(budget.end_date) >= new Date();

  return (
    <tr key={budget.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
        {budget.category}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
        ${parseFloat(budget.amount).toFixed(2)}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
          {budget.period}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
        {new Date(budget.start_date).toLocaleDateString()}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
        {budget.end_date
          ? new Date(budget.end_date).toLocaleDateString()
          : "Ongoing"}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            isActive
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
              : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
          }`}
        >
          {isActive ? "Active" : "Ended"}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onEdit(budget)}
          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(budget.id)}
          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default BudgetListItem;
