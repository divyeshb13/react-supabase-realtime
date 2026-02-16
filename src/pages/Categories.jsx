import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { supabase } from "../supabaseClient";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import CategoryStatsCards from "../components/categories/CategoryStatsCards";
import CategoryCreateEdit from "../components/categories/CategoryCreateEdit";
import CategoryGrid from "../components/categories/CategoryGrid";

function Categories() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState(null);

  const channelRef = useRef(null);
  const initializedRef = useRef(false);

  // Load categories
  const loadCategories = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setCategories(data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Error loading categories: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Setup realtime subscription
  const setupRealtime = (userId) => {
    if (channelRef.current) return;

    const channel = supabase
      .channel(`categories-realtime-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "categories",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("Realtime update received:", payload.eventType, payload);

          if (payload.eventType === "INSERT") {
            console.log("Adding new category:", payload.new);
            setCategories((prev) => [payload.new, ...prev]);
          }

          if (payload.eventType === "UPDATE") {
            console.log("Updating category:", payload.new.id);
            setCategories((prev) =>
              prev.map((c) => (c.id === payload.new.id ? payload.new : c)),
            );
          }

          if (payload.eventType === "DELETE") {
            console.log("Deleting category:", payload.old.id);
            setCategories((prev) =>
              prev.filter((c) => c.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);

        if (status === "SUBSCRIBED") {
          console.log("Successfully subscribed to categories realtime updates");
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

      await loadCategories(userId);
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

  const handleEdit = (category) => {
    setEditingData({
      name: category.name,
      color: category.color || "#6366f1",
      icon: category.icon || "",
      type: category.type,
    });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      console.log("Deleting category ID:", id);
      const { error } = await supabase.from("categories").delete().eq("id", id);

      if (error) throw error;

      toast.success("Category deleted successfully! 🗑️", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Error deleting category: " + error.message, {
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
  const incomeCategories = categories.filter(
    (c) => c.type === "income" || c.type === "both",
  ).length;
  const expenseCategories = categories.filter(
    (c) => c.type === "expense" || c.type === "both",
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
              Categories
            </h1>

            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
            >
              {showForm ? "Hide Form" : "Add Category"}
            </button>
          </div>

          {/* Stats Cards */}
          <CategoryStatsCards
            totalCategories={categories.length}
            incomeCategories={incomeCategories}
            expenseCategories={expenseCategories}
          />

          {/* Create/Edit Form */}
          {showForm && (
            <CategoryCreateEdit
              editingId={editingId}
              initialData={editingData}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          )}

          {/* Categories Grid */}
          <CategoryGrid
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </Layout>
  );
}

export default Categories;
