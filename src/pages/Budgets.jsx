import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { supabase } from "../supabaseClient";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import BudgetStatsCards from "../components/budgets/BudgetStatsCards";
import BudgetCreateEdit from "../components/budgets/BudgetCreateEdit";
import BudgetList from "../components/budgets/BudgetList";

function Budgets() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState(null);

  const channelRef = useRef(null);
  const initializedRef = useRef(false);

  // Load budgets
  const loadBudgets = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setBudgets(data || []);
    } catch (error) {
      console.error("Error loading budgets:", error);
      toast.error("Error loading budgets: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Setup realtime subscription
  const setupRealtime = (userId) => {
    if (channelRef.current) return;

    const channel = supabase
      .channel(`budgets-realtime-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "budgets",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("Realtime update received:", payload.eventType, payload);

          if (payload.eventType === "INSERT") {
            console.log("Adding new budget:", payload.new);
            setBudgets((prev) => [payload.new, ...prev]);
          }

          if (payload.eventType === "UPDATE") {
            console.log("Updating budget:", payload.new.id);
            setBudgets((prev) =>
              prev.map((b) => (b.id === payload.new.id ? payload.new : b)),
            );
          }

          if (payload.eventType === "DELETE") {
            console.log("Deleting budget:", payload.old.id);
            setBudgets((prev) => prev.filter((b) => b.id !== payload.old.id));
          }
        },
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);

        if (status === "SUBSCRIBED") {
          console.log("Successfully subscribed to budgets realtime updates");
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
      if (initializedRef.current) return;
      initializedRef.current = true;

      const { data } = await supabase.auth.getSession();
      const session = data?.session;

      if (!session?.user) {
        if (isMounted) navigate("/login");
        return;
      }

      const userId = session.user.id;

      if (!isMounted) return;

      await loadBudgets(userId);
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

  const handleEdit = (budget) => {
    setEditingData({
      category: budget.category,
      amount: budget.amount.toString(),
      period: budget.period,
      start_date: budget.start_date,
      end_date: budget.end_date || "",
    });
    setEditingId(budget.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) return;

    try {
      console.log("Deleting budget ID:", id);
      const { error } = await supabase.from("budgets").delete().eq("id", id);

      if (error) throw error;

      toast.success("Budget deleted successfully! 🗑️", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error deleting budget:", error);
      toast.error("Error deleting budget: " + error.message, {
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
  const totalAmount = budgets.reduce((sum, b) => sum + parseFloat(b.amount), 0);
  const activeBudgets = budgets.filter(
    (b) => !b.end_date || new Date(b.end_date) >= new Date(),
  ).length;

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
              Budgets
            </h1>

            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
            >
              {showForm ? "Hide Form" : "Add Budget"}
            </button>
          </div>

          {/* Stats Cards */}
          <BudgetStatsCards
            totalBudgets={budgets.length}
            totalAmount={totalAmount}
            activeBudgets={activeBudgets}
          />

          {/* Create/Edit Form */}
          {showForm && (
            <BudgetCreateEdit
              editingId={editingId}
              initialData={editingData}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          )}

          {/* Budgets List */}
          <BudgetList
            budgets={budgets}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </Layout>
  );
}

export default Budgets;
