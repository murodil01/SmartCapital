import { useState, useEffect, useCallback, useMemo } from "react";
import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { debtsAPI } from "../../api/debts";
import { message } from "antd";

const ITEMS_PER_PAGE = 10;

const fmt = (n) => {
  if (!n && n !== 0) return "0";
  return Math.round(n).toLocaleString("uz-UZ").replace(/,/g, " ");
};

const Field = ({ label, children }) => (
  <div style={{ marginBottom: 14 }}>
    <label className="text-[12px] text-gray-500 font-semibold uppercase tracking-[0.8px] block mb-[5px]">
      {label}
    </label>
    {children}
  </div>
);

const inputStyle = {
  width: "100%",
  border: "1.5px solid #E5E7EB",
  borderRadius: 10,
  padding: "9px 12px",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};

function Modal({ onClose, onSave, editItem, defaultType, loading }) {
  const [form, setForm] = useState(
    editItem
      ? {
          person_name: editItem.person_name,
          kind: editItem.kind === "DEBT" ? "I owe" : "Owes me",
          amount: Math.abs(editItem.amount),
          currency: editItem.currency || "UZS",
          due_date: editItem.due_date,
          status: editItem.status === "OPEN" ? "Open" : "Closed",
          note: editItem.note || "",
        }
      : {
          person_name: "",
          kind: defaultType || "I owe",
          amount: "",
          currency: "UZS",
          due_date: new Date().toISOString().slice(0, 10),
          status: "Open",
          note: "",
        },
  );

  const handle = () => {
    if (!form.person_name || !form.amount) {
      message.error("Please fill all required fields");
      return;
    }

    const amount = Number(form.amount);
    if (isNaN(amount) || amount <= 0) {
      message.error("Please enter a valid amount");
      return;
    }

    onSave({
      ...form,
      amount: amount,
      id: editItem?.id,
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 28,
          width: "100%",
          maxWidth: 380,
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        className="no-scrollbar"
      >
        <h3
          style={{
            fontFamily: "Georgia,serif",
            fontSize: 19,
            marginTop: 0,
            marginBottom: 20,
          }}
        >
          {editItem
            ? "Edit Record"
            : form.kind === "I owe"
              ? "Add Debt"
              : "Add Receivable"}
        </h3>

        <Field label="Person Name *">
          <input
            value={form.person_name}
            onChange={(e) =>
              setForm((f) => ({ ...f, person_name: e.target.value }))
            }
            style={inputStyle}
            placeholder="e.g. Akmal"
            disabled={loading}
          />
        </Field>

        <Field label="Type">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["I owe", "Owes me"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm((f) => ({ ...f, kind: t }))}
                disabled={loading}
                style={{
                  flex: "1 1 auto",
                  padding: "9px 0",
                  borderRadius: 10,
                  border: "1.5px solid",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: 700,
                  fontSize: 13,
                  borderColor:
                    form.kind === t
                      ? t === "I owe"
                        ? "#EF4444"
                        : "#10B981"
                      : "#E5E7EB",
                  background:
                    form.kind === t
                      ? t === "I owe"
                        ? "#FFF1F2"
                        : "#F0FDF4"
                      : "#fff",
                  color:
                    form.kind === t
                      ? t === "I owe"
                        ? "#EF4444"
                        : "#10B981"
                      : "#374151",
                  minWidth: "100px",
                  opacity: loading ? 0.5 : 1,
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Amount (UZS) *">
          <input
            type="number"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            style={inputStyle}
            placeholder="e.g. 500000"
            disabled={loading}
            min="1"
          />
        </Field>

        <Field label="Currency">
          <select
            value={form.currency}
            onChange={(e) =>
              setForm((f) => ({ ...f, currency: e.target.value }))
            }
            style={inputStyle}
            disabled={loading}
          >
            <option value="UZS">UZS</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="RUB">RUB</option>
          </select>
        </Field>

        <Field label="Due Date">
          <input
            type="date"
            value={form.due_date}
            onChange={(e) =>
              setForm((f) => ({ ...f, due_date: e.target.value }))
            }
            style={inputStyle}
            disabled={loading}
          />
        </Field>

        <Field label="Note">
          <input
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            style={inputStyle}
            placeholder="Optional note"
            disabled={loading}
          />
        </Field>

        <Field label="Status">
          <div style={{ display: "flex", gap: 8 }}>
            {["Open", "Closed"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setForm((f) => ({ ...f, status: s }))}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "9px 0",
                  borderRadius: 10,
                  border: "1.5px solid",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: 700,
                  fontSize: 13,
                  borderColor:
                    form.status === s
                      ? s === "Open"
                        ? "#6366F1"
                        : "#9CA3AF"
                      : "#E5E7EB",
                  background:
                    form.status === s
                      ? s === "Open"
                        ? "#EEF2FF"
                        : "#F9FAFB"
                      : "#fff",
                  color:
                    form.status === s
                      ? s === "Open"
                        ? "#6366F1"
                        : "#4B5563"
                      : "#374151",
                  opacity: loading ? 0.5 : 1,
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </Field>

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 10,
              border: "1.5px solid #E5E7EB",
              background: "#fff",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.5 : 1,
            }}
          >
            Cancel
          </button>

          <button
            onClick={handle}
            disabled={loading}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 10,
              border: "none",
              background: "#1D3557",
              color: "#fff",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.5 : 1,
            }}
          >
            {loading ? "Saving..." : editItem ? "Save Changes" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

function WaveCard({ title, amount, sub, positive, loading }) {
  const color = positive ? "#10B981" : "#EF4444";
  const bg = positive ? "#F0FDF4" : "#FFF1F2";

  return (
    <div
      style={{
        flex: "1 1 150px",
        minWidth: 200,
        background: bg,
        borderRadius: 16,
        padding: "20px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          opacity: 0.15,
          pointerEvents: "none",
        }}
      >
        <svg
          viewBox="0 0 300 60"
          preserveAspectRatio="none"
          width="100%"
          height="50"
        >
          <path
            d="M0,40 C60,10 120,55 180,30 C240,5 270,45 300,35 L300,60 L0,60 Z"
            fill={color}
          />
          <path
            d="M0,50 C80,25 160,55 230,35 C265,25 285,45 300,40 L300,60 L0,60 Z"
            fill={color}
            opacity="0.6"
          />
        </svg>
      </div>

      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#374151",
          marginBottom: 8,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "clamp(20px, 4vw, 26px)",
          fontWeight: 800,
          color,
          letterSpacing: "-0.5px",
          wordBreak: "break-word",
        }}
      >
        {loading ? "..." : `${positive ? "+" : "-"}${fmt(amount)}`}{" "}
        <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.7 }}>UZS</span>
        <span style={{ fontSize: 16, marginLeft: 6 }}>
          {positive ? "↑" : "↓"}
        </span>
      </div>

      <div
        style={{
          fontSize: 12,
          color: "#9CA3AF",
          marginTop: 6,
          fontWeight: 500,
        }}
      >
        {loading ? "..." : sub}
      </div>
    </div>
  );
}

