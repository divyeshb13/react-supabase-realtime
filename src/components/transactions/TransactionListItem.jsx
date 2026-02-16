function TransactionListItem({ transaction, onEdit, onDelete }) {
  return (
    <tr
      key={transaction.id}
      className="hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
        {new Date(transaction.date).toLocaleDateString()}
      </td>

      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
        {transaction.description || "-"}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
        {transaction.category || "-"}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            transaction.type === "income"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
          }`}
        >
          {transaction.type}
        </span>
      </td>

      <td
        className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${
          transaction.type === "income"
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400"
        }`}
      >
        {transaction.type === "income" ? "+" : "-"}$
        {Math.abs(transaction.amount).toFixed(2)}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onEdit(transaction)}
          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(transaction.id)}
          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default TransactionListItem;
