function CategoryCard({ category, onEdit, onDelete }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {category.icon && <span className="text-3xl">{category.icon}</span>}
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: category.color }}
          >
            {!category.icon && category.name.charAt(0).toUpperCase()}
          </div>
        </div>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            category.type === "income"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
              : category.type === "expense"
                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
          }`}
        >
          {category.type}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {category.name}
      </h3>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(category)}
          className="flex-1 px-3 py-2 text-sm bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(category.id)}
          className="flex-1 px-3 py-2 text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-all"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default CategoryCard;
