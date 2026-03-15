import { useState, useEffect, useCallback, useMemo } from "react";
import { budgetsAPI } from "../../api/budgets";
import { message } from "antd";

const ITEMS_PER_PAGE = 5;

const fmt = (n) => {
  if (!n && n !== 0) return "0";
  return Math.round(n).toLocaleString("uz-UZ").replace(/,/g, " ");
};

function WaveCard({ value, label, colorClass, bgClass, textClass, loading }) {
  return (
    <div
      className={`rounded-2xl p-4 flex-1 min-w-35 sm:min-w-40 relative overflow-hidden ${bgClass}`}
    >
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          opacity: 0.18,
          pointerEvents: "none",
        }}
      >
        <svg
          viewBox="0 0 200 60"
          preserveAspectRatio="none"
          width="100%"
          height="48"
        >
          <path
            d="M0,40 C40,10 80,55 120,30 C160,5 180,45 200,35 L200,60 L0,60 Z"
            fill={colorClass}
          />
          <path
            d="M0,50 C50,25 100,55 150,35 C175,25 190,45 200,40 L200,60 L0,60 Z"
            fill={colorClass}
            opacity="0.6"
          />
        </svg>
      </div>
      <div
        className={`text-xl sm:text-2xl font-bold ${textClass} relative z-10`}
        style={{
          fontFamily: "'DM Serif Display', Georgia, serif",
          letterSpacing: "-0.5px",
        }}
      >
        {loading ? "..." : fmt(value)}{" "}
        <span className="text-[10px] sm:text-xs font-semibold opacity-70">
          UZS
        </span>
      </div>
      <div className="text-xs sm:text-sm text-gray-500 mt-1 font-medium relative z-10">
        {label}
      </div>
    </div>
  );
}

