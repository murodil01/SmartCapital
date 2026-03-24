import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Plus,
  MoreVertical,
  CreditCard,
  X,
  Building2,
  Hash,
  Banknote,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { accountsAPI } from "../../api/accounts";
import { message } from "antd";

const fmt = (n) => {
  // Katta sonlarni formatlash (string yoki number bo'lishi mumkin)
  const num = typeof n === "string" ? parseFloat(n) : n;
  return Math.abs(num).toLocaleString("ru-RU").replace(/,/g, " ");
};

const accountColors = [
  { from: "from-blue-500 to-blue-700", bg: "#3b82f6" },
  { from: "from-orange-400 to-orange-600", bg: "#f97316" },
  { from: "from-green-400 to-green-600", bg: "#22c55e" },
  { from: "from-purple-500 to-purple-700", bg: "#a855f7" },
  { from: "from-gray-700 to-gray-900", bg: "#374151" },
  { from: "from-red-500 to-red-700", bg: "#ef4444" },
  { from: "from-yellow-500 to-yellow-700", bg: "#eab308" },
  { from: "from-pink-500 to-pink-700", bg: "#ec4899" },
];

// Account tipi uchun ikonka va nom
const getTypeIcon = (type) => {
  switch (type) {
    case "CASH":
      return <Banknote size={14} className="text-white/70" />;
    default:
      return <CreditCard size={14} className="text-white/70" />;
  }
};

const WavePattern = () => (
  <svg
    className="absolute bottom-0 left-0 right-0 w-full opacity-20"
    viewBox="0 0 400 80"
    preserveAspectRatio="none"
  >
    <path
      d="M0,40 C50,10 100,70 150,40 C200,10 250,70 300,40 C350,10 380,60 400,40 L400,80 L0,80 Z"
      fill="white"
    />
    <path
      d="M0,55 C60,25 120,75 180,50 C240,25 300,75 360,50 C380,40 395,55 400,50 L400,80 L0,80 Z"
      fill="white"
      opacity="0.5"
    />
  </svg>
);

