import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { supabase } from "../supabaseClient";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import TransactionStatsCards from "../components/transactions/TransactionStatsCards";
import TransactionCreateEdit from "../components/transactions/TransactionCreateEdit";
import TransactionList from "../components/transactions/TransactionList";

function Transactions() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState(null);

  const channelRef = useRef(null);
  const initializedRef = useRef(false);

  // Load transactions
  const loadTransactions = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false });

      if (error) throw error;

      setTransactions(data || []);
    } catch (error) {
      console.error("Error loading transactions:", error);
      toast.error("Error loading transactions: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Setup realtime subscription
  const setupRealtime = (userId) => {
    if (channelRef.current) return;

    const channel = supabase
      .channel(`transactions-realtime-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transactions",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("Realtime update received:", payload.eventType, payload);

          if (payload.eventType === "INSERT") {
            console.log("Adding new transaction:", payload.new);
            setTransactions((prev) => {
              const updated = [payload.new, ...prev];
              return updated.sort(
                (a, b) => new Date(b.date) - new Date(a.date),
              );
            });
          }

          if (payload.eventType === "UPDATE") {
            console.log("Updating transaction:", payload.new.id);
            setTransactions((prev) =>
              prev.map((t) => (t.id === payload.new.id ? payload.new : t)),
            );
          }

          if (payload.eventType === "DELETE") {
            console.log("Deleting transaction:", payload.old.id);
            setTransactions((prev) =>
              prev.filter((t) => t.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);

        if (status === "SUBSCRIBED") {
          console.log(
            "Successfully subscribed to transactions realtime updates",
          );
        }

        if (status === "CHANNEL_ERROR") {
          console.error("Realtime subscription error");
        }
      });

    channelRef.current = channel;
  };

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      // Prevent double init in dev strict mode
      if (initializedRef.current) return;
      initializedRef.current = true;

      // Wait for session to be restored on refresh
      const { data } = await supabase.auth.getSession();
      const session = data?.session;

      if (!session?.user) {
        if (isMounted) navigate("/login");
        return;
      }

      const userId = session.user.id;

      if (!isMounted) return;

      await loadTransactions(userId);
      setupRealtime(userId);
    };

    init();

    return () => {
      isMounted = false;

      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [navigate]);

  const handleEdit = (transaction) => {
    setEditingData({
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      type: transaction.type,
      date: transaction.date,
    });
    setEditingId(transaction.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;

    try {
      console.log("Deleting transaction ID:", id);
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Transaction deleted successfully! 🗑️", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Error deleting transaction: " + error.message, {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  const handleFormSuccess = () => {
    setEditingId(null);
    setEditingData(null);
    setShowForm(false);
  };

  const handleFormCancel = () => {
    setEditingId(null);
    setEditingData(null);
    setShowForm(false);
  };

  // Calculate stats
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const balance = totalIncome - totalExpense;

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl text-gray-600 dark:text-gray-400">
            Loading...
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Transactions
            </h1>

            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
            >
              {showForm ? "Hide Form" : "Add Transaction"}
            </button>
          </div>

          {/* Stats Cards */}
          <TransactionStatsCards
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            balance={balance}
          />

          {/* Create/Edit Form */}
          {showForm && (
            <TransactionCreateEdit
              editingId={editingId}
              initialData={editingData}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          )}

          {/* Transactions List */}
          <TransactionList
            transactions={transactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </Layout>
  );
}

export default Transactions;