function ProgressBar({ pct, color }) {
  const clamped = Math.min(Math.max(pct, 0), 120);
  const overflow = pct > 100;
  return (
    <div
      style={{
        background: "#F3F4F6",
        borderRadius: 6,
        height: 6,
        width: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${Math.min(clamped, 100)}%`,
          background: overflow ? "#EF4444" : color,
          height: "100%",
          borderRadius: 6,
          transition: "width 0.4s cubic-bezier(.4,0,.2,1)",
        }}
      />
    </div>
  );
}

function Modal({ onClose, onSave, editItem, loading, categories }) {
  const [form, setForm] = useState(
    editItem
      ? { 
          category: editItem.category, 
          icon: editItem.icon || getCategoryIcon(editItem.category), 
          total: editItem.total || 0, 
          spent: editItem.spent || 0, 
          color: editItem.color || getCategoryColor(editItem.category)
        }
      : { category: "", icon: "💰", total: "", spent: "0", color: "#6366F1" },
  );

  const icons = [
    "💰", "🏪", "🍔", "🚗", "🎮", "📡", "💊", "📚", "💡", "👗", 
    "✈️", "🍽️", "🏦", "🛡️", "🏋️", "📱"
  ];

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-[20px] p-6 sm:p-8 w-full max-w-105 shadow-2xl my-auto">
        <h3
          className="text-xl sm:text-2xl mb-5 font-serif"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          {editItem ? "Edit Budget" : "Create Budget"}
        </h3>
        <div className="space-y-4">
          {/* Category Name Input */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Category Name <span className="text-red-400">*</span>
            </label>
            <input
              className="w-full border-1.5 border-gray-200 rounded-xl p-3 mt-1 outline-none focus:border-indigo-500 transition-colors"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="e.g. Groceries, Shopping, Transport"
              disabled={loading}
            />
            {!editItem && categories.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                <span className="text-[10px] text-gray-400 mr-1">Suggestions:</span>
                {categories.slice(0, 5).map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setForm({ 
                      ...form, 
                      category: cat.category,
                      icon: getCategoryIcon(cat.category),
                      color: getCategoryColor(cat.category)
                    })}
                    className="text-[10px] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full"
                  >
                    {cat.category}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Icon Selection */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Icon
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {icons.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setForm({ ...form, icon: ic })}
                  className={`text-xl p-2 rounded-lg border-2 transition-all ${form.icon === ic ? "border-indigo-500 bg-indigo-50" : "border-transparent bg-gray-50"}`}
                  disabled={loading}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Total and Spent Amounts */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Total Budget (UZS) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                className="w-full border-1.5 border-gray-200 rounded-xl p-3 mt-1 outline-none"
                value={form.total}
                onChange={(e) => setForm({ ...form, total: e.target.value })}
                placeholder="0"
                disabled={loading}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Already Spent (UZS)
              </label>
              <input
                type="number"
                className="w-full border-1.5 border-gray-200 rounded-xl p-3 mt-1 outline-none"
                value={form.spent}
                onChange={(e) => setForm({ ...form, spent: e.target.value })}
                placeholder="0"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border-1.5 border-gray-200 font-semibold text-sm hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!form.category.trim()) {
                message.error('Please enter category name');
                return;
              }
              if (!form.total || Number(form.total) <= 0) {
                message.error('Please enter valid total budget amount');
                return;
              }
              onSave({
                ...form,
                category: form.category.trim(),
                total: Number(form.total) || 0,
                spent: Number(form.spent) || 0,
              });
            }}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-[#1D3557] text-white font-semibold text-sm hover:bg-[#2C4A7A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Budget'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Kategoriya uchun icon olish
const getCategoryIcon = (category) => {
  const icons = {
    'Store': '🏪',
    'Food': '🍔',
    'Transportation': '🚗',
    'Entertainment': '🎮',
    'Internet Bill': '📡',
    'Health': '💊',
    'Education': '📚',
    'Utilities': '💡',
    'Clothing': '👗',
    'Travel': '✈️',
    'Dining Out': '🍽️',
    'Savings': '🏦',
    'Insurance': '🛡️',
    'Gym': '🏋️',
    'Subscriptions': '📱'
  };
  return icons[category] || '💰';
};

// Kategoriya uchun color olish
const getCategoryColor = (category) => {
  const colors = {
    'Store': '#F59E0B',
    'Food': '#EF4444',
    'Transportation': '#6366F1',
    'Entertainment': '#8B5CF6',
    'Internet Bill': '#10B981',
    'Health': '#EC4899',
    'Education': '#3B82F6',
    'Utilities': '#F97316',
    'Clothing': '#14B8A6',
    'Travel': '#6366F1',
    'Dining Out': '#F59E0B',
    'Savings': '#10B981',
    'Insurance': '#8B5CF6',
    'Gym': '#EF4444',
    'Subscriptions': '#3B82F6'
  };
  return colors[category] || '#6366F1';
};

export default function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toISOString().slice(0, 7) // YYYY-MM format
  );

  // Barcha ma'lumotlarni yuklash
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      // Parallel fetch budgets and comparison
      const [budgetsData, comparisonData] = await Promise.all([
        budgetsAPI.getAll().catch(err => {
          console.warn('Failed to fetch budgets:', err);
          return [];
        }),
        budgetsAPI.getComparison(currentMonth).catch(err => {
          console.warn('Failed to fetch comparison:', err);
          return null;
        })
      ]);

      // Transform budgets to component format
      const transformedBudgets = [];
      
      if (budgetsData && budgetsData.length > 0) {
        // Take first budget (usually current month)
        const currentBudget = budgetsData[0];
        
        currentBudget.category_limits.forEach((limit, index) => {
          // Find corresponding comparison result
          const result = comparisonData?.category_results?.find(
            r => r.category.toLowerCase() === limit.category.toLowerCase()
          );

          transformedBudgets.push({
            id: limit.id || `${currentBudget.month}-${index}`,
            category: limit.category,
            icon: getCategoryIcon(limit.category),
            color: getCategoryColor(limit.category),
            spent: result?.actual_spent || 0,
            total: limit.limit_amount,
            month: currentBudget.month,
            exceeded: result?.exceeded || false
          });
        });
      }

      setBudgets(transformedBudgets);
      setComparison(comparisonData);

    } catch (error) {
      console.error('Fetch data error:', error);
      message.error('Failed to load budget data');
    } finally {
      setLoading(false);
    }
  }, [currentMonth]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Calculate totals
  const totalBudget = useMemo(() => 
    budgets.reduce((s, b) => s + (b.total || 0), 0), [budgets]
  );
  
  const totalSpent = useMemo(() => 
    budgets.reduce((s, b) => s + (b.spent || 0), 0), [budgets]
  );
  
  const overspent = useMemo(() => 
    budgets
      .filter((b) => (b.spent || 0) > (b.total || 0))
      .reduce((s, b) => s + ((b.spent || 0) - (b.total || 0)), 0), [budgets]
  );
  
  const spentPct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const totalPages = Math.ceil(budgets.length / ITEMS_PER_PAGE);
  const paginated = budgets.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const handleSave = async (form) => {
    setModalLoading(true);
    try {
      // Prepare category limits
      const categoryLimits = budgets.map(b => ({
        category: b.category,
        limit_amount: b.total.toString()
      }));

      // Add or update current item
      if (editItem) {
        // Update existing
        const updatedLimits = categoryLimits.map(limit => 
          limit.category === editItem.category
            ? { category: form.category, limit_amount: form.total.toString() }
            : limit
        );

        const budgetData = {
          month: currentMonth,
          income_target: comparison?.income_target?.toString() || "0",
          category_limits: updatedLimits
        };

        await budgetsAPI.update(currentMonth, budgetData);
        message.success('Budget updated successfully');
      } else {
        // Check if category already exists
        if (categoryLimits.some(l => l.category === form.category)) {
          message.error('Category already exists');
          setModalLoading(false);
          return;
        }

        // Create new
        const newLimit = {
          category: form.category,
          limit_amount: form.total.toString()
        };

        const budgetData = {
          month: currentMonth,
          income_target: comparison?.income_target?.toString() || "0",
          category_limits: [...categoryLimits, newLimit]
        };

        await budgetsAPI.create(budgetData);
        message.success('Budget created successfully');
      }

      // Refresh data
      await fetchAllData();
      setShowModal(false);
      setEditItem(null);
    } catch (error) {
      message.error(error.error || 'Failed to save budget');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const budgetToDelete = budgets.find(b => b.id === id);
      if (!budgetToDelete) return;

      // Remove category from limits
      const updatedLimits = budgets
        .filter(b => b.id !== id)
        .map(b => ({
          category: b.category,
          limit_amount: b.total.toString()
        }));

      const budgetData = {
        month: currentMonth,
        income_target: comparison?.income_target?.toString() || "0",
        category_limits: updatedLimits
      };

      await budgetsAPI.update(currentMonth, budgetData);
      
      setBudgets(prev => prev.filter(b => b.id !== id));
      message.success('Budget deleted successfully');
      setDeleteConfirm(null);
      
      const newTotalPages = Math.ceil((budgets.length - 1) / ITEMS_PER_PAGE);
      if (page > newTotalPages) setPage(Math.max(1, newTotalPages));
    } catch (error) {
      message.error('Failed to delete budget');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h3 className="text-base sm:text-base md:text-2xl lg:text-2xl 2xl:text-3xl font-medium text-[#1F2937]">
            My Budget Summary - {currentMonth}
          </h3>
          <button
            onClick={() => {
              setEditItem(null);
              setShowModal(true);
            }}
            className="w-full sm:w-auto bg-[#1D3557] text-white px-4 py-2 sm:px-5 sm:py-3 md:px-6 md:py-3 rounded-xl font-medium text-[13px] sm:text-[14px] md:text-sm flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 hover:opacity-90 transition-opacity"
          >
            <span className="text-[16px] sm:text-[18px] md:text-lg">+</span>{" "}
            Create Budget
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <WaveCard
            value={totalBudget}
            label="Total Budget"
            colorClass="#3B82F6"
            bgClass="bg-blue-50"
            textClass="text-blue-700"
            loading={loading}
          />
          <WaveCard
            value={totalSpent}
            label={`${spentPct}% Spent`}
            colorClass="#10B981"
            bgClass="bg-green-50"
            textClass="text-green-600"
            loading={loading}
          />
          <WaveCard
            value={overspent}
            label="Overspent"
            colorClass="#EF4444"
            bgClass="bg-red-50"
            textClass="text-red-500"
            loading={loading}
          />
          <WaveCard
            value={Math.max(totalBudget - totalSpent, 0)}
            label="Left to Spend"
            colorClass="#6366F1"
            bgClass="bg-indigo-50"
            textClass="text-indigo-600"
            loading={loading}
          />
        </div>

        {/* Income Target Section (if available) */}
        {comparison && comparison.income_target > 0 && (
          <div className="mb-6 p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Income Target
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-blue-700">
                    {fmt(comparison.income_target)} UZS
                  </span>
                  <span className="text-sm text-gray-500">
                    vs {fmt(comparison.actual_income)} actual
                  </span>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-xl font-bold text-sm ${
                comparison.income_delta >= 0 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {comparison.income_delta >= 0 ? '+' : ''}
                {fmt(comparison.income_delta)} UZS
              </div>
            </div>
          </div>
        )}

        {/* Budgets List */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-50">
            <h3 className="text-lg font-medium text-[#1F2937]">
              Category Budgets
              {budgets.length === 0 && " - No budgets yet"}
            </h3>
          </div>

          {budgets.length === 0 ? (
            <div className="p-10 text-center">
              <div className="text-6xl mb-4">💰</div>
              <p className="text-gray-500 mb-4">No budgets found for this month</p>
              <button
                onClick={() => {
                  setEditItem(null);
                  setShowModal(true);
                }}
                className="bg-[#1D3557] text-white px-6 py-3 rounded-xl font-medium"
              >
                Create Your First Budget
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Table Header */}
              <div className="hidden md:grid grid-cols-[2fr_1.2fr_1.2fr_1.2fr_80px] gap-4 px-6 py-3 bg-gray-50/50 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <span>Category</span>
                <span>Spent</span>
                <span>Remaining</span>
                <span>Total</span>
                <span className="text-right">Action</span>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-50">
                {paginated.map((b) => {
                  const remaining = (b.total || 0) - (b.spent || 0);
                  const pct = b.total > 0 ? Math.round(((b.spent || 0) / b.total) * 100) : 0;
                  const isOver = (b.spent || 0) > (b.total || 0);

                  return (
                    <div
                      key={b.id}
                      className="p-4 sm:px-6 sm:py-5 hover:bg-gray-50/30 transition-colors"
                    >
                      {/* Mobile Layout */}
                      <div className="flex md:hidden flex-col gap-3">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-3">
                            <span className="text-2xl bg-gray-50 p-2 rounded-xl h-fit">
                              {b.icon}
                            </span>
                            <div>
                              <div className="font-bold text-sm text-gray-800">
                                {b.category}
                              </div>
                              <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                                {pct}% of {fmt(b.total)}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                setEditItem(b);
                                setShowModal(true);
                              }}
                              className="p-2 text-gray-400 hover:text-blue-500"
                            >
                              <svg
                                width="16"
                                height="16"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(b.id)}
                              className="p-2 text-gray-400 hover:text-red-500"
                            >
                              <svg
                                width="16"
                                height="16"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-gray-500">
                              Spent: {fmt(b.spent)}
                            </span>
                            <span
                              className={isOver ? "text-red-500" : "text-green-600"}
                            >
                              {isOver ? "Over" : "Left"}: {fmt(Math.abs(remaining))}
                            </span>
                          </div>
                          <ProgressBar pct={pct} color={b.color} />
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden md:grid grid-cols-[2fr_1.2fr_1.2fr_1.2fr_80px] gap-4 items-center">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl bg-gray-50 p-2 rounded-xl">
                            {b.icon}
                          </span>
                          <div className="min-w-0">
                            <div className="font-bold text-sm text-gray-800 truncate">
                              {b.category}
                            </div>
                            <div className="w-24 mt-1.5">
                              <ProgressBar pct={pct} color={b.color} />
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-bold">
                          {fmt(b.spent)}{" "}
                          <span className="text-[10px] text-gray-300">UZS</span>
                        </div>
                        <div
                          className={`text-sm font-bold ${isOver ? "text-red-500" : "text-slate-700"}`}
                        >
                          {isOver ? "-" : ""}
                          {fmt(Math.abs(remaining))}{" "}
                          <span className="text-[10px] text-gray-300">UZS</span>
                        </div>
                        <div className="text-sm font-bold">
                          {fmt(b.total)}{" "}
                          <span className="inline-block ml-1 bg-indigo-50 text-indigo-500 text-[10px] px-1.5 py-0.5 rounded">
                            {pct}%
                          </span>
                        </div>
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditItem(b);
                              setShowModal(true);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <svg
                              width="14"
                              height="14"
                              fill="none"
                              stroke="#6B7280"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(b.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <svg
                              width="14"
                              height="14"
                              fill="none"
                              stroke="#6B7280"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs font-medium text-gray-400">
                    Page {page} of {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="px-4 py-2 rounded-lg border border-gray-100 text-xs font-bold disabled:opacity-30"
                    >
                      Prev
                    </button>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                      className="px-4 py-2 rounded-lg bg-[#1D3557] text-white text-xs font-bold disabled:opacity-30"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showModal && (
        <Modal
          onClose={() => {
            setShowModal(false);
            setEditItem(null);
          }}
          onSave={handleSave}
          editItem={editItem}
          loading={modalLoading}
          categories={budgets}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-85 text-center shadow-2xl">
            <div className="text-4xl mb-4">🗑️</div>
            <h3
              className="text-xl font-serif mb-2"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Delete Budget?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              This category will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 rounded-xl border border-gray-100 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// import { useState } from "react";

// const initialBudgets = [
//   {
//     id: 1,
//     category: "Store",
//     icon: "🏪",
//     color: "#F59E0B",
//     spent: 1800000,
//     total: 1800000,
//   },
//   {
//     id: 2,
//     category: "Food",
//     icon: "🍔",
//     color: "#EF4444",
//     spent: 1200000,
//     total: 1000000,
//   },
//   {
//     id: 3,
//     category: "Transportation",
//     icon: "🚗",
//     color: "#6366F1",
//     spent: 2000000,
//     total: 2500000,
//   },
//   {
//     id: 4,
//     category: "Entertainment",
//     icon: "🎮",
//     color: "#8B5CF6",
//     spent: 1200000,
//     total: 1500000,
//   },
//   {
//     id: 5,
//     category: "Internet Bill",
//     icon: "📡",
//     color: "#10B981",
//     spent: 1300000,
//     total: 3000000,
//   },
//   {
//     id: 6,
//     category: "Health",
//     icon: "💊",
//     color: "#EC4899",
//     spent: 500000,
//     total: 2000000,
//   },
//   {
//     id: 7,
//     category: "Education",
//     icon: "📚",
//     color: "#3B82F6",
//     spent: 800000,
//     total: 1500000,
//   },
//   {
//     id: 8,
//     category: "Utilities",
//     icon: "💡",
//     color: "#F97316",
//     spent: 300000,
//     total: 700000,
//   },
//   {
//     id: 9,
//     category: "Clothing",
//     icon: "👗",
//     color: "#14B8A6",
//     spent: 900000,
//     total: 1200000,
//   },
//   {
//     id: 10,
//     category: "Travel",
//     icon: "✈️",
//     color: "#6366F1",
//     spent: 2500000,
//     total: 3000000,
//   },
//   {
//     id: 11,
//     category: "Dining Out",
//     icon: "🍽️",
//     color: "#F59E0B",
//     spent: 600000,
//     total: 800000,
//   },
//   {
//     id: 12,
//     category: "Savings",
//     icon: "🏦",
//     color: "#10B981",
//     spent: 1000000,
//     total: 5000000,
//   },
//   {
//     id: 13,
//     category: "Insurance",
//     icon: "🛡️",
//     color: "#8B5CF6",
//     spent: 400000,
//     total: 400000,
//   },
//   {
//     id: 14,
//     category: "Gym",
//     icon: "🏋️",
//     color: "#EF4444",
//     spent: 150000,
//     total: 200000,
//   },
//   {
//     id: 15,
//     category: "Subscriptions",
//     icon: "📱",
//     color: "#3B82F6",
//     spent: 250000,
//     total: 300000,
//   },
// ];

// const ITEMS_PER_PAGE = 5;

// const fmt = (n) => Math.abs(n).toLocaleString("uz-UZ").replace(/,/g, " ");

// function WaveCard({ value, label, colorClass, bgClass, textClass }) {
//   return (
//     <div
//       className={`rounded-2xl p-4 flex-1 min-w-35 sm:min-w-40 relative overflow-hidden ${bgClass}`}
//     >
//       <div
//         style={{
//           position: "absolute",
//           bottom: 0,
//           left: 0,
//           right: 0,
//           opacity: 0.18,
//           pointerEvents: "none",
//         }}
//       >
//         <svg
//           viewBox="0 0 200 60"
//           preserveAspectRatio="none"
//           width="100%"
//           height="48"
//         >
//           <path
//             d="M0,40 C40,10 80,55 120,30 C160,5 180,45 200,35 L200,60 L0,60 Z"
//             fill={colorClass}
//           />
//           <path
//             d="M0,50 C50,25 100,55 150,35 C175,25 190,45 200,40 L200,60 L0,60 Z"
//             fill={colorClass}
//             opacity="0.6"
//           />
//         </svg>
//       </div>
//       <div
//         className={`text-xl sm:text-2xl font-bold ${textClass} relative z-10`}
//         style={{
//           fontFamily: "'DM Serif Display', Georgia, serif",
//           letterSpacing: "-0.5px",
//         }}
//       >
//         {fmt(value)}{" "}
//         <span className="text-[10px] sm:text-xs font-semibold opacity-70">
//           UZS
//         </span>
//       </div>
//       <div className="text-xs sm:text-sm text-gray-500 mt-1 font-medium relative z-10">
//         {label}
//       </div>
//     </div>
//   );
// }

// function ProgressBar({ pct, color }) {
//   const clamped = Math.min(Math.max(pct, 0), 120);
//   const overflow = pct > 100;
//   return (
//     <div
//       style={{
//         background: "#F3F4F6",
//         borderRadius: 6,
//         height: 6,
//         width: "100%",
//         overflow: "hidden",
//       }}
//     >
//       <div
//         style={{
//           width: `${Math.min(clamped, 100)}%`,
//           background: overflow ? "#EF4444" : color,
//           height: "100%",
//           borderRadius: 6,
//           transition: "width 0.4s cubic-bezier(.4,0,.2,1)",
//         }}
//       />
//     </div>
//   );
// }

// function Modal({ onClose, onSave, editItem }) {
//   const [form, setForm] = useState(
//     editItem
//       ? { ...editItem }
//       : { category: "", icon: "💰", total: "", spent: "", color: "#6366F1" },
//   );

//   const icons = [
//     "💰",
//     "🏪",
//     "🍔",
//     "🚗",
//     "🎮",
//     "📡",
//     "💊",
//     "📚",
//     "💡",
//     "👗",
//     "✈️",
//     "🍽️",
//     "🏦",
//     "🛡️",
//     "🏋️",
//     "📱",
//   ];
//   // const colors = ["#6366F1", "#F59E0B", "#EF4444", "#10B981", "#8B5CF6", "#EC4899", "#3B82F6", "#F97316", "#14B8A6"];

//   return (
//     <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
//       <div className="bg-white rounded-[20px] p-6 sm:p-8 w-full max-w-105 shadow-2xl my-auto">
//         <h3
//           className="text-xl sm:text-2xl mb-5 font-serif"
//           style={{ fontFamily: "'DM Serif Display', serif" }}
//         >
//           {editItem ? "Edit Budget" : "Create Budget"}
//         </h3>
//         <div className="space-y-4">
//           <div>
//             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
//               Category Name
//             </label>
//             <input
//               className="w-full border-1.5 border-gray-200 rounded-xl p-3 mt-1 outline-none focus:border-indigo-500 transition-colors"
//               value={form.category}
//               onChange={(e) => setForm({ ...form, category: e.target.value })}
//               placeholder="e.g. Groceries"
//             />
//           </div>
//           <div>
//             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
//               Icon
//             </label>
//             <div className="flex flex-wrap gap-2 mt-2">
//               {icons.map((ic) => (
//                 <button
//                   key={ic}
//                   onClick={() => setForm({ ...form, icon: ic })}
//                   className={`text-xl p-2 rounded-lg border-2 transition-all ${form.icon === ic ? "border-indigo-500 bg-indigo-50" : "border-transparent bg-gray-50"}`}
//                 >
//                   {ic}
//                 </button>
//               ))}
//             </div>
//           </div>
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
//                 Total (UZS)
//               </label>
//               <input
//                 type="number"
//                 className="w-full border-1.5 border-gray-200 rounded-xl p-3 mt-1 outline-none"
//                 value={form.total}
//                 onChange={(e) => setForm({ ...form, total: e.target.value })}
//               />
//             </div>
//             <div>
//               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
//                 Spent (UZS)
//               </label>
//               <input
//                 type="number"
//                 className="w-full border-1.5 border-gray-200 rounded-xl p-3 mt-1 outline-none"
//                 value={form.spent}
//                 onChange={(e) => setForm({ ...form, spent: e.target.value })}
//               />
//             </div>
//           </div>
//         </div>
//         <div className="flex gap-3 mt-8">
//           <button
//             onClick={onClose}
//             className="flex-1 py-3 rounded-xl border-1.5 border-gray-200 font-semibold text-sm"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={() => {
//               if (form.category && form.total)
//                 onSave({
//                   ...form,
//                   total: Number(form.total),
//                   spent: Number(form.spent) || 0,
//                 });
//             }}
//             className="flex-1 py-3 rounded-xl bg-[#1D3557] text-white font-semibold text-sm"
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function Budget() {
//   const [budgets, setBudgets] = useState(initialBudgets);
//   const [page, setPage] = useState(1);
//   const [showModal, setShowModal] = useState(false);
//   const [editItem, setEditItem] = useState(null);
//   const [deleteConfirm, setDeleteConfirm] = useState(null);

//   const totalBudget = budgets.reduce((s, b) => s + b.total, 0);
//   const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
//   const overspent = budgets
//     .filter((b) => b.spent > b.total)
//     .reduce((s, b) => s + (b.spent - b.total), 0);
//   const spentPct =
//     totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

//   const totalPages = Math.ceil(budgets.length / ITEMS_PER_PAGE);
//   const paginated = budgets.slice(
//     (page - 1) * ITEMS_PER_PAGE,
//     page * ITEMS_PER_PAGE,
//   );

//   const handleSave = (form) => {
//     if (editItem) {
//       setBudgets(
//         budgets.map((b) => (b.id === editItem.id ? { ...b, ...form } : b)),
//       );
//     } else {
//       setBudgets([...budgets, { ...form, id: Date.now() }]);
//     }
//     setShowModal(false);
//     setEditItem(null);
//   };

//   const handleDelete = (id) => {
//     const updated = budgets.filter((b) => b.id !== id);
//     setBudgets(updated);
//     setDeleteConfirm(null);
//     const newTotalPages = Math.ceil(updated.length / ITEMS_PER_PAGE);
//     if (page > newTotalPages) setPage(Math.max(1, newTotalPages));
//   };

//   return (
//     <div>
//       <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//           <h3 className="text-base sm:text-base md:text-2xl lg:text-2xl 2xl:text-3xl font-medium text-[#1F2937]">
//             My Budget Summary
//           </h3>
//           <button
//             onClick={() => {
//               setEditItem(null);
//               setShowModal(true);
//             }}
//             className="w-full sm:w-auto bg-[#1D3557] text-white  px-4 py-2 sm:px-5 sm:py-3 md:px-6 md:py-3  rounded-xl font-medium text-[13px] sm:text-[14px] md:text-sm flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 hover:opacity-90 transition-opacity"
//           >
//             <span className="text-[16px] sm:text-[18px] md:text-lg">+</span>{" "}
//             Create Budget
//           </button>
//         </div>

//         {/* Summary Cards - Grid for Responsiveness */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
//           <WaveCard
//             value={totalBudget}
//             label="Total Budget"
//             colorClass="#3B82F6"
//             bgClass="bg-blue-50"
//             textClass="text-blue-700"
//           />
//           <WaveCard
//             value={totalSpent}
//             label={`${spentPct}% Spent`}
//             colorClass="#10B981"
//             bgClass="bg-green-50"
//             textClass="text-green-600"
//           />
//           <WaveCard
//             value={overspent}
//             label="Overspent"
//             colorClass="#EF4444"
//             bgClass="bg-red-50"
//             textClass="text-red-500"
//           />
//           <WaveCard
//             value={Math.max(totalBudget - totalSpent, 0)}
//             label="Left to Spend"
//             colorClass="#6366F1"
//             bgClass="bg-indigo-50"
//             textClass="text-indigo-600"
//           />
//         </div>

//         {/* Table/List Area */}
//         <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
//           <div className="p-5 border-b border-gray-50">
//             <h3 className="text-lg font-medium text-[#1F2937]">My Budgets</h3>
//           </div>

//           {/* Desktop Table Header */}
//           <div className="hidden md:grid grid-cols-[2fr_1.2fr_1.2fr_1.2fr_80px] gap-4 px-6 py-3 bg-gray-50/50 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
//             <span>Category</span>
//             <span>Spent</span>
//             <span>Remaining</span>
//             <span>Total</span>
//             <span className="text-right">Action</span>
//           </div>

//           {/* Items */}
//           <div className="divide-y divide-gray-50">
//             {paginated.map((b) => {
//               const remaining = b.total - b.spent;
//               const pct = Math.round((b.spent / b.total) * 100);
//               const isOver = b.spent > b.total;

//               return (
//                 <div
//                   key={b.id}
//                   className="p-4 sm:px-6 sm:py-5 hover:bg-gray-50/30 transition-colors"
//                 >
//                   {/* Mobile Layout (Visible on Small Screens) */}
//                   <div className="flex md:hidden flex-col gap-3">
//                     <div className="flex justify-between items-start">
//                       <div className="flex gap-3">
//                         <span className="text-2xl bg-gray-50 p-2 rounded-xl h-fit">
//                           {b.icon}
//                         </span>
//                         <div>
//                           <div className="font-bold text-sm text-gray-800">
//                             {b.category}
//                           </div>
//                           <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
//                             {pct}% of {fmt(b.total)}
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex gap-1">
//                         <button
//                           onClick={() => {
//                             setEditItem(b);
//                             setShowModal(true);
//                           }}
//                           className="p-2 text-gray-400"
//                         >
//                           <svg
//                             width="16"
//                             height="16"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                             viewBox="0 0 24 24"
//                           >
//                             <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
//                           </svg>
//                         </button>
//                         <button
//                           onClick={() => setDeleteConfirm(b.id)}
//                           className="p-2 text-gray-400"
//                         >
//                           <svg
//                             width="16"
//                             height="16"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                             viewBox="0 0 24 24"
//                           >
//                             <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
//                           </svg>
//                         </button>
//                       </div>
//                     </div>
//                     <div className="space-y-1">
//                       <div className="flex justify-between text-xs font-medium">
//                         <span className="text-gray-500">
//                           Spent: {fmt(b.spent)}
//                         </span>
//                         <span
//                           className={isOver ? "text-red-500" : "text-green-600"}
//                         >
//                           {isOver ? "Over" : "Left"}: {fmt(Math.abs(remaining))}
//                         </span>
//                       </div>
//                       <ProgressBar pct={pct} color={b.color} />
//                     </div>
//                   </div>

//                   {/* Desktop Layout (Hidden on Mobile) */}
//                   <div className="hidden md:grid grid-cols-[2fr_1.2fr_1.2fr_1.2fr_80px] gap-4 items-center">
//                     <div className="flex items-center gap-3">
//                       <span className="text-2xl bg-gray-50 p-2 rounded-xl">
//                         {b.icon}
//                       </span>
//                       <div className="min-w-0">
//                         <div className="font-bold text-sm text-gray-800 truncate">
//                           {b.category}
//                         </div>
//                         <div className="w-24 mt-1.5">
//                           <ProgressBar pct={pct} color={b.color} />
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-sm font-bold">
//                       {fmt(b.spent)}{" "}
//                       <span className="text-[10px] text-gray-300">UZS</span>
//                     </div>
//                     <div
//                       className={`text-sm font-bold ${isOver ? "text-red-500" : "text-slate-700"}`}
//                     >
//                       {isOver ? "-" : ""}
//                       {fmt(remaining)}{" "}
//                       <span className="text-[10px] text-gray-300">UZS</span>
//                     </div>
//                     <div className="text-sm font-bold">
//                       {fmt(b.total)}{" "}
//                       <span className="inline-block ml-1 bg-indigo-50 text-indigo-500 text-[10px] px-1.5 py-0.5 rounded">
//                         {pct}%
//                       </span>
//                     </div>
//                     <div className="flex justify-end gap-1">
//                       <button
//                         onClick={() => {
//                           setEditItem(b);
//                           setShowModal(true);
//                         }}
//                         className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                       >
//                         <svg
//                           width="14"
//                           height="14"
//                           fill="none"
//                           stroke="#6B7280"
//                           strokeWidth="2"
//                           viewBox="0 0 24 24"
//                         >
//                           <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
//                         </svg>
//                       </button>
//                       <button
//                         onClick={() => setDeleteConfirm(b.id)}
//                         className="p-2 hover:bg-red-50 rounded-lg transition-colors"
//                       >
//                         <svg
//                           width="14"
//                           height="14"
//                           fill="none"
//                           stroke="#6B7280"
//                           strokeWidth="2"
//                           viewBox="0 0 24 24"
//                         >
//                           <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
//                         </svg>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Pagination */}
//           <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
//             <span className="text-xs font-medium text-gray-400">
//               Page {page} of {totalPages}
//             </span>
//             <div className="flex gap-2">
//               <button
//                 disabled={page === 1}
//                 onClick={() => setPage(page - 1)}
//                 className="px-4 py-2 rounded-lg border border-gray-100 text-xs font-bold disabled:opacity-30"
//               >
//                 Prev
//               </button>
//               <button
//                 disabled={page === totalPages}
//                 onClick={() => setPage(page + 1)}
//                 className="px-4 py-2 rounded-lg bg-[#1D3557] text-white text-xs font-bold disabled:opacity-30"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {showModal && (
//         <Modal
//           onClose={() => {
//             setShowModal(false);
//             setEditItem(null);
//           }}
//           onSave={handleSave}
//           editItem={editItem}
//         />
//       )}

//       {deleteConfirm && (
//         <div className="fixed inset-0 bg-black/40 z-60 flex items-center justify-center p-4">
//           <div className="bg-white rounded-3xl p-8 w-full max-w-85 text-center shadow-2xl">
//             <div className="text-4xl mb-4">🗑️</div>
//             <h3
//               className="text-xl font-serif mb-2"
//               style={{ fontFamily: "'DM Serif Display', serif" }}
//             >
//               Delete Budget?
//             </h3>
//             <p className="text-sm text-gray-500 mb-6">
//               This category will be permanently removed.
//             </p>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setDeleteConfirm(null)}
//                 className="flex-1 py-3 rounded-xl border border-gray-100 font-bold text-xs"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => handleDelete(deleteConfirm)}
//                 className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-xs"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
