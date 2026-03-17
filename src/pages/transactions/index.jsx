import { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Tag,
  X,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { expensesAPI } from "../../api/expenses";
import { incomesAPI } from "../../api/incomes";
import { transfersAPI } from "../../api/transfer";
import { message } from "antd";

const CATEGORIES = [
  "Food",
  "Salary",
  "Transfer",
  "Store",
  "Transport",
  "Internet",
];
const PAGE_SIZE = 8;

const fmt = (n) => Math.abs(n).toLocaleString("ru-RU").replace(/,/g, " ");

const accountColorMap = {
  Uzcard: "#3b82f6",
  Humo: "#f97316",
  Cash: "#22c55e",
  Visa: "#a855f7",
};

const Modal = ({ title, onClose, onSave, initial, loading, accounts }) => {
  const [form, setForm] = useState(
    initial || {
      date: new Date().toISOString().slice(0, 10),
      category: "Food",
      description: "",
      account: accounts?.[0] || "Uzcard",
      amount: "",
      type: "expense",
    },
  );

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // Transfer uchun account formatini sozlash
  const getTransferAccountDisplay = () => {
    if (accounts.length >= 2) {
      return `${accounts[0]} → ${accounts[1]}`;
    }
    return "Uzcard → Humo";
  };

  // Type o'zgarganda account va category ni moslash
  useEffect(() => {
    if (form.type === "expense") {
      setForm((f) => ({
        ...f,
        account: accounts[0] || "Uzcard",
        category: f.category === "Salary" ? "Food" : f.category,
      }));
    } else if (form.type === "income") {
      setForm((f) => ({
        ...f,
        account: accounts[1] || accounts[0] || "Humo",
        category: "Salary",
      }));
    } else if (form.type === "transfer") {
      setForm((f) => ({
        ...f,
        account: getTransferAccountDisplay(),
        category: "Transfer",
      }));
    }
  }, [form.type, accounts]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 pb-2">
          <h3 className="text-[16px] font-bold text-gray-900">{title}</h3>
          <button onClick={onClose}>
            <X size={18} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-2 scrollbar-hide">
          {/* Transaction Type Selection */}
          <div className="flex flex-col gap-1.5 mb-3">
            <label className="text-[12px] font-normal text-black">Type</label>
            <div className="flex gap-2">
              {["expense", "income", "transfer"].map((t) => (
                <button
                  key={t}
                  type="button" // form ichida bo'lsa submit bo'lib ketmasligi uchun
                  onClick={() => set("type", t)}
                  className={`flex-1 py-2 rounded-xl text-[12px] font-semibold capitalize transition-all ${
                    form.type === t
                      ? t === "expense"
                        ? "bg-red-500 text-white shadow-md shadow-red-100"
                        : t === "income"
                          ? "bg-green-600 text-white shadow-md shadow-green-100"
                          : "bg-blue-700 text-white shadow-md shadow-blue-100"
                      : "bg-gray-200 text-black hover:bg-gray-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div className="flex flex-col gap-1.5 mb-3">
            <label className="text-[12px] font-normal text-black">Amount</label>
            <div className="relative">
              <input
                type="number"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-3 top-2.5 text-gray-400 text-[12px]">
                UZS
              </span>
            </div>
          </div>

          {/* Date Input */}
          <div className="flex flex-col gap-1.5 mb-3">
            <label className="text-[12px] font-normal text-black ">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Category Select */}
          <div className="flex flex-col gap-1.5 mb-3">
            <label className="text-[12px] font-normal text-black">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {form.type === "income"
                ? ["Salary", "Bonus", "Other"].map((c) => (
                    <option key={c}>{c}</option>
                  ))
                : form.type === "transfer"
                  ? ["Transfer"].map((c) => <option key={c}>{c}</option>)
                  : CATEGORIES.filter(
                      (c) => c !== "Salary" && c !== "Transfer",
                    ).map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Account Select */}
          <div className="flex flex-col gap-1.5 mb-3">
            <label className="text-[12px] font-normal text-black">
              {form.type === "transfer" ? "Transfer Path" : "Account"}
            </label>
            <select
              value={form.account}
              onChange={(e) => set("account", e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >
              {form.type === "transfer"
                ? accounts.flatMap((from) =>
                    accounts
                      .filter((to) => from !== to)
                      .map((to) => {
                        const opt = `${from} → ${to}`;
                        return (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        );
                      }),
                  )
                : accounts.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
            </select>
          </div>
          {/* Description Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-normal text-black">
              Description
            </label>
            <input
              placeholder="Add a note"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="flex gap-2 p-6 pt-2 border-t border-gray-50">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-[13px] text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
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

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [tab, setTab] = useState("all");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [editTx, setEditTx] = useState(null);
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    category: "",
    account: "",
    amountMin: "",
    amountMax: "",
  });

  // Dynamic account mapping
  const [accountMapping, setAccountMapping] = useState({
    idToName: {},
    nameToId: {},
    accountList: ["Uzcard", "Humo", "Cash", "Visa"], // Default
  });

  // Account ID dan name olish (dynamic)
  const getAccountNameById = (accountId) => {
    if (!accountId && accountId !== 0) return "Unknown";

    const id =
      typeof accountId === "string" ? parseInt(accountId, 10) : accountId;
    let name =
      accountMapping.idToName[id] || accountMapping.idToName[accountId];

    return name || "Uzcard";
  };

  // Account name dan ID olish (dynamic)
  const getAccountIdByName = (name) => {
    if (!name) return null;

    if (name.includes("→")) {
      const [fromName] = name.split("→").map((s) => s.trim());
      return accountMapping.nameToId[fromName];
    }

    return accountMapping.nameToId[name];
  };

  // Account mappingni backenddan kelgan ma'lumotlar asosida yaratish
  const buildAccountMapping = (expenses, incomes, transfers) => {
    const accountIds = new Set();

    expenses?.forEach((e) => e.account_id && accountIds.add(e.account_id));
    incomes?.forEach((i) => i.account_id && accountIds.add(i.account_id));
    transfers?.forEach((t) => {
      t.from_account_id && accountIds.add(t.from_account_id);
      t.to_account_id && accountIds.add(t.to_account_id);
    });

    const uniqueIds = Array.from(accountIds).map((id) =>
      typeof id === "string" && !isNaN(Number(id)) ? Number(id) : id,
    );

    const uniqueIdsSet = new Set(uniqueIds);
    const finalUniqueIds = Array.from(uniqueIdsSet);

    // Account nomlari
    const accountNames = ["Uzcard", "Humo", "Cash", "Visa"];

    const newIdToName = {};
    const newNameToId = {};
    const newAccountList = [];

    if (finalUniqueIds.length > 0) {
      const sortedIds = [...finalUniqueIds].sort((a, b) => {
        const numA = typeof a === "number" ? a : Number(a) || 0;
        const numB = typeof b === "number" ? b : Number(b) || 0;
        return numA - numB;
      });

      sortedIds.forEach((id, index) => {
        if (index < accountNames.length) {
          const name = accountNames[index];
          newIdToName[id] = name;
          newNameToId[name] = id;
          newAccountList.push(name);
        }
      });
    } else {
      [1, 2, 3, 4].forEach((id, index) => {
        const name = accountNames[index];
        newIdToName[id] = name;
        newNameToId[name] = id;
        newAccountList.push(name);
      });
    }

    return {
      idToName: newIdToName,
      nameToId: newNameToId,
      accountList: newAccountList.length > 0 ? newAccountList : accountNames,
    };
  };

  // Fetch all transactions
  const fetchAllTransactions = async () => {
    setLoading(true);
    try {
      const [expenses, incomes, transfers] = await Promise.all([
        expensesAPI.getAll().catch(() => {
          return [];
        }),
        incomesAPI.getAll().catch(() => {
          return [];
        }),
        transfersAPI.getAll().catch(() => {
          return [];
        }),
      ]);

      const mapping = buildAccountMapping(expenses, incomes, transfers);
      setAccountMapping(mapping);

      // Format expenses
      const formattedExpenses = expenses.map((exp) => {
        const accountName = getAccountNameById(exp.account_id);
        return {
          id: `exp_${exp.id}`,
          date: exp.spent_at,
          category: exp.category || "Food",
          description: exp.description || exp.merchant || "",
          account: accountName,
          accountId: exp.account_id,
          accountColor: accountColorMap[accountName] || "#3b82f6",
          amount: -Math.abs(exp.amount),
          type: "expense",
          originalId: exp.id,
          originalType: "expense",
        };
      });

      // Format incomes
      const formattedIncomes = incomes.map((inc) => {
        const accountName = getAccountNameById(inc.account_id);
        return {
          id: `inc_${inc.id}`,
          date: inc.received_at,
          category: inc.category || "Salary",
          description: inc.source || "",
          account: accountName,
          accountId: inc.account_id,
          accountColor: accountColorMap[accountName] || "#f97316",
          amount: Math.abs(inc.amount),
          type: "income",
          originalId: inc.id,
          originalType: "income",
        };
      });

      // Format transfers
      const formattedTransfers = transfers.map((tr) => {
        const fromAccountName = getAccountNameById(tr.from_account_id);
        const toAccountName = getAccountNameById(tr.to_account_id);
        return {
          id: `tr_${tr.id}`,
          date: tr.transferred_at,
          category: "Transfer",
          description: tr.note || `Transfer`,
          account: `${fromAccountName} → ${toAccountName}`,
          fromAccountId: tr.from_account_id,
          toAccountId: tr.to_account_id,
          accountColor: "#8B5CF6",
          amount: Math.abs(tr.from_amount),
          type: "transfer",
          originalId: tr.id,
          originalType: "transfer",
        };
      });

      const combined = [
        ...formattedExpenses,
        ...formattedIncomes,
        ...formattedTransfers,
      ].sort((a, b) => new Date(b.date) - new Date(a.date));

      setTransactions(combined);
    } catch (error) {
      message.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  const setFilter = (k, v) => {
    setFilters((f) => ({ ...f, [k]: v }));
    setPage(1);
  };

  const filtered = useMemo(() => {
    let filteredTxs = [...transactions];

    // Tab filter
    if (tab === "expenses") {
      filteredTxs = filteredTxs.filter((tx) => tx.type === "expense");
    } else if (tab === "income") {
      filteredTxs = filteredTxs.filter((tx) => tx.type === "income");
    } else if (tab === "transfers") {
      filteredTxs = filteredTxs.filter((tx) => tx.type === "transfer");
    }

    // Category filter
    if (filters.category) {
      filteredTxs = filteredTxs.filter(
        (tx) => tx.category === filters.category,
      );
    }

    // Account filter
    if (filters.account) {
      filteredTxs = filteredTxs.filter((tx) =>
        tx.account.includes(filters.account),
      );
    }

    // Date filter
    if (filters.dateFrom) {
      filteredTxs = filteredTxs.filter((tx) => tx.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
      filteredTxs = filteredTxs.filter((tx) => tx.date <= filters.dateTo);
    }

    // Amount filter
    if (filters.amountMin) {
      filteredTxs = filteredTxs.filter(
        (tx) => Math.abs(tx.amount) >= Number(filters.amountMin),
      );
    }
    if (filters.amountMax) {
      filteredTxs = filteredTxs.filter(
        (tx) => Math.abs(tx.amount) <= Number(filters.amountMax),
      );
    }

    return filteredTxs;
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;

    const [originalType, originalId] = id.split("_");

    setModalLoading(true);
    try {
      if (originalType === "exp") {
        await expensesAPI.delete(originalId);
      } else if (originalType === "inc") {
        await incomesAPI.delete(originalId);
      } else if (originalType === "tr") {
        await transfersAPI.delete(originalId);
      }

      setTransactions((t) => t.filter((tx) => tx.id !== id));
      message.success("Transaction deleted successfully");
    } catch (error) {
      message.error("Failed to delete transaction");
      console.log(error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleSave = async (form) => {
    setModalLoading(true);
    try {
      const amt = Number(form.amount);

      console.log("Saving transaction:", form);

      if (modal === "edit" && editTx) {
        const [originalType, originalId] = editTx.id.split("_");

        if (originalType === "exp") {
          const accountId = getAccountIdByName(form.account);
          await expensesAPI.update(originalId, {
            account_id: accountId,
            amount: amt,
            spent_at: form.date,
            description: form.description,
            merchant: form.description,
            category: form.category,
          });
        } else if (originalType === "inc") {
          const accountId = getAccountIdByName(form.account);
          await incomesAPI.update(originalId, {
            account_id: accountId,
            amount: amt,
            received_at: form.date,
            source: form.description,
            category: form.category,
          });
        }

        await fetchAllTransactions();
        message.success("Transaction updated successfully");
      } else {
        if (form.type === "expense") {
          const accountId = getAccountIdByName(form.account);
          await expensesAPI.create({
            account_id: accountId,
            amount: amt,
            spent_at: form.date,
            description: form.description,
            merchant: form.description,
            category: form.category,
          });
          message.success("Expense added successfully");
        } else if (form.type === "income") {
          const accountId = getAccountIdByName(form.account);
          await incomesAPI.create({
            account_id: accountId,
            amount: amt,
            received_at: form.date,
            source: form.description,
            category: form.category,
          });
          message.success("Income added successfully");
        } else if (form.type === "transfer") {
          const [fromAccount, toAccount] = form.account
            .split("→")
            .map((s) => s.trim());

          const fromAccountId = getAccountIdByName(fromAccount);
          const toAccountId = getAccountIdByName(toAccount);

          await transfersAPI.create({
            from_account_id: fromAccountId,
            to_account_id: toAccountId,
            from_amount: amt,
            to_amount: amt,
            exchange_rate: 1,
            transferred_at: form.date,
            note: form.description,
          });
          message.success("Transfer added successfully");
        }
      }

      await fetchAllTransactions();
      setModal(null);
      setPage(1);
    } catch (error) {
      console.error("Save error:", error);
      message.error(
        error.response?.data?.detail || "Failed to save transaction",
      );
    } finally {
      setModalLoading(false);
    }
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
      ? {
          ...editTx,
          amount: Math.abs(editTx.amount),
          account: editTx.account.includes("→")
            ? editTx.account
            : editTx.account,
        }
      : modal === "add-expense"
        ? {
            date: new Date().toISOString().slice(0, 10),
            category: "Food",
            description: "",
            account: accountMapping.accountList[0] || "Uzcard",
            amount: "",
            type: "expense",
          }
        : modal === "add-income"
          ? {
              date: new Date().toISOString().slice(0, 10),
              category: "Salary",
              description: "",
              account:
                accountMapping.accountList[1] ||
                accountMapping.accountList[0] ||
                "Humo",
              amount: "",
              type: "income",
            }
          : {
              date: new Date().toISOString().slice(0, 10),
              category: "Transfer",
              description: "",
              account:
                accountMapping.accountList.length >= 2
                  ? `${accountMapping.accountList[0]} → ${accountMapping.accountList[1]}`
                  : "Uzcard → Humo",
              amount: "",
              type: "transfer",
            };

  if (loading) {
    return (
      <div className="shadow-sm bg-white p-5 border border-[#E0E0E0] rounded-2xl flex flex-col gap-5">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="shadow-sm bg-white p-5 border border-[#E0E0E0] rounded-2xl flex flex-col gap-5">
      {modal && (
        <Modal
          title={modalTitle}
          onClose={() => setModal(null)}
          onSave={handleSave}
          initial={modalInitial}
          loading={modalLoading}
          accounts={accountMapping.accountList}
        />
      )}

      {/* Header */}
      <div className="flex flex-row items-center justify-between gap-4">
        <h3 className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[24px] font-medium text-[#191919]">
          My Transactions
        </h3>

        {/* Tugmalar konteyneri */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAdd("add-expense")}
            className="flex items-center justify-center gap-2 p-2 lg:px-4 lg:py-2.5 bg-linear-to-r from-[#F0172B] to-[#CE1B1B] text-white rounded-xl transition-all active:scale-95 shadow-md shadow-red-100"
            title="Add Expense"
          >
            <Plus size={20} />
            <span className="hidden lg:inline text-[15px] font-medium whitespace-nowrap">
              Add Expense
            </span>
          </button>

          {/* 2. Add Income */}
          <button
            onClick={() => handleAdd("add-income")}
            className="flex items-center justify-center gap-2 p-2 lg:px-4 lg:py-2.5 bg-linear-to-r from-[#047857] to-[#10B981] text-white rounded-xl transition-all active:scale-95 shadow-md shadow-green-100"
            title="Add Income"
          >
            <Plus size={20} />
            <span className="hidden lg:inline text-[15px] font-medium whitespace-nowrap">
              Add Income
            </span>
          </button>

          {/* 3. Transfer */}
          <button
            onClick={() => handleAdd("add-transfer")}
            className="flex items-center justify-center gap-2 p-2 lg:px-4 lg:py-2.5 bg-linear-to-r from-[#4F8CFF] to-[#1E40AF] text-white rounded-xl transition-all active:scale-95 shadow-md shadow-blue-100"
            title="Transfer"
          >
            <Plus size={20} />
            <span className="hidden lg:inline text-[15px] font-medium whitespace-nowrap">
              Transfer
            </span>
          </button>
        </div>
      </div>

      {/* Tabs */}
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
                : "bg-[#F7F7F7] border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Date Range - bitta input */}
          <div>
            <label className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-[#212121] font-medium mb-1 block">
              Date Range
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => {
                const val = e.target.value;
                setFilter("dateFrom", val);
                setFilter("dateTo", val);
              }}
              className="w-full text-[#25282C] text-[13px] sm:text-[14px] md:text-[15px] lg:text-[17px] border border-gray-200 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-[#212121] font-medium mb-1 block">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilter("category", e.target.value)}
              className="w-full text-[#25282C] border border-gray-200 rounded-[10px] px-3 py-2 text-[13px] sm:text-[14px] md:text-[15px] lg:text-[17px] focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Account */}
          <div>
            <label className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-[#212121] font-medium mb-1 block">
              Account
            </label>
            <select
              value={filters.account}
              onChange={(e) => setFilter("account", e.target.value)}
              className="w-full border border-gray-200 rounded-[10px] px-3 py-2 text-[#25282C] text-[13px] sm:text-[14px] md:text-[15px] lg:text-[17px] focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Accounts</option>
              {accountMapping.accountList.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* Amount Range - bitta input */}
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

        {/* Clear filters button */}
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

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <h3 className="text-[16px] sm:text-[18px] md:text-[20px] font-normal text-[#000000]">
            All Transactions
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
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
                    className="text-left px-4 py-3 text-white text-[16px] font-normal whitespace-nowrap"
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
                    className="text-center py-10 text-[#212121] text-[13px]"
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
                    <td className="px-4 py-3 max-w-30">
                      <div
                        className="flex items-center gap-1.5 text-[12px] text-gray-700 truncate"
                        title={tx.category}
                      >
                        <Tag size={12} className="text-gray-400 shrink-0" />
                        <span className="truncate">{tx.category}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-45">
                      <div
                        className="text-[12px] text-gray-500 truncate"
                        title={tx.description || "—"}
                      >
                        {tx.description || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-30]">
                      <div
                        className="flex items-center gap-1.5 text-[12px] text-gray-700 truncate"
                        title={tx.account}
                      >
                        <span
                          className="w-3 h-3 rounded-sm shrink-0"
                          style={{ background: tx.accountColor }}
                        />
                        <span className="truncate">{tx.account}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`text-[12px] font-bold ${
                          tx.amount > 0 ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {tx.amount > 0 ? "+" : ""}
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

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[15px] font-semibold text-gray-800">
            All Transactions
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
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <span className="text-[11px] text-gray-400 bg-gray-50 px-2 py-1 rounded-lg whitespace-nowrap">
                    {tx.date}
                  </span>
                  <span
                    className={`text-[11px] font-medium px-2 py-1 rounded-lg whitespace-nowrap ${
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
                <div className="flex items-center gap-2 flex-shrink-0">
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
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[13px] text-gray-700 min-w-0 flex-1">
                    <Tag size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="truncate" title={tx.category}>
                      {tx.category}
                    </span>
                  </div>
                  <span
                    className={`text-[15px] font-bold whitespace-nowrap flex-shrink-0 ${
                      tx.amount > 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {tx.amount > 0 ? "+" : ""}
                    {fmt(tx.amount)}
                  </span>
                </div>

                {tx.description && tx.description !== "—" && (
                  <div className="text-[12px] text-gray-500 break-words">
                    {tx.description}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                  <div className="flex items-center gap-1.5 text-[12px] text-gray-700 min-w-0 flex-1">
                    <span
                      className="w-3 h-3 rounded-sm flex-shrink-0"
                      style={{ background: tx.accountColor }}
                    />
                    <span className="truncate" title={tx.account}>
                      {tx.account}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
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

      {/* Pagination */}
      {filtered.length > 0 && (
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
              <ArrowLeft size={15} />
            </button>

            <div className="flex items-center gap-1">
              {Array.from(
                { length: Math.min(totalPages, 5) },
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

              {totalPages > 5 && (
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
              <ArrowRight size={15} />
            </button>
          </div>

          <span className="text-[11px] sm:text-[12px] text-gray-400 order-3">
            Page {page}/{totalPages || 1}
          </span>
        </div>
      )}
    </div>
  );
};

export default Transactions;
