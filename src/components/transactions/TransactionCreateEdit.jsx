import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function TransactionCreateEdit({
  editingId,
  initialData,
  onSuccess,
  onCancel,
}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(
    initialData || {
      amount: "",
      description: "",
      category: "",
      type: "expense",
      date: new Date().toISOString().split("T")[0],
    },
  );

  const resetForm = () => {
    setFormData({
      amount: "",
      description: "",
      category: "",
      type: "expense",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;

      if (!session?.user) {
        navigate("/login");
        return;
      }

      const transactionData = {
        ...formData,
        user_id: session.user.id,
        amount: parseFloat(formData.amount),
      };

      if (editingId) {
        // Update existing transaction
        const { error } = await supabase
          .from("transactions")
          .update(transactionData)
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Transaction updated successfully! ✅", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        // Insert new transaction
        const { error } = await supabase
          .from("transactions")
          .insert([transactionData]);

        if (error) throw error;
        toast.success("Transaction added successfully! 🎉", {
          position: "top-right",
          autoClose: 3000,
        });
      }

      resetForm();
      onSuccess();
    } catch (error) {
      console.error("Error saving transaction:", error);
      toast.error("Error: " + error.message, {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {editingId ? "Edit Transaction" : "New Transaction"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amount
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date
          </label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows="3"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
          >
            {editingId ? "Update" : "Add"} Transaction
          </button>

          {editingId && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default TransactionCreateEdit;