const AccountCard = ({ account, onEdit, onDelete, onToggleHide }) => {
  const [hidden, setHidden] = useState(false);
  const currentBalance = parseFloat(account.current_balance) || 0;

  // Account nomini aniqlash (bank_name yoki name dan)
  const displayName = account.bank_name || account.name || "Account";

  // Account raqamini qisqartirish
  const shortAccountNumber = account.account_number
    ? `•••• ${account.account_number.slice(-4)}`
    : "";

  const handleToggle = (e) => {
    e.stopPropagation();
    const newHidden = !hidden;
    setHidden(newHidden);
    onToggleHide(account.id, newHidden);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(account);
  };

  return (
    <div
      className={`relative bg-linear-to-br ${account.color} rounded-2xl p-4 overflow-hidden cursor-pointer select-none group`}
      style={{ minHeight: 160 }}
    >
      <WavePattern />
      <div className="relative z-10 flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold text-[14px]">
            {displayName}
          </span>
          <button onClick={handleToggle}>
            {hidden ? (
              <EyeOff size={14} className="text-white/70" />
            ) : (
              <Eye size={14} className="text-white/70" />
            )}
          </button>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEditClick}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <MoreVertical
              size={16}
              className="text-white/70 hover:text-white"
            />
          </button>
        </div>
      </div>

      {/* Bank va branch ma'lumotlari */}
      {(account.branch_name || shortAccountNumber) && (
        <div className="relative z-10 mb-2">
          {account.branch_name && (
            <div className="flex items-center gap-1">
              <Building2 size={10} className="text-white/50" />
              <span className="text-white/50 text-[9px]">
                {account.branch_name}
              </span>
            </div>
          )}
          {shortAccountNumber && (
            <div className="flex items-center gap-1">
              <Hash size={10} className="text-white/50" />
              <span className="text-white/50 text-[9px]">
                {shortAccountNumber}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Balance */}
      <div className="relative z-10 mb-3">
        {hidden ? (
          <span className="text-white text-[18px] font-bold tracking-widest">
            •••••
          </span>
        ) : (
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-white text-[20px] font-bold tracking-tight">
                {fmt(currentBalance)}
              </span>
              <span className="text-white/60 text-[11px]">
                {account.currency || "UZS"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Account type va delete button */}
      <div className="relative z-10 flex justify-between items-center">
        <div className="flex items-center gap-1">
          {getTypeIcon(account.type)}
          <span className="text-white/60 text-[9px] font-medium">
            {account.type || "ACCOUNT"}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(account.id); // oldingi handleDeleteAccount o‘rniga
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-white/50 hover:text-red-300 text-[10px]"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

// Add/Edit Account Modal
const AccountModal = ({ visible, onClose, onSave, initialData, loading }) => {
  const [form, setForm] = useState({
    name: "",
    type: "CASH",
    currency: "UZS",
    bank_name: "",
    branch_name: "",
    account_number: "",
    initial_balance: "",
  });

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setForm({
          name: initialData?.name || "",
          type: initialData?.type || "CASH",
          currency: initialData?.currency || "UZS",
          bank_name: initialData?.bank_name || "",
          branch_name: initialData?.branch_name || "",
          account_number: initialData?.account_number || "",
          initial_balance: initialData?.initial_balance?.toString() || "",
        });
      }, 0);

      return () => clearTimeout(timer); // cleanup
    }
  }, [initialData, visible]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-[16px] font-bold text-gray-900">
            {initialData ? "Edit Account" : "Add Account"}
          </h3>
          <button onClick={onClose}>
            <X size={18} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[13px] font-medium text-gray-700 mb-1 block">
              Account Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g. My Main Account"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="text-[13px] font-medium text-gray-700 mb-1 block">
              Account Type
            </label>
            <select
              value={form.type}
              onChange={(e) => handleChange("type", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="CASH">CASH</option>
              <option value="BANK_ACCOUNT">BANK ACCOUNT</option>
              <option value="CARD">CARD</option>
              <option value="EWALLET">EWALLET</option>
            </select>
          </div>

          <div>
            <label className="text-[13px] font-medium text-gray-700 mb-1 block">
              Currency
            </label>
            <input
              type="text"
              value={form.currency}
              onChange={(e) => handleChange("currency", e.target.value)}
              placeholder="UZS"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="text-[13px] font-medium text-gray-700 mb-1 block">
              Bank Name
            </label>
            <input
              type="text"
              value={form.bank_name}
              onChange={(e) => handleChange("bank_name", e.target.value)}
              placeholder="e.g. Xalq Bank"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="text-[13px] font-medium text-gray-700 mb-1 block">
              Branch Name
            </label>
            <input
              type="text"
              value={form.branch_name}
              onChange={(e) => handleChange("branch_name", e.target.value)}
              placeholder="e.g. Chilonzor branch"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="text-[13px] font-medium text-gray-700 mb-1 block">
              Account Number
            </label>
            <input
              type="text"
              value={form.account_number}
              onChange={(e) => handleChange("account_number", e.target.value)}
              placeholder="e.g. 2020 1234 5678 9012"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="text-[13px] font-medium text-gray-700 mb-1 block">
              Initial Balance <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={form.initial_balance}
              onChange={(e) => handleChange("initial_balance", e.target.value)}
              placeholder="0"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        </div>

        <div className="flex gap-2 mt-5  bg-white py-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-[13px] text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!form.name || !form.initial_balance) {
                message.error("Please fill required fields");
                return;
              }
              onSave(form);
            }}
            disabled={loading}
            className={`flex-1 py-2.5 rounded-xl bg-blue-700 text-white text-[13px] font-semibold hover:bg-blue-800 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);

  // Fetch accounts from backend
  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const data = await accountsAPI.getAll();

      // Backenddan kelgan ma'lumotlarni frontend formatiga moslashtirish
      const formattedAccounts = data.map((acc, index) => ({
        ...acc,
        color: accountColors[index % accountColors.length].from,
        bg: accountColors[index % accountColors.length].bg,
        current_balance: acc.current_balance || acc.initial_balance || "0",
      }));

      setAccounts(formattedAccounts);
    } catch (error) {
      message.error(error.message || "Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Total balanceni hisoblash
  const total = accounts.reduce((s, a) => {
    const balance = parseFloat(a.current_balance || a.initial_balance || 0);
    return s + balance;
  }, 0);

  // Pie chart uchun ma'lumot
  const pieData = accounts
    .map((a) => {
      const balance = parseFloat(a.current_balance || a.initial_balance || 0);
      const displayName = a.bank_name || a.name || "Account";
      return {
        name: `${displayName} (${a.currency || "UZS"})`,
        value: Math.abs(balance),
        color: a.bg,
      };
    })
    .filter((item) => item.value > 0);

  const handleAddAccount = () => {
    setEditingAccount(null);
    setModalVisible(true);
  };

  const handleEditAccount = (account) => {
    setEditingAccount(account);
    setModalVisible(true);
  };

  const handleDeleteAccount = (id) => {
    setAccountToDelete(id);
    setDeleteModalVisible(true);
  };

  const confirmDeleteAccount = async () => {
    if (!accountToDelete) return;

    setDeleteLoading(true);
    try {
      await accountsAPI.delete(accountToDelete);
      setAccounts((prev) => prev.filter((acc) => acc.id !== accountToDelete));
      message.success("Account deleted successfully");
      setDeleteModalVisible(false);
    } catch (error) {
      message.error(error.error || "Failed to delete account");
    } finally {
      setDeleteLoading(false);
      setAccountToDelete(null);
    }
  };

  const handleSaveAccount = async (formData) => {
    setModalLoading(true);
    try {
      const accountData = {
        name: formData.name,
        type: formData.type,
        currency: formData.currency,
        bank_name: formData.bank_name,
        branch_name: formData.branch_name,
        account_number: formData.account_number,
        initial_balance: formData.initial_balance,
      };

      if (editingAccount) {
        // Update (PATCH)
        const updated = await accountsAPI.update(
          editingAccount.id,
          accountData,
        );

        setAccounts((prev) =>
          prev.map((acc) =>
            acc.id === editingAccount.id
              ? {
                  ...acc,
                  ...updated,
                  color: acc.color,
                  bg: acc.bg,
                  current_balance:
                    updated.current_balance || updated.initial_balance,
                }
              : acc,
          ),
        );
        message.success("Account updated successfully");
      } else {
        // Create (POST)
        const newAccount = await accountsAPI.create(accountData);

        const colorIndex = accounts.length % accountColors.length;
        setAccounts((prev) => [
          ...prev,
          {
            ...newAccount,
            color: accountColors[colorIndex].from,
            bg: accountColors[colorIndex].bg,
            current_balance:
              newAccount.current_balance || newAccount.initial_balance,
          },
        ]);
        message.success("Account added successfully");
      }
      setModalVisible(false);
    } catch (error) {
      message.error(error.error || "Failed to save account");
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleHide = () => {};

  if (loading) {
    return (
      <div className="shadow-sm bg-white p-5 border border-[#E0E0E0] rounded-2xl flex flex-col gap-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="shadow-sm bg-white p-5 border border-[#E0E0E0] rounded-2xl flex flex-col gap-6">
      {/* Account Modal */}
      <AccountModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveAccount}
        initialData={editingAccount}
        loading={modalLoading}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-bold text-gray-900">
          Total Balance
        </h3>
        <button
          onClick={handleAddAccount}
          disabled={deleteLoading}
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-[13px] font-medium px-4 py-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={15} /> Add Account
        </button>
      </div>

      {/* Total Balance Card */}
      <div
        className=" rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 60%, #e8f4fd 100%)",
        }}
      >
        <div className="flex flex-col md:flex-row">
          {/* Balance Info */}
          <div className="relative p-6 flex-1 overflow-hidden">
            <WavePattern />

            <div className="relative z-10">
              <div className="flex items-center gap-2 text-gray-600 text-[13px] mb-2">
                My Total Balance
                {/* Show / Hide balance */}
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="hover:scale-110 transition-transform cursor-pointer"
                >
                  {showBalance ? (
                    <Eye size={16} className="text-gray-500" />
                  ) : (
                    <EyeOff size={16} className="text-gray-500" />
                  )}
                </button>
              </div>

              {/* Balance */}
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[31px] xl:text-[34px] font-bold text-gray-900 tracking-tight">
                  {showBalance ? fmt(total) : "••••••"}
                </span>

                <span className="text-gray-400 text-[13px]">UZS</span>
              </div>

              <p className="text-gray-400 text-[12px]">
                Across {accounts.length} accounts
              </p>
            </div>
          </div>

          {/* Pie Chart */}
          {pieData.length > 0 && (
            <div className="flex-1 p-4 flex items-center justify-center border-t md:border-t-0 md:border-l border-gray-100">
              {/* MOBILE */}
              <div className="w-full h-42.5 md:hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="45%"
                      outerRadius={55}
                      dataKey="value"
                      labelLine={false}
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>

                    <Tooltip
                      formatter={(val, name) => [`${fmt(val)} UZS`, name]}
                      contentStyle={{
                        borderRadius: 10,
                        fontSize: 12,
                        border: "1px solid #e5e7eb",
                      }}
                    />

                    <Legend
                      layout="horizontal"
                      align="center"
                      verticalAlign="bottom"
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: 10 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* DESKTOP (sizdagi original) */}
              <div className="hidden md:block w-full h-50">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="40%"
                      cy="50%"
                      outerRadius={75}
                      dataKey="value"
                      labelLine={false}
                      label={renderCustomLabel}
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>

                    <Tooltip
                      formatter={(val, name) => [`${fmt(val)} UZS`, name]}
                      contentStyle={{
                        borderRadius: 10,
                        fontSize: 12,
                        border: "1px solid #e5e7eb",
                      }}
                    />

                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      iconType="circle"
                      iconSize={8}
                      formatter={(val) => (
                        <span style={{ fontSize: 11, color: "#6b7280" }}>
                          {val.length > 20 ? val.substring(0, 20) + "..." : val}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* My Accounts */}
      <div>
        <h3 className="text-[16px] font-bold text-gray-900 mb-4">
          My Accounts
        </h3>
        {accounts.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-[13px] bg-white rounded-2xl border border-gray-100">
            No accounts yet. Click "Add Account" to create one.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((acc) => (
              <AccountCard
                key={acc.id}
                account={acc}
                onEdit={handleEditAccount}
                onDelete={handleDeleteAccount}
                onToggleHide={handleToggleHide}
              />
            ))}
          </div>
        )}
      </div>

      {deleteModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Account
              </h3>
              <button onClick={() => setDeleteModalVisible(false)}>
                <X size={18} className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to delete this account? This action cannot
              be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteModalVisible(false)}
                className="flex-1 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAccount}
                disabled={deleteLoading}
                className={`flex-1 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 ${
                  deleteLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
