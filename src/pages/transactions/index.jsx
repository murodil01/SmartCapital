import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, Tag, X } from "lucide-react";

const INITIAL_TRANSACTIONS = [
  {
    id: 1,
    date: "2025-06-05",
    category: "Food",
    description: "Lunch",
    account: "Uzcard",
    accountColor: "#3b82f6",
    amount: -120000,
    type: "expense",
  },
  {
    id: 2,
    date: "2025-06-05",
    category: "Salary",
    description: "April Salary",
    account: "Humo",
    accountColor: "#f97316",
    amount: 1000000,
    type: "income",
  },
  {
    id: 3,
    date: "2025-06-04",
    category: "Transfer",
    description: "—",
    account: "Uzcard → Cash",
    accountColor: "#3b82f6",
    amount: 300000,
    type: "transfer",
  },
  {
    id: 4,
    date: "2025-06-03",
    category: "Store",
    description: "Korzinka",
    account: "Cash",
    accountColor: "#22c55e",
    amount: -215000,
    type: "expense",
  },
  {
    id: 5,
    date: "2025-06-06",
    category: "Food",
    description: "Lunch",
    account: "Visa",
    accountColor: "#a855f7",
    amount: -120000,
    type: "expense",
  },
  {
    id: 6,
    date: "2025-06-06",
    category: "Food",
    description: "Lunch",
    account: "Visa",
    accountColor: "#a855f7",
    amount: -120000,
    type: "expense",
  },
  {
    id: 7,
    date: "2025-06-06",
    category: "Food",
    description: "Lunch",
    account: "Visa",
    accountColor: "#a855f7",
    amount: -120000,
    type: "expense",
  },
  {
    id: 8,
    date: "2025-06-06",
    category: "Food",
    description: "Lunch",
    account: "Visa",
    accountColor: "#a855f7",
    amount: -120000,
    type: "expense",
  },
  {
    id: 9,
    date: "2025-06-02",
    category: "Transport",
    description: "Taxi",
    account: "Cash",
    accountColor: "#22c55e",
    amount: -35000,
    type: "expense",
  },
  {
    id: 10,
    date: "2025-06-01",
    category: "Internet",
    description: "Monthly bill",
    account: "Uzcard",
    accountColor: "#3b82f6",
    amount: -80000,
    type: "expense",
  },
  {
    id: 11,
    date: "2025-05-30",
    category: "Salary",
    description: "Bonus",
    account: "Humo",
    accountColor: "#f97316",
    amount: 500000,
    type: "income",
  },
  {
    id: 12,
    date: "2025-05-28",
    category: "Food",
    description: "Dinner",
    account: "Visa",
    accountColor: "#a855f7",
    amount: -95000,
    type: "expense",
  },
  {
    id: 13,
    date: "2025-05-27",
    category: "Store",
    description: "Clothes",
    account: "Visa",
    accountColor: "#a855f7",
    amount: -320000,
    type: "expense",
  },
  {
    id: 14,
    date: "2025-05-25",
    category: "Transfer",
    description: "To Uzcard",
    account: "Cash → Uzcard",
    accountColor: "#22c55e",
    amount: 200000,
    type: "transfer",
  },
  {
    id: 15,
    date: "2025-05-20",
    category: "Food",
    description: "Groceries",
    account: "Cash",
    accountColor: "#22c55e",
    amount: -180000,
    type: "expense",
  },
];

const CATEGORIES = [
  "Food",
  "Salary",
  "Transfer",
  "Store",
  "Transport",
  "Internet",
];
const ACCOUNTS = ["Uzcard", "Humo", "Cash", "Visa"];
const PAGE_SIZE = 8;

const fmt = (n) => Math.abs(n).toLocaleString("ru-RU").replace(/,/g, " ");