function DeleteModal({ item, onClose, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 bg-black/35 z-50 flex items-center justify-center p-4">
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 32,
          width: "100%",
          maxWidth: 340,
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 44, marginBottom: 12 }}>🗑️</div>

        <h3
          style={{ fontFamily: "Georgia,serif", fontSize: 19, marginBottom: 8 }}
        >
          Delete Record?
        </h3>

        <p
          style={{
            color: "#6B7280",
            fontSize: 14,
            marginBottom: 24,
            wordBreak: "break-word",
          }}
        >
          <strong>{item.person_name}</strong> —{" "}
          {item.kind === "DEBT" ? "-" : "+"}
          {fmt(Math.abs(item.amount))} UZS will be removed.
        </p>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1,
              padding: "11px 0",
              borderRadius: 10,
              border: "1.5px solid #E5E7EB",
              background: "#fff",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.5 : 1,
            }}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1,
              padding: "11px 0",
              borderRadius: 10,
              border: "none",
              background: "#EF4444",
              color: "#fff",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.5 : 1,
            }}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Debts() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Fetch all debts
  const fetchDebts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await debtsAPI.getAll();

      // Transform backend data to component format
      const transformed = data.map((debt) => ({
        id: debt.id,
        person: debt.person_name,
        type: debt.kind === "DEBT" ? "I owe" : "Owes me",
        amt:
          debt.kind === "DEBT" ? -Math.abs(debt.amount) : Math.abs(debt.amount),
        date: new Date().toISOString().slice(0, 10), // Backendda date yo'q
        due: debt.due_date,
        status: debt.status === "OPEN" ? "Open" : "Closed",
        note: debt.note,
        currency: debt.currency,
      }));

      setRecords(transformed);
    } catch (error) {
      console.error("Fetch debts error:", error);
      message.error("Failed to load debts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDebts();
  }, [fetchDebts]);

  const filtered = useMemo(
    () =>
      records.filter(
        (r) =>
          (filterType === "All" || r.type === filterType) &&
          (filterStatus === "All" || r.status === filterStatus),
      ),
    [records, filterType, filterStatus],
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const totalDebts = useMemo(
    () =>
      records
        .filter((r) => r.type === "I owe")
        .reduce((s, r) => s + Math.abs(r.amt), 0),
    [records],
  );

  const totalRec = useMemo(
    () =>
      records
        .filter((r) => r.type === "Owes me")
        .reduce((s, r) => s + r.amt, 0),
    [records],
  );

  const debtPeople = useMemo(
    () =>
      new Set(records.filter((r) => r.type === "I owe").map((r) => r.person))
        .size,
    [records],
  );

  const recPeople = useMemo(
    () =>
      new Set(records.filter((r) => r.type === "Owes me").map((r) => r.person))
        .size,
    [records],
  );

  const handleSave = async (form) => {
    setModalLoading(true);
    try {
      const debtData = {
        kind: form.kind === "I owe" ? "DEBT" : "RECEIVABLE",
        person_name: form.person_name,
        amount: form.amount,
        currency: form.currency || "UZS",
        status: form.status === "Open" ? "OPEN" : "CLOSED",
        due_date: form.due_date || null,
        note: form.note || "",
      };

      if (form.id) {
        // Update existing
        await debtsAPI.update(form.id, debtData);
        message.success("Record updated successfully");
      } else {
        // Create new
        await debtsAPI.create(debtData);
        message.success("Record added successfully");
      }

      // Refresh data
      await fetchDebts();
      setModal(null);
    } catch (error) {
      message.error(error.error || "Failed to save record");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setModalLoading(true);
    try {
      await debtsAPI.delete(deleteTarget.id);
      message.success("Record deleted successfully");
      await fetchDebts();
      setDeleteTarget(null);

      if (page > Math.ceil((filtered.length - 1) / ITEMS_PER_PAGE)) {
        setPage((p) => Math.max(1, p - 1));
      }
    } catch (error) {
      message.error("Failed to delete record");
    } finally {
      setModalLoading(false);
    }
  };

  const toggleStatus = async (id) => {
    const record = records.find((r) => r.id === id);
    if (!record) return;

    try {
      const newStatus = record.status === "Open" ? "CLOSED" : "OPEN";

      await debtsAPI.update(id, {
        kind: record.type === "I owe" ? "DEBT" : "RECEIVABLE",
        person_name: record.person,
        amount: Math.abs(record.amt),
        currency: record.currency || "UZS",
        status: newStatus,
        due_date: record.due,
        note: record.note || "",
      });

      setRecords((rs) =>
        rs.map((r) =>
          r.id === id
            ? { ...r, status: newStatus === "OPEN" ? "Open" : "Closed" }
            : r,
        ),
      );
    } catch (error) {
      message.error("Failed to update status");
    }
  };

  const pageNums = [];
  for (let i = 1; i <= totalPages; i++) pageNums.push(i);

  const visiblePages = pageNums.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  const thStyle = {
    padding: "11px 14px",
    fontSize: 12,
    fontWeight: 700,
    color: "white",
    textAlign: "left",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    borderBottom: "2px solid #F3F4F6",
    background: "#0A2560",
  };

  const tdStyle = {
    padding: "11px 14px",
    fontSize: 13,
    color: "#374151",
    borderBottom: "1px solid #F9FAFB",
    verticalAlign: "middle",
  };

  if (loading) {
    return (
      <div className="shadow-sm bg-white p-5 border border-[#E0E0E0] rounded-2xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <style>{`
        * {
          box-sizing: border-box;
        }
        
        tr:hover td { 
          background: #FAFAFA; 
        }
        
        .act-btn { 
          background: none; 
          border: none; 
          cursor: pointer; 
          padding: 5px; 
          border-radius: 7px; 
          transition: background 0.15s; 
        }
        
        .act-btn:hover { 
          background: #F3F4F6; 
        }
        
        .act-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .page-btn { 
          min-width: 34px; 
          height: 34px; 
          border-radius: 8px; 
          border: none; 
          font-size: 13px; 
          font-weight: 600; 
          cursor: pointer; 
          background: #fff; 
          color: #374151; 
          border: 1px solid #E5E7EB; 
        }
        
        .page-btn:hover:not(:disabled) { 
          background: #EEF2FF; 
          color: #6366F1; 
        }
        
        .page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .filter-btn { 
          padding: 6px 14px; 
          border-radius: 8px; 
          border: 1.5px solid #E5E7EB; 
          background: #fff; 
          font-size: 12px; 
          font-weight: 600; 
          cursor: pointer; 
          transition: all 0.15s; 
        }
        
        .filter-btn.active { 
          border-color: #6366F1; 
          background: #EEF2FF; 
          color: #6366F1; 
        }
        
        .filter-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        /* Desktop styles */
        .desktop-table {
          display: table;
          width: 100%;
        }
        
        .mobile-cards {
          display: none;
        }
        
        /* Tablet styles */
        @media (max-width: 1024px) {
          .wave-cards-container {
            flex-direction: column;
          }
          
          .wave-cards-container > div {
            width: 100%;
          }
        }
        
        /* Mobile styles */
        @media (max-width: 768px) {
          .hide-mobile { 
            display: none !important; 
          }
          
          .desktop-table {
            display: none !important;
          }
          
          .mobile-cards {
            display: block !important;
          }
          
          .filters-section {
            flex-direction: column;
            align-items: flex-start !important;
            width: 100%;
          }
          
          .filters-section h3 {
            margin-bottom: 10px;
          }
          
          .filter-buttons-container {
            width: 100%;
            justify-content: space-between;
          }
          
          .filter-group {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            flex: 1;
          }
          
          .filter-btn {
            padding: 4px 8px;
            font-size: 11px;
            flex: 1 1 auto;
          }
          
          .action-buttons {
            flex-direction: column;
            width: 100%;
          }
          
          .action-buttons button {
            width: 100%;
          }
          
          .pagination-wrapper {
            flex-direction: column;
            align-items: center;
            gap: 12px;
          }
          
          .pagination-controls {
            flex-wrap: wrap;
            justify-content: center;
            order: 2;
          }
          
          .page-info {
            order: 1;
          }
          
          .page-numbers {
            display: none;
          }
          
          .page-btn {
            min-width: 40px;
            height: 40px;
          }
        }
        
        /* Small mobile styles */
        @media (max-width: 480px) {
          .filter-group {
            width: 100%;
          }
          
          .filter-btn {
            flex: 1 1 calc(50% - 4px);
          }
          
          .filter-divider {
            display: none;
          }
          
          .summary-cards {
            gap: 8px;
          }
          
          .summary-cards > div {
            padding: 16px;
          }
        }
      `}</style>

      <div className="shadow-sm bg-white p-3 sm:p-5 border border-[#E0E0E0] rounded-2xl">
        {/* Header */}
        <div className="action-buttons flex justify-between items-center mb-5.5 flex-wrap gap-2.5">
          <h3 className="text-[clamp(18px,4vw,24px)] text-[#1F2937]">
            Total Debts and Receivables
          </h3>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <button
              onClick={() => setModal("receivable")}
              disabled={loading}
              style={{
                flex: "1 1 auto",
                background: "#10B981",
                color: "#fff",
                border: "none",
                borderRadius: 11,
                padding: "10px 18px",
                fontWeight: 700,
                fontSize: 13,
                cursor: loading ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
                opacity: loading ? 0.5 : 1,
              }}
            >
              + Add Receivable
            </button>

            <button
              onClick={() => setModal("debt")}
              disabled={loading}
              style={{
                flex: "1 1 auto",
                background: "#EF4444",
                color: "#fff",
                border: "none",
                borderRadius: 11,
                padding: "10px 18px",
                fontWeight: 700,
                fontSize: 13,
                cursor: loading ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
                opacity: loading ? 0.5 : 1,
              }}
            >
              + Add Debt
            </button>
          </div>
        </div>

        {/* Filters */}
        <div
          className="filters-section"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            marginBottom: "16px",
            flexWrap: "wrap",
          }}
        >
          <div className="filter-group gap-2 flex">
            <button
              onClick={() => setFilterType("All")}
              disabled={loading}
              className={`filter-btn ${filterType === "All" ? "active" : ""}`}
            >
              All Types
            </button>
            <button
              onClick={() => setFilterType("I owe")}
              disabled={loading}
              className={`filter-btn ${filterType === "I owe" ? "active" : ""}`}
            >
              I Owe
            </button>
            <button
              onClick={() => setFilterType("Owes me")}
              disabled={loading}
              className={`filter-btn ${filterType === "Owes me" ? "active" : ""}`}
            >
              Owes Me
            </button>
          </div>

          <span className="filter-divider" style={{ color: "#E5E7EB" }}>
            |
          </span>

          <div className="filter-group gap-2 flex">
            <button
              onClick={() => setFilterStatus("All")}
              disabled={loading}
              className={`filter-btn ${filterStatus === "All" ? "active" : ""}`}
            >
              All Status
            </button>
            <button
              onClick={() => setFilterStatus("Open")}
              disabled={loading}
              className={`filter-btn ${filterStatus === "Open" ? "active" : ""}`}
            >
              Open
            </button>
            <button
              onClick={() => setFilterStatus("Closed")}
              disabled={loading}
              className={`filter-btn ${filterStatus === "Closed" ? "active" : ""}`}
            >
              Closed
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div
          className="wave-cards-container summary-cards"
          style={{
            display: "flex",
            gap: "16px",
            marginBottom: "28px",
            flexWrap: "wrap",
          }}
        >
          <WaveCard
            title="Total Debts (I owe)"
            amount={totalDebts}
            sub={`Across ${debtPeople} people`}
            positive={false}
            loading={loading}
          />

          <WaveCard
            title="Total Receivables (Owes me)"
            amount={totalRec}
            sub={`Across ${recPeople} people`}
            positive={true}
            loading={loading}
          />
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow p-3 sm:p-5">
          <div className="overflow-x-auto">
            {/* Desktop Table View */}
            <table className="min-w-full border-collapse desktop-table">
              <thead>
                <tr> 
                  <th style={thStyle}>People</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Amount</th>
                  <th style={{ ...thStyle }} className="hide-mobile">
                    Due Date
                  </th>
                  <th style={thStyle}>Status</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        textAlign: "center",
                        padding: 40,
                        color: "#9CA3AF",
                        fontSize: 14,
                      }}
                    >
                      No records found
                    </td>
                  </tr>
                ) : (
                  paginated.map((r) => (
                    <tr key={r.id}>
                      <td style={{ ...tdStyle, fontWeight: 700 }}>
                        {r.person}
                      </td>

                      <td style={tdStyle}>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background:
                                r.type === "I owe" ? "#EF4444" : "#10B981",
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              color: r.type === "I owe" ? "#EF4444" : "#10B981",
                              fontWeight: 600,
                            }}
                          >
                            {r.type}
                          </span>
                        </span>
                      </td>

                      <td
                        style={{
                          ...tdStyle,
                          fontWeight: 700,
                          color: r.type === "I owe" ? "#EF4444" : "#10B981",
                        }}
                      >
                        {r.type === "I owe" ? "-" : "+"}
                        {fmt(Math.abs(r.amt))} UZS
                      </td>

                      <td style={tdStyle} className="hide-mobile">
                        {r.due || "—"}
                      </td>

                      <td style={tdStyle}>
                        <button
                          onClick={() => toggleStatus(r.id)}
                          disabled={loading}
                          style={{
                            padding: "4px 14px",
                            borderRadius: 8,
                            border: "1.5px solid",
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: loading ? "not-allowed" : "pointer",
                            borderColor:
                              r.status === "Open" ? "#6366F1" : "#D1D5DB",
                            background:
                              r.status === "Open" ? "#EEF2FF" : "#F9FAFB",
                            color: r.status === "Open" ? "#6366F1" : "#9CA3AF",
                            whiteSpace: "nowrap",
                            opacity: loading ? 0.5 : 1,
                          }}
                        >
                          {r.status}
                        </button>
                      </td>

                      <td style={{ ...tdStyle, textAlign: "right" }}>
                        <button
                          className="act-btn"
                          onClick={() => setModal(r)}
                          disabled={loading}
                          title="Edit"
                        >
                          <svg
                            width="15"
                            height="15"
                            fill="none"
                            stroke="#6B7280"
                            strokeWidth="1.8"
                            viewBox="0 0 24 24"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>

                        <button
                          className="act-btn"
                          onClick={() => setDeleteTarget(r)}
                          disabled={loading}
                          title="Delete"
                        >
                          <svg
                            width="15"
                            height="15"
                            fill="none"
                            stroke="#6B7280"
                            strokeWidth="1.8"
                            viewBox="0 0 24 24"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Mobile Card View */}
            <div className="mobile-cards">
              {paginated.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: 40,
                    color: "#9CA3AF",
                    fontSize: 14,
                  }}
                >
                  No records found
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {paginated.map((r) => (
                    <div
                      key={r.id}
                      style={{
                        background: "white",
                        border: "1px solid #E5E7EB",
                        borderRadius: "12px",
                        padding: "16px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      }}
                    >
                      {/* Card Header */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "12px",
                        }}
                      >
                        <span style={{ fontWeight: 700, fontSize: "16px" }}>
                          {r.person}
                        </span>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: "16px",
                            fontSize: "12px",
                            fontWeight: 600,
                            background:
                              r.type === "I owe" ? "#FEF2F2" : "#F0FDF4",
                            color: r.type === "I owe" ? "#EF4444" : "#10B981",
                          }}
                        >
                          {r.type}
                        </span>
                      </div>

                      {/* Amount */}
                      <div
                        style={{
                          fontSize: "20px",
                          fontWeight: 700,
                          color: r.type === "I owe" ? "#EF4444" : "#10B981",
                          marginBottom: "8px",
                        }}
                      >
                        {r.type === "I owe" ? "-" : "+"}
                        {fmt(Math.abs(r.amt))} UZS
                      </div>

                      {/* Due Date */}
                      <div
                        style={{
                          display: "flex",
                          gap: "16px",
                          fontSize: "13px",
                          color: "#6B7280",
                          marginBottom: "12px",
                        }}
                      >
                        <span>⏰ {r.due || "No due date"}</span>
                      </div>

                      {/* Footer */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <button
                          onClick={() => toggleStatus(r.id)}
                          disabled={loading}
                          style={{
                            padding: "4px 14px",
                            borderRadius: "20px",
                            border: "1.5px solid",
                            fontSize: "12px",
                            fontWeight: 700,
                            cursor: loading ? "not-allowed" : "pointer",
                            borderColor:
                              r.status === "Open" ? "#6366F1" : "#D1D5DB",
                            background:
                              r.status === "Open" ? "#EEF2FF" : "#F9FAFB",
                            color: r.status === "Open" ? "#6366F1" : "#9CA3AF",
                            opacity: loading ? 0.5 : 1,
                          }}
                        >
                          {r.status}
                        </button>

                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            className="act-btn"
                            onClick={() => setModal(r)}
                            disabled={loading}
                            title="Edit"
                          >
                            <svg
                              width="18"
                              height="18"
                              fill="none"
                              stroke="#6B7280"
                              strokeWidth="1.8"
                              viewBox="0 0 24 24"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            className="act-btn"
                            onClick={() => setDeleteTarget(r)}
                            disabled={loading}
                            title="Delete"
                          >
                            <svg
                              width="18"
                              height="18"
                              fill="none"
                              stroke="#6B7280"
                              strokeWidth="1.8"
                              viewBox="0 0 24 24"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                              <path d="M10 11v6M14 11v6" />
                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="flex flex-wrap justify-between items-center gap-4 border-t border-gray-200 pt-4 mt-4">
              {/* Left info */}
              <span className="text-xs text-gray-400 order-1 sm:order-1">
                Showing{" "}
                {filtered.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of{" "}
                {filtered.length} records
              </span>

              {/* Center pagination */}
              <div className="flex gap-2 items-center order-3 sm:order-2 mx-auto flex-wrap">
                {/* Previous button */}
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                  className={`flex w-30 text-center justify-center items-center gap-1 px-3 h-8 rounded-lg border border-gray-200 bg-white text-gray-700 ${
                    page === 1 || loading
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }`}
                >
                  <ArrowLeft size={15} />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Page numbers */}
                <div className="flex gap-1">
                  {visiblePages.map((p, i, arr) => (
                    <React.Fragment key={p}>
                      {i > 0 && arr[i - 1] !== p - 1 && (
                        <span style={{ color: "#9CA3AF", fontSize: 13 }}>
                          …
                        </span>
                      )}
                      <button
                        onClick={() => setPage(p)}
                        disabled={loading}
                        style={{
                          padding: "0 10px",
                          height: 32,
                          borderRadius: 8,
                          border: `1.5px solid ${page === p ? "#1D3557" : "#E5E7EB"}`,
                          background: page === p ? "#1D3557" : "#fff",
                          color: page === p ? "#fff" : "#374151",
                          cursor: loading ? "not-allowed" : "pointer",
                          opacity: loading ? 0.5 : 1,
                        }}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  ))}
                </div>

                {/* Next button */}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || loading}
                  className={`flex w-30 text-center justify-center items-center gap-1 px-3 h-8 rounded-lg border border-gray-200 bg-white text-gray-700 ${
                    page === totalPages || loading
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }`}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ArrowRight size={15} />
                </button>
              </div>

              {/* Right info */}
              <span className="text-xs text-gray-400 order-2 sm:order-3">
                Page {page} of {totalPages || 1}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <Modal
          onClose={() => setModal(null)}
          onSave={handleSave}
          editItem={typeof modal === "object" && modal.id ? modal : null}
          defaultType={
            modal === "debt"
              ? "I owe"
              : modal === "receivable"
                ? "Owes me"
                : modal.type
          }
          loading={modalLoading}
        />
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          item={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          loading={modalLoading}
        />
      )}
    </div>
  );
}

// import { useState } from "react";
// import React from "react";
// import { ArrowLeft, ArrowRight } from "lucide-react";

// const INITIAL_DEBTS = [
//   {
//     id: 1,
//     person: "Akmal",
//     type: "I owe",
//     amt: -120000,
//     date: "2025-06-06",
//     due: "2025-07-06",
//     status: "Open",
//   },
//   {
//     id: 2,
//     person: "Jasur",
//     type: "Owes me",
//     amt: 1000000,
//     date: "2025-06-05",
//     due: "2025-07-05",
//     status: "Open",
//   },
//   {
//     id: 3,
//     person: "Nozim",
//     type: "I owe",
//     amt: -120000,
//     date: "2025-06-04",
//     due: "2025-07-04",
//     status: "Closed",
//   },
//   {
//     id: 4,
//     person: "Dilshod",
//     type: "I owe",
//     amt: -215000,
//     date: "2025-06-03",
//     due: "2025-07-03",
//     status: "Open",
//   },
//   {
//     id: 5,
//     person: "Malika",
//     type: "Owes me",
//     amt: 1000000,
//     date: "2025-06-06",
//     due: "2025-07-06",
//     status: "Open",
//   },
//   {
//     id: 6,
//     person: "Sevinch",
//     type: "I owe",
//     amt: -120000,
//     date: "2025-06-06",
//     due: "2025-07-06",
//     status: "Closed",
//   },
//   {
//     id: 7,
//     person: "Muslima",
//     type: "Owes me",
//     amt: 1500000,
//     date: "2025-06-06",
//     due: "2025-07-06",
//     status: "Closed",
//   },
//   {
//     id: 8,
//     person: "Sevara",
//     type: "I owe",
//     amt: -120000,
//     date: "2025-06-06",
//     due: "2025-07-06",
//     status: "Open",
//   },
//   {
//     id: 9,
//     person: "Bobur",
//     type: "I owe",
//     amt: -300000,
//     date: "2025-06-01",
//     due: "2025-07-01",
//     status: "Open",
//   },
//   {
//     id: 10,
//     person: "Zulfiya",
//     type: "Owes me",
//     amt: 500000,
//     date: "2025-06-02",
//     due: "2025-07-02",
//     status: "Open",
//   },
//   {
//     id: 11,
//     person: "Kamol",
//     type: "I owe",
//     amt: -450000,
//     date: "2025-05-28",
//     due: "2025-06-28",
//     status: "Closed",
//   },
//   {
//     id: 12,
//     person: "Sherzod",
//     type: "Owes me",
//     amt: 2000000,
//     date: "2025-05-25",
//     due: "2025-06-25",
//     status: "Open",
//   },
//   {
//     id: 13,
//     person: "Nodira",
//     type: "I owe",
//     amt: -180000,
//     date: "2025-05-20",
//     due: "2025-06-20",
//     status: "Open",
//   },
//   {
//     id: 14,
//     person: "Umid",
//     type: "Owes me",
//     amt: 750000,
//     date: "2025-05-18",
//     due: "2025-06-18",
//     status: "Closed",
//   },
//   {
//     id: 15,
//     person: "Hulkar",
//     type: "I owe",
//     amt: -90000,
//     date: "2025-05-15",
//     due: "2025-06-15",
//     status: "Open",
//   },
//   {
//     id: 16,
//     person: "Sanjar",
//     type: "Owes me",
//     amt: 1200000,
//     date: "2025-05-12",
//     due: "2025-06-12",
//     status: "Open",
//   },
//   {
//     id: 17,
//     person: "Feruza",
//     type: "I owe",
//     amt: -600000,
//     date: "2025-05-10",
//     due: "2025-06-10",
//     status: "Closed",
//   },
//   {
//     id: 18,
//     person: "Otabek",
//     type: "Owes me",
//     amt: 350000,
//     date: "2025-05-08",
//     due: "2025-06-08",
//     status: "Open",
//   },
//   {
//     id: 19,
//     person: "Lola",
//     type: "I owe",
//     amt: -250000,
//     date: "2025-05-05",
//     due: "2025-06-05",
//     status: "Open",
//   },
//   {
//     id: 20,
//     person: "Davron",
//     type: "Owes me",
//     amt: 900000,
//     date: "2025-05-01",
//     due: "2025-06-01",
//     status: "Closed",
//   },
//   {
//     id: 21,
//     person: "Iroda",
//     type: "I owe",
//     amt: -130000,
//     date: "2025-04-28",
//     due: "2025-05-28",
//     status: "Open",
//   },
// ];

// const ITEMS_PER_PAGE = 10;

// const fmt = (n) => Math.abs(n).toLocaleString("uz-UZ").replace(/,/g, " ");

// const Field = ({ label, children }) => (
//   <div style={{ marginBottom: 14 }}>
//     <label
//       style={{
//         fontSize: 12,
//         color: "#6B7280",
//         fontWeight: 600,
//         textTransform: "uppercase",
//         letterSpacing: 0.8,
//         display: "block",
//         marginBottom: 5,
//       }}
//     >
//       {label}
//     </label>
//     {children}
//   </div>
// );

// const inputStyle = {
//   width: "100%",
//   border: "1.5px solid #E5E7EB",
//   borderRadius: 10,
//   padding: "9px 12px",
//   fontSize: 14,
//   outline: "none",
//   boxSizing: "border-box",
// };

// function Modal({ onClose, onSave, editItem }) {
//   const [form, setForm] = useState(
//     editItem
//       ? {
//           person: editItem.person,
//           type: editItem.type,
//           amt: Math.abs(editItem.amt),
//           date: editItem.date,
//           due: editItem.due,
//           status: editItem.status,
//         }
//       : {
//           person: "",
//           type: "I owe",
//           amt: "",
//           date: new Date().toISOString().slice(0, 10),
//           due: "",
//           status: "Open",
//         },
//   );

//   const handle = () => {
//     if (!form.person || !form.amt) return;

//     const amt =
//       form.type === "I owe"
//         ? -Math.abs(Number(form.amt))
//         : Math.abs(Number(form.amt));

//     onSave({ ...form, amt, id: editItem?.id });
//   };

//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         background: "rgba(0,0,0,0.35)",
//         zIndex: 50,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: "16px",
//       }}
//     >
//       <div
//         style={{
//           background: "#fff",
//           borderRadius: 20,
//           padding: 28,
//           width: "100%",
//           maxWidth: 380,
//           boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
//           maxHeight: "90vh",
//           overflowY: "auto",
//         }}
//       >
//         <h3
//           style={{
//             fontFamily: "Georgia,serif",
//             fontSize: 19,
//             marginTop: 0,
//             marginBottom: 20,
//           }}
//         >
//           {editItem
//             ? "Edit Record"
//             : form.type === "I owe"
//               ? "Add Debt"
//               : "Add Receivable"}
//         </h3>

//         <Field label="Person Name">
//           <input
//             value={form.person}
//             onChange={(e) => setForm((f) => ({ ...f, person: e.target.value }))}
//             style={inputStyle}
//             placeholder="e.g. Akmal"
//           />
//         </Field>

//         <Field label="Type">
//           <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//             {["I owe", "Owes me"].map((t) => (
//               <button
//                 key={t}
//                 onClick={() => setForm((f) => ({ ...f, type: t }))}
//                 style={{
//                   flex: "1 1 auto",
//                   padding: "9px 0",
//                   borderRadius: 10,
//                   border: "1.5px solid",
//                   cursor: "pointer",
//                   fontWeight: 700,
//                   fontSize: 13,
//                   borderColor:
//                     form.type === t
//                       ? t === "I owe"
//                         ? "#EF4444"
//                         : "#10B981"
//                       : "#E5E7EB",
//                   background:
//                     form.type === t
//                       ? t === "I owe"
//                         ? "#FFF1F2"
//                         : "#F0FDF4"
//                       : "#fff",
//                   color:
//                     form.type === t
//                       ? t === "I owe"
//                         ? "#EF4444"
//                         : "#10B981"
//                       : "#374151",
//                   minWidth: "100px",
//                 }}
//               >
//                 {t}
//               </button>
//             ))}
//           </div>
//         </Field>

//         <Field label="Amount (UZS)">
//           <input
//             type="number"
//             value={form.amt}
//             onChange={(e) => setForm((f) => ({ ...f, amt: e.target.value }))}
//             style={inputStyle}
//             placeholder="e.g. 500000"
//           />
//         </Field>

//         <Field label="Date">
//           <input
//             type="date"
//             value={form.date}
//             onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
//             style={inputStyle}
//           />
//         </Field>

//         <Field label="Due Date">
//           <input
//             type="date"
//             value={form.due}
//             onChange={(e) => setForm((f) => ({ ...f, due: e.target.value }))}
//             style={inputStyle}
//           />
//         </Field>

//         <Field label="Status">
//           <div style={{ display: "flex", gap: 8 }}>
//             {["Open", "Closed"].map((s) => (
//               <button
//                 key={s}
//                 onClick={() => setForm((f) => ({ ...f, status: s }))}
//                 style={{
//                   flex: 1,
//                   padding: "9px 0",
//                   borderRadius: 10,
//                   border: "1.5px solid",
//                   cursor: "pointer",
//                   fontWeight: 700,
//                   fontSize: 13,
//                   borderColor:
//                     form.status === s
//                       ? s === "Open"
//                         ? "#6366F1"
//                         : "#9CA3AF"
//                       : "#E5E7EB",
//                   background:
//                     form.status === s
//                       ? s === "Open"
//                         ? "#EEF2FF"
//                         : "#F9FAFB"
//                       : "#fff",
//                   color:
//                     form.status === s
//                       ? s === "Open"
//                         ? "#6366F1"
//                         : "#4B5563"
//                       : "#374151",
//                 }}
//               >
//                 {s}
//               </button>
//             ))}
//           </div>
//         </Field>

//         <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
//           <button
//             onClick={onClose}
//             style={{
//               flex: 1,
//               padding: "10px 0",
//               borderRadius: 10,
//               border: "1.5px solid #E5E7EB",
//               background: "#fff",
//               fontWeight: 600,
//               cursor: "pointer",
//             }}
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handle}
//             style={{
//               flex: 1,
//               padding: "10px 0",
//               borderRadius: 10,
//               border: "none",
//               background: "#1D3557",
//               color: "#fff",
//               fontWeight: 700,
//               cursor: "pointer",
//             }}
//           >
//             {editItem ? "Save Changes" : "Add"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function WaveCard({ title, amount, sub, positive }) {
//   const color = positive ? "#10B981" : "#EF4444";
//   const bg = positive ? "#F0FDF4" : "#FFF1F2";

//   return (
//     <div
//       style={{
//         flex: "1 1 150px",
//         minWidth: 200,
//         background: bg,
//         borderRadius: 16,
//         padding: "20px 24px",
//         position: "relative",
//         overflow: "hidden",
//       }}
//     >
//       <div
//         style={{
//           position: "absolute",
//           bottom: 0,
//           left: 0,
//           right: 0,
//           opacity: 0.15,
//           pointerEvents: "none",
//         }}
//       >
//         <svg
//           viewBox="0 0 300 60"
//           preserveAspectRatio="none"
//           width="100%"
//           height="50"
//         >
//           <path
//             d="M0,40 C60,10 120,55 180,30 C240,5 270,45 300,35 L300,60 L0,60 Z"
//             fill={color}
//           />
//           <path
//             d="M0,50 C80,25 160,55 230,35 C265,25 285,45 300,40 L300,60 L0,60 Z"
//             fill={color}
//             opacity="0.6"
//           />
//         </svg>
//       </div>

//       <div
//         style={{
//           fontSize: 13,
//           fontWeight: 700,
//           color: "#374151",
//           marginBottom: 8,
//         }}
//       >
//         {title}
//       </div>

//       <div
//         style={{
//           fontSize: "clamp(20px, 4vw, 26px)",
//           fontWeight: 800,
//           color,
//           letterSpacing: "-0.5px",
//           wordBreak: "break-word",
//         }}
//       >
//         {positive ? "+" : "-"}
//         {fmt(amount)}{" "}
//         <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.7 }}>UZS</span>
//         <span style={{ fontSize: 16, marginLeft: 6 }}>
//           {positive ? "↑" : "↓"}
//         </span>
//       </div>

//       <div
//         style={{
//           fontSize: 12,
//           color: "#9CA3AF",
//           marginTop: 6,
//           fontWeight: 500,
//         }}
//       >
//         {sub}
//       </div>
//     </div>
//   );
// }

// function DeleteModal({ item, onClose, onConfirm }) {
//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         background: "rgba(0,0,0,0.35)",
//         zIndex: 50,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: "16px",
//       }}
//     >
//       <div
//         style={{
//           background: "#fff",
//           borderRadius: 20,
//           padding: 32,
//           width: "100%",
//           maxWidth: 340,
//           boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
//           textAlign: "center",
//         }}
//       >
//         <div style={{ fontSize: 44, marginBottom: 12 }}>🗑️</div>

//         <h3
//           style={{ fontFamily: "Georgia,serif", fontSize: 19, marginBottom: 8 }}
//         >
//           Delete Record?
//         </h3>

//         <p
//           style={{
//             color: "#6B7280",
//             fontSize: 14,
//             marginBottom: 24,
//             wordBreak: "break-word",
//           }}
//         >
//           <strong>{item.person}</strong> — {item.type === "I owe" ? "-" : "+"}
//           {fmt(item.amt)} UZS will be removed.
//         </p>

//         <div style={{ display: "flex", gap: 10 }}>
//           <button
//             onClick={onClose}
//             style={{
//               flex: 1,
//               padding: "11px 0",
//               borderRadius: 10,
//               border: "1.5px solid #E5E7EB",
//               background: "#fff",
//               fontWeight: 600,
//               cursor: "pointer",
//             }}
//           >
//             Cancel
//           </button>

//           <button
//             onClick={onConfirm}
//             style={{
//               flex: 1,
//               padding: "11px 0",
//               borderRadius: 10,
//               border: "none",
//               background: "#EF4444",
//               color: "#fff",
//               fontWeight: 700,
//               cursor: "pointer",
//             }}
//           >
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function Debts() {
//   const [records, setRecords] = useState(INITIAL_DEBTS);
//   const [page, setPage] = useState(1);
//   const [modal, setModal] = useState(null);
//   const [deleteTarget, setDeleteTarget] = useState(null);
//   const [filterType] = useState("All");
//   const [filterStatus] = useState("All");

//   const filtered = records.filter(
//     (r) =>
//       (filterType === "All" || r.type === filterType) &&
//       (filterStatus === "All" || r.status === filterStatus),
//   );

//   const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
//   const paginated = filtered.slice(
//     (page - 1) * ITEMS_PER_PAGE,
//     page * ITEMS_PER_PAGE,
//   );

//   const totalDebts = records
//     .filter((r) => r.type === "I owe")
//     .reduce((s, r) => s + Math.abs(r.amt), 0);

//   const totalRec = records
//     .filter((r) => r.type === "Owes me")
//     .reduce((s, r) => s + r.amt, 0);

//   const debtPeople = new Set(
//     records.filter((r) => r.type === "I owe").map((r) => r.person),
//   ).size;

//   const recPeople = new Set(
//     records.filter((r) => r.type === "Owes me").map((r) => r.person),
//   ).size;

//   const handleSave = (form) => {
//     if (form.id) {
//       setRecords((rs) =>
//         rs.map((r) => (r.id === form.id ? { ...r, ...form } : r)),
//       );
//     } else {
//       setRecords((rs) => [...rs, { ...form, id: Date.now() }]);
//     }
//     setModal(null);
//   };

//   const handleDelete = () => {
//     setRecords((rs) => rs.filter((r) => r.id !== deleteTarget.id));
//     setDeleteTarget(null);
//     if (page > Math.ceil((filtered.length - 1) / ITEMS_PER_PAGE))
//       setPage((p) => Math.max(1, p - 1));
//   };

//   const toggleStatus = (id) => {
//     setRecords((rs) =>
//       rs.map((r) =>
//         r.id === id
//           ? { ...r, status: r.status === "Open" ? "Closed" : "Open" }
//           : r,
//       ),
//     );
//   };

//   const pageNums = [];
//   for (let i = 1; i <= totalPages; i++) pageNums.push(i);

//   const visiblePages = pageNums.filter(
//     (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
//   );

//   const thStyle = {
//     padding: "11px 14px",
//     fontSize: 12,
//     fontWeight: 700,
//     color: "white",
//     textAlign: "left",
//     letterSpacing: 0.5,
//     textTransform: "uppercase",
//     borderBottom: "2px solid #F3F4F6",
//     background: "#0A2560",
//   };

//   const tdStyle = {
//     padding: "11px 14px",
//     fontSize: 13,
//     color: "#374151",
//     borderBottom: "1px solid #F9FAFB",
//     verticalAlign: "middle",
//   };

//   return (
//     <div>
//       <style>{`
//         * {
//           box-sizing: border-box;
//         }

//         tr:hover td {
//           background: #FAFAFA;
//         }

//         .act-btn {
//           background: none;
//           border: none;
//           cursor: pointer;
//           padding: 5px;
//           border-radius: 7px;
//           transition: background 0.15s;
//         }

//         .act-btn:hover {
//           background: #F3F4F6;
//         }

//         .page-btn {
//           min-width: 34px;
//           height: 34px;
//           border-radius: 8px;
//           border: none;
//           font-size: 13px;
//           font-weight: 600;
//           cursor: pointer;
//           background: #fff;
//           color: #374151;
//           border: 1px solid #E5E7EB;
//         }

//         .page-btn:hover:not(:disabled) {
//           background: #EEF2FF;
//           color: #6366F1;
//         }

//         .page-btn:disabled {
//           opacity: 0.5;
//           cursor: not-allowed;
//         }

//         .filter-btn {
//           padding: 6px 14px;
//           border-radius: 8px;
//           border: 1.5px solid #E5E7EB;
//           background: #fff;
//           font-size: 12px;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.15s;
//         }

//         .filter-btn.active {
//           border-color: #6366F1;
//           background: #EEF2FF;
//           color: #6366F1;
//         }

//         /* Desktop styles */
//         .desktop-table {
//           display: table;
//           width: 100%;
//         }

//         .mobile-cards {
//           display: none;
//         }

//         /* Tablet styles */
//         @media (max-width: 1024px) {
//           .wave-cards-container {
//             flex-direction: column;
//           }

//           .wave-cards-container > div {
//             width: 100%;
//           }
//         }

//         /* Mobile styles */
//         @media (max-width: 768px) {
//           .hide-mobile {
//             display: none !important;
//           }

//           .desktop-table {
//             display: none !important;
//           }

//           .mobile-cards {
//             display: block !important;
//           }

//           .filters-section {
//             flex-direction: column;
//             align-items: flex-start !important;
//             width: 100%;
//           }

//           .filters-section h3 {
//             margin-bottom: 10px;
//           }

//           .filter-buttons-container {
//             width: 100%;
//             justify-content: space-between;
//           }

//           .filter-group {
//             display: flex;
//             flex-wrap: wrap;
//             gap: 4px;
//             flex: 1;
//           }

//           .filter-btn {
//             padding: 4px 8px;
//             font-size: 11px;
//             flex: 1 1 auto;
//           }

//           .action-buttons {
//             flex-direction: column;
//             width: 100%;
//           }

//           .action-buttons button {
//             width: 100%;
//           }

//           .pagination-wrapper {
//             flex-direction: column;
//             align-items: center;
//             gap: 12px;
//           }

//           .pagination-controls {
//             flex-wrap: wrap;
//             justify-content: center;
//             order: 2;
//           }

//           .page-info {
//             order: 1;
//           }

//           .page-numbers {
//             display: none;
//           }

//           .page-btn {
//             min-width: 40px;
//             height: 40px;
//           }
//         }

//         /* Small mobile styles */
//         @media (max-width: 480px) {
//           .filter-group {
//             width: 100%;
//           }

//           .filter-btn {
//             flex: 1 1 calc(50% - 4px);
//           }

//           .filter-divider {
//             display: none;
//           }

//           .summary-cards {
//             gap: 8px;
//           }

//           .summary-cards > div {
//             padding: 16px;
//           }
//         }
//       `}</style>

//       <div className="shadow-sm bg-white p-3 sm:p-5 border border-[#E0E0E0] rounded-2xl">
//         {/* Header */}
//         <div
//           className="action-buttons"
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: 22,
//             flexWrap: "wrap",
//             gap: 10,
//           }}
//         >
//           <h3
//             style={{
//               fontSize: "clamp(18px, 4vw, 24px)",
//               color: "#1F2937",
//               margin: 0,
//             }}
//           >
//             Total Debts and Receivables
//           </h3>

//           <div
//             style={{
//               display: "flex",
//               gap: 10,
//               flexWrap: "wrap",
//               width: "100%",
//               maxWidth: "400px",
//             }}
//           >
//             <button
//               onClick={() => setModal("receivable")}
//               style={{
//                 flex: "1 1 auto",
//                 background: "#10B981",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: 11,
//                 padding: "10px 18px",
//                 fontWeight: 700,
//                 fontSize: 13,
//                 cursor: "pointer",
//                 whiteSpace: "nowrap",
//               }}
//             >
//               + Add Receivable
//             </button>

//             <button
//               onClick={() => setModal("debt")}
//               style={{
//                 flex: "1 1 auto",
//                 background: "#EF4444",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: 11,
//                 padding: "10px 18px",
//                 fontWeight: 700,
//                 fontSize: 13,
//                 cursor: "pointer",
//                 whiteSpace: "nowrap",
//               }}
//             >
//               + Add Debt
//             </button>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div
//           className="wave-cards-container summary-cards"
//           style={{
//             display: "flex",
//             gap: "16px",
//             marginBottom: "28px",
//             flexWrap: "wrap",
//           }}
//         >
//           <WaveCard
//             title="Total Debts (I owe)"
//             amount={totalDebts}
//             sub={`Across ${debtPeople} people`}
//             positive={false}
//           />

//           <WaveCard
//             title="Total Receivables (Owes me)"
//             amount={totalRec}
//             sub={`Across ${recPeople} people`}
//             positive={true}
//           />
//         </div>

//         {/* Table Card */}
//         <div className="bg-white rounded-2xl shadow p-3 sm:p-5">
//           {/* Table header */}
//           <div
//             className="filters-section"
//             style={{
//               display: "flex",
//               flexWrap: "wrap",
//               justifyContent: "space-between",
//               alignItems: "center",
//               gap: "12px",
//               marginBottom: "16px",
//             }}
//           >
//             <h3
//               style={{
//                 fontSize: "clamp(15px, 3vw, 17px)",
//                 color: "#1F2937",
//                 margin: 0,
//               }}
//             >
//               Expense Transactions
//             </h3>
//           </div>

//           <div className="overflow-x-auto">
//             {/* Desktop Table View */}
//             <table className="min-w-full border-collapse desktop-table">
//               <thead>
//                 <tr>
//                   <th style={thStyle}>People</th>
//                   <th style={thStyle}>Type</th>
//                   <th style={thStyle}>Amount</th>
//                   <th style={{ ...thStyle }} className="hide-mobile">
//                     Date
//                   </th>
//                   <th style={{ ...thStyle }} className="hide-mobile">
//                     Due Date
//                   </th>
//                   <th style={thStyle}>Status</th>
//                   <th style={{ ...thStyle, textAlign: "right" }}>Action</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {paginated.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan={7}
//                       style={{
//                         textAlign: "center",
//                         padding: 40,
//                         color: "#9CA3AF",
//                         fontSize: 14,
//                       }}
//                     >
//                       No records found
//                     </td>
//                   </tr>
//                 ) : (
//                   paginated.map((r) => (
//                     <tr key={r.id}>
//                       <td style={{ ...tdStyle, fontWeight: 700 }}>
//                         {r.person}
//                       </td>

//                       <td style={tdStyle}>
//                         <span
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 5,
//                           }}
//                         >
//                           <span
//                             style={{
//                               width: 8,
//                               height: 8,
//                               borderRadius: "50%",
//                               background:
//                                 r.type === "I owe" ? "#EF4444" : "#10B981",
//                               flexShrink: 0,
//                             }}
//                           />
//                           <span
//                             style={{
//                               color: r.type === "I owe" ? "#EF4444" : "#10B981",
//                               fontWeight: 600,
//                             }}
//                           >
//                             {r.type}
//                           </span>
//                         </span>
//                       </td>

//                       <td
//                         style={{
//                           ...tdStyle,
//                           fontWeight: 700,
//                           color: r.type === "I owe" ? "#EF4444" : "#10B981",
//                         }}
//                       >
//                         {r.type === "I owe" ? "-" : "+"}
//                         {fmt(r.amt)} UZS
//                       </td>

//                       <td style={tdStyle} className="hide-mobile">
//                         {r.date}
//                       </td>
//                       <td style={tdStyle} className="hide-mobile">
//                         {r.due || "—"}
//                       </td>

//                       <td style={tdStyle}>
//                         <button
//                           onClick={() => toggleStatus(r.id)}
//                           style={{
//                             padding: "4px 14px",
//                             borderRadius: 8,
//                             border: "1.5px solid",
//                             fontSize: 12,
//                             fontWeight: 700,
//                             cursor: "pointer",
//                             borderColor:
//                               r.status === "Open" ? "#6366F1" : "#D1D5DB",
//                             background:
//                               r.status === "Open" ? "#EEF2FF" : "#F9FAFB",
//                             color: r.status === "Open" ? "#6366F1" : "#9CA3AF",
//                             whiteSpace: "nowrap",
//                           }}
//                         >
//                           {r.status}
//                         </button>
//                       </td>

//                       <td style={{ ...tdStyle, textAlign: "right" }}>
//                         <button
//                           className="act-btn"
//                           onClick={() => setModal(r)}
//                           title="Edit"
//                         >
//                           <svg
//                             width="15"
//                             height="15"
//                             fill="none"
//                             stroke="#6B7280"
//                             strokeWidth="1.8"
//                             viewBox="0 0 24 24"
//                           >
//                             <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
//                             <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
//                           </svg>
//                         </button>

//                         <button
//                           className="act-btn"
//                           onClick={() => setDeleteTarget(r)}
//                           title="Delete"
//                         >
//                           <svg
//                             width="15"
//                             height="15"
//                             fill="none"
//                             stroke="#6B7280"
//                             strokeWidth="1.8"
//                             viewBox="0 0 24 24"
//                           >
//                             <polyline points="3 6 5 6 21 6" />
//                             <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
//                             <path d="M10 11v6M14 11v6" />
//                             <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
//                           </svg>
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>

//             {/* Mobile Card View */}
//             <div className="mobile-cards">
//               {paginated.length === 0 ? (
//                 <div
//                   style={{
//                     textAlign: "center",
//                     padding: 40,
//                     color: "#9CA3AF",
//                     fontSize: 14,
//                   }}
//                 >
//                   No records found
//                 </div>
//               ) : (
//                 <div
//                   style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: "12px",
//                   }}
//                 >
//                   {paginated.map((r) => (
//                     <div
//                       key={r.id}
//                       style={{
//                         background: "white",
//                         border: "1px solid #E5E7EB",
//                         borderRadius: "12px",
//                         padding: "16px",
//                         boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
//                       }}
//                     >
//                       {/* Card Header */}
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                           marginBottom: "12px",
//                         }}
//                       >
//                         <span style={{ fontWeight: 700, fontSize: "16px" }}>
//                           {r.person}
//                         </span>
//                         <span
//                           style={{
//                             padding: "4px 10px",
//                             borderRadius: "16px",
//                             fontSize: "12px",
//                             fontWeight: 600,
//                             background:
//                               r.type === "I owe" ? "#FEF2F2" : "#F0FDF4",
//                             color: r.type === "I owe" ? "#EF4444" : "#10B981",
//                           }}
//                         >
//                           {r.type}
//                         </span>
//                       </div>

//                       {/* Amount */}
//                       <div
//                         style={{
//                           fontSize: "20px",
//                           fontWeight: 700,
//                           color: r.type === "I owe" ? "#EF4444" : "#10B981",
//                           marginBottom: "8px",
//                         }}
//                       >
//                         {r.type === "I owe" ? "-" : "+"}
//                         {fmt(r.amt)} UZS
//                       </div>

//                       {/* Dates */}
//                       <div
//                         style={{
//                           display: "flex",
//                           gap: "16px",
//                           fontSize: "13px",
//                           color: "#6B7280",
//                           marginBottom: "12px",
//                         }}
//                       >
//                         <span>📅 {r.date}</span>
//                         <span>⏰ {r.due || "—"}</span>
//                       </div>

//                       {/* Footer */}
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                         }}
//                       >
//                         <button
//                           onClick={() => toggleStatus(r.id)}
//                           style={{
//                             padding: "4px 14px",
//                             borderRadius: "20px",
//                             border: "1.5px solid",
//                             fontSize: "12px",
//                             fontWeight: 700,
//                             cursor: "pointer",
//                             borderColor:
//                               r.status === "Open" ? "#6366F1" : "#D1D5DB",
//                             background:
//                               r.status === "Open" ? "#EEF2FF" : "#F9FAFB",
//                             color: r.status === "Open" ? "#6366F1" : "#9CA3AF",
//                           }}
//                         >
//                           {r.status}
//                         </button>

//                         {/* Edit vs Delete */}
//                         <div style={{ display: "flex", gap: "8px" }}>
//                           <button
//                             className="act-btn"
//                             onClick={() => setModal(r)}
//                             title="Edit"
//                           >
//                             <svg
//                               width="18"
//                               height="18"
//                               fill="none"
//                               stroke="#6B7280"
//                               strokeWidth="1.8"
//                               viewBox="0 0 24 24"
//                             >
//                               <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
//                               <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
//                             </svg>
//                           </button>
//                           <button
//                             className="act-btn"
//                             onClick={() => setDeleteTarget(r)}
//                             title="Delete"
//                           >
//                             <svg
//                               width="18"
//                               height="18"
//                               fill="none"
//                               stroke="#6B7280"
//                               strokeWidth="1.8"
//                               viewBox="0 0 24 24"
//                             >
//                               <polyline points="3 6 5 6 21 6" />
//                               <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
//                               <path d="M10 11v6M14 11v6" />
//                               <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
//                             </svg>
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Pagination */}
//           <div className="flex flex-wrap justify-between items-center gap-4 border-t border-gray-200 pt-4 mt-4">
//             {/* Left info */}
//             <span className="text-xs text-gray-400 order-1 sm:order-1">
//               Showing{" "}
//               {filtered.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1}–
//               {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of{" "}
//               {filtered.length} records
//             </span>

//             {/* Center pagination */}
//             <div className="flex gap-2 items-center order-3 sm:order-2 mx-auto flex-wrap">
//               {/* Previous button */}
//               <button
//                 onClick={() => setPage((p) => Math.max(1, p - 1))}
//                 disabled={page === 1}
//                 className={` flex items-center gap-1 px-3 h-8 rounded-lg border border-gray-200 bg-white text-gray-700 ${page === 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
//               >
//                 <ArrowLeft size={15} />
//                 <span className="hidden sm:inline">Previous</span>
//               </button>

//               {/* Page numbers */}
//               <div className="flex gap-1">
//                 {visiblePages.map((p, i, arr) => (
//                   <React.Fragment key={p}>
//                     {i > 0 && arr[i - 1] !== p - 1 && (
//                       <span style={{ color: "#9CA3AF", fontSize: 13 }}>…</span>
//                     )}
//                     <button
//                       onClick={() => setPage(p)}
//                       style={{
//                         padding: "0 10px",
//                         height: 32,
//                         borderRadius: 8,
//                         border: `1.5px solid ${page === p ? "#1D3557" : "#E5E7EB"}`,
//                         background: page === p ? "#1D3557" : "#fff",
//                         color: page === p ? "#fff" : "#374151",
//                         cursor: "pointer",
//                       }}
//                     >
//                       {p}
//                     </button>
//                   </React.Fragment>
//                 ))}
//               </div>

//               {/* Next button */}
//               <button
//                 onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                 disabled={page === totalPages}
//                 className={`flex items-center gap-1 px-3 h-8 rounded-lg border border-gray-200 bg-white text-gray-700 ${page === totalPages ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
//               >
//                 <span className="hidden sm:inline">Next</span>
//                 <ArrowRight size={15} />
//               </button>
//             </div>

//             {/* Right info */}
//             <span className="text-xs text-gray-400 order-2 sm:order-3">
//               Page {page} of {totalPages || 1}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Add/Edit Modal */}
//       {modal && (
//         <Modal
//           onClose={() => setModal(null)}
//           onSave={handleSave}
//           editItem={typeof modal === "object" && modal.id ? modal : null}
//           defaultType={
//             modal === "debt"
//               ? "I owe"
//               : modal === "receivable"
//                 ? "Owes me"
//                 : modal.type
//           }
//         />
//       )}

//       {/* Delete Modal */}
//       {deleteTarget && (
//         <DeleteModal
//           item={deleteTarget}
//           onClose={() => setDeleteTarget(null)}
//           onConfirm={handleDelete}
//         />
//       )}
//     </div>
//   );
// }