const Modal = ({ title, onClose, onSave, initial }) => {
  const [form, setForm] = useState(
    initial || {
      date: new Date().toISOString().slice(0, 10),
      category: "Food",
      description: "",
      account: "Uzcard",
      amount: "",
      type: "expense",
    },
  );

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-[16px] font-bold text-gray-900">{title}</h3>
          <button onClick={onClose}>
            <X size={18} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            {["expense", "income", "transfer"].map((t) => (
              <button
                key={t}
                onClick={() => set("type", t)}
                className={`flex-1 py-2 rounded-xl text-[12px] font-semibold capitalize transition-colors ${form.type === t ? (t === "expense" ? "bg-red-500 text-white" : t === "income" ? "bg-green-600 text-white" : "bg-blue-700 text-white") : "bg-gray-100 text-gray-500"}`}
              >
                {t}
              </button>
            ))}
          </div>
          <input
            type="date"
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={form.account}
            onChange={(e) => set("account", e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {ACCOUNTS.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Amount (UZS)"
            value={form.amount}
            onChange={(e) => set("amount", e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-[13px] text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="flex-1 py-2.5 rounded-xl bg-blue-700 text-white text-[13px] font-semibold hover:bg-blue-800"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const accountColorMap = {
  Uzcard: "#3b82f6",
  Humo: "#f97316",
  Cash: "#22c55e",
  Visa: "#a855f7",
};

const Transactions = () => {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [tab, setTab] = useState("all");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null); // null | "add-expense" | "add-income" | "add-transfer" | {edit: tx}
  const [editTx, setEditTx] = useState(null);
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    category: "",
    account: "",
    amountMin: "",
    amountMax: "",
  });

  const setFilter = (k, v) => {
    setFilters((f) => ({ ...f, [k]: v }));
    setPage(1);
  };

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (
        tab !== "all" &&
        tx.type !== tab.slice(0, -1) &&
        !(tab === "transfers" && tx.type === "transfer")
      )
        return false;
      if (tab === "expenses" && tx.type !== "expense") return false;
      if (tab === "income" && tx.type !== "income") return false;
      if (tab === "transfers" && tx.type !== "transfer") return false;
      if (filters.category && tx.category !== filters.category) return false;
      if (filters.account && !tx.account.includes(filters.account))
        return false;
      if (filters.dateFrom && tx.date < filters.dateFrom) return false;
      if (filters.dateTo && tx.date > filters.dateTo) return false;
      if (filters.amountMin && Math.abs(tx.amount) < Number(filters.amountMin))
        return false;
      if (filters.amountMax && Math.abs(tx.amount) > Number(filters.amountMax))
        return false;
      return true;
    });
  }, [transactions, tab, filters]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleAdd = (type) => {
    setEditTx(null);
    setModal(type);
  };

  const handleEdit = (tx) => {
    setEditTx(tx);
    setModal("edit");
  };

  const handleDelete = (id) => {
    setTransactions((t) => t.filter((tx) => tx.id !== id));
  };

  const handleSave = (form) => {
    const amt = Number(form.amount);
    const finalAmt = form.type === "expense" ? -Math.abs(amt) : Math.abs(amt);
    if (modal === "edit" && editTx) {
      setTransactions((t) =>
        t.map((tx) =>
          tx.id === editTx.id
            ? {
                ...tx,
                ...form,
                amount: finalAmt,
                accountColor: accountColorMap[form.account] || "#3b82f6",
              }
            : tx,
        ),
      );
    } else {
      setTransactions((t) => [
        {
          id: Date.now(),
          ...form,
          amount: finalAmt,
          accountColor: accountColorMap[form.account] || "#3b82f6",
        },
        ...t,
      ]);
    }
    setModal(null);
    setPage(1);
  };

  const modalTitle =
    modal === "edit"
      ? "Edit Transaction"
      : modal === "add-expense"
        ? "Add Expense"
        : modal === "add-income"
          ? "Add Income"
          : "Add Transfer";

  const modalInitial =
    modal === "edit" && editTx
      ? { ...editTx, amount: Math.abs(editTx.amount) }
      : modal === "add-expense"
        ? {
            date: new Date().toISOString().slice(0, 10),
            category: "Food",
            description: "",
            account: "Uzcard",
            amount: "",
            type: "expense",
          }
        : modal === "add-income"
          ? {
              date: new Date().toISOString().slice(0, 10),
              category: "Salary",
              description: "",
              account: "Humo",
              amount: "",
              type: "income",
            }
          : {
              date: new Date().toISOString().slice(0, 10),
              category: "Transfer",
              description: "",
              account: "Cash",
              amount: "",
              type: "transfer",
            };

  return (
    <div className="shadow-sm bg-white p-5 border border-[#E0E0E0] rounded-2xl flex flex-col gap-5">
      {modal && (
        <Modal
          title={modalTitle}
          onClose={() => setModal(null)}
          onSave={handleSave}
          initial={modalInitial}
        />
      )}

      {/* Header - responsive */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h3 className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-bold text-gray-900">
          My Transactions
        </h3>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto flex-wrap">
          <button
            onClick={() => handleAdd("add-expense")}
            className="flex items-center justify-center gap-1.5 px-4 py-2 sm:py-2.5 bg-red-500 hover:bg-red-600 text-white text-[13px] sm:text-[14px] font-semibold rounded-xl transition-colors whitespace-nowrap"
          >
            <Plus size={14} /> Add Expense
          </button>

          <button
            onClick={() => handleAdd("add-income")}
            className="flex items-center justify-center gap-1.5 px-4 py-2 sm:py-2.5 bg-green-600 hover:bg-green-700 text-white text-[13px] sm:text-[14px] font-semibold rounded-xl transition-colors whitespace-nowrap"
          >
            <Plus size={14} /> Add Income
          </button>

          <button
            onClick={() => handleAdd("add-transfer")}
            className="flex items-center justify-center gap-1.5 px-4 py-2 sm:py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-[13px] sm:text-[14px] font-semibold rounded-xl transition-colors whitespace-nowrap"
          >
            <Plus size={14} /> Transfer
          </button>
        </div>
      </div>

      {/* Tabs - responsive */}
      <div className="flex gap-2 flex-wrap">
        {[
          ["all", "All"],
          ["expenses", "Expenses"],
          ["income", "Income"],
          ["transfers", "Transfers"],
        ].map(([val, label]) => (
          <button
            key={val}
            onClick={() => {
              setTab(val);
              setPage(1);
            }}
            className={`px-3 sm:px-4 py-2 rounded-full text-[12px] sm:text-[13px] font-medium transition-colors whitespace-nowrap ${
              tab === val
                ? "bg-blue-900 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Filters - responsive */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-[#212121] font-medium mb-1 block">
              Date
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => {
                setFilter("dateFrom", e.target.value);
                setFilter("dateTo", e.target.value);
              }}
              className="w-full text-[#25282C] text-[13px] sm:text-[14px] md:text-[15px] lg:text-[17px] border border-gray-200 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-[#212121] font-medium mb-1 block">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilter("category", e.target.value)}
              className="w-full text-[#25282C] border border-gray-200 rounded-[10px] px-3 py-2 text-[13px] sm:text-[14px] md:text-[15px] lg:text-[17px] focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-[#212121] font-medium mb-1 block">
              Account
            </label>
            <select
              value={filters.account}
              onChange={(e) => setFilter("account", e.target.value)}
              className="w-full border border-gray-200 rounded-[10px] px-3 py-2 text-[#25282C] text-[13px] sm:text-[14px] md:text-[15px] lg:text-[17px] focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Account</option>
              {ACCOUNTS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-[#212121] font-medium mb-1 block">
              Amount
            </label>
            <input
              type="number"
              placeholder="Enter amount"
              value={filters.amountMin}
              onChange={(e) => {
                const val = e.target.value;
                setFilter("amountMin", val);
                setFilter("amountMax", val);
              }}
              className="w-full border border-gray-200 rounded-[10px] px-3 py-2 text-[#25282C] text-[13px] sm:text-[14px] md:text-[15px] lg:text-[17px] focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
        {(filters.category ||
          filters.account ||
          filters.dateFrom ||
          filters.amountMin) && (
          <button
            onClick={() =>
              setFilters({
                dateFrom: "",
                dateTo: "",
                category: "",
                account: "",
                amountMin: "",
                amountMax: "",
              })
            }
            className="mt-3 text-[13px] sm:text-[14px] md:text-[15px] lg:text-[17px] text-red-400 hover:text-red-600 flex items-center gap-1"
          >
            <X size={12} /> Clear filters
          </button>
        )}
      </div>

      {/* Desktop Table (md va katta) */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <h3 className="text-[15px] font-semibold text-gray-800">
            Expense Transactions
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-200">
            <thead>
              <tr className="bg-blue-900">
                {[
                  "Date",
                  "Category",
                  "Description",
                  "Account",
                  "Amount",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-white text-[12px] font-semibold whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center 20-10 text-[#212121] text-[13px]"
                  >
                    No transactions found
                  </td>
                </tr>
              ) : (
                paginated.map((tx, i) => (
                  <tr
                    key={tx.id}
                    className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                      i % 2 === 0 ? "" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="px-4 py-3 text-[12px] text-gray-600 whitespace-nowrap">
                      {tx.date}
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-[12px] text-gray-700 whitespace-nowrap">
                        <Tag size={12} className="text-gray-400" />{" "}
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-gray-500 max-w-50 truncate">
                      {tx.description || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-[12px] text-gray-700 whitespace-nowrap">
                        <span
                          className="w-3 h-3 rounded-sm inline-block shrink-0"
                          style={{ background: tx.accountColor }}
                        />
                        {tx.account}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[12px] font-bold whitespace-nowrap ${
                          tx.amount > 0 ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {tx.amount > 0 ? "+" : "-"}
                        {fmt(tx.amount)}{" "}
                        <span className="text-[10px] font-normal text-gray-400">
                          UZS
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(tx)}
                          className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards (md dan kichik) */}
      <div className="md:hidden space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-gray-800">
            Expense Transactions
          </h3>
          <span className="text-[11px] text-gray-400">
            {filtered.length} transactions
          </span>
        </div>

        {paginated.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-[13px] bg-white rounded-2xl border border-gray-100">
            No transactions found
          </div>
        ) : (
          paginated.map((tx) => (
            <div
              key={tx.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                    {tx.date}
                  </span>
                  <span
                    className={`text-[11px] font-medium px-2 py-1 rounded-lg ${
                      tx.amount > 0
                        ? "bg-green-50 text-green-600"
                        : tx.type === "transfer"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-red-50 text-red-500"
                    }`}
                  >
                    {tx.type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(tx)}
                    className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(tx.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[13px] text-gray-700">
                    <Tag size={14} className="text-gray-400" />
                    {tx.category}
                  </span>
                  <span
                    className={`text-[15px] font-bold ${
                      tx.amount > 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {tx.amount > 0 ? "+" : "-"}
                    {fmt(tx.amount)}
                  </span>
                </div>

                {tx.description && tx.description !== "—" && (
                  <p className="text-[12px] text-gray-500">{tx.description}</p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                  <span className="flex items-center gap-1.5 text-[12px] text-gray-700">
                    <span
                      className="w-3 h-3 rounded-sm"
                      style={{ background: tx.accountColor }}
                    />
                    {tx.account}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {tx.amount > 0
                      ? "Income"
                      : tx.type === "transfer"
                        ? "Transfer"
                        : "Expense"}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination - responsive */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100">
        <span className="text-[12px] text-gray-400 order-2 sm:order-1">
          Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–
          {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
        </span>

        <div className="flex items-center gap-1 order-1 sm:order-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-2 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-[12px] text-gray-500 hover:bg-gray-100 disabled:opacity-40"
          >
            ←
          </button>

          <div className="flex items-center gap-1">
            {Array.from(
              { length: Math.min(totalPages, 3) },
              (_, i) => i + 1,
            ).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg text-[11px] sm:text-[12px] font-medium transition-colors ${
                  page === p
                    ? "bg-blue-700 text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            ))}

            {totalPages > 3 && (
              <>
                <span className="text-gray-400 text-[11px] sm:text-[12px]">
                  ...
                </span>
                <button
                  onClick={() => setPage(totalPages)}
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg text-[11px] sm:text-[12px] font-medium transition-colors ${
                    page === totalPages
                      ? "bg-blue-700 text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-2 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-[12px] text-gray-500 hover:bg-gray-100 disabled:opacity-40"
          >
            →
          </button>
        </div>

        <span className="text-[11px] sm:text-[12px] text-gray-400 order-3">
          Page {page}/{totalPages}
        </span>
      </div>
    </div>
  );
};

export default Transactions;
