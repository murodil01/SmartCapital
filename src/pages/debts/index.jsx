import { useState } from "react";
import React from "react";

const INITIAL_DEBTS = [
  {
    id: 1,

    person: "Akmal",

    type: "I owe",

    amt: -120000,

    date: "2025-06-06",

    due: "2025-07-06",

    status: "Open",
  },

  {
    id: 2,

    person: "Jasur",

    type: "Owes me",

    amt: 1000000,

    date: "2025-06-05",

    due: "2025-07-05",

    status: "Open",
  },

  {
    id: 3,

    person: "Nozim",

    type: "I owe",

    amt: -120000,

    date: "2025-06-04",

    due: "2025-07-04",

    status: "Closed",
  },

  {
    id: 4,

    person: "Dilshod",

    type: "I owe",

    amt: -215000,

    date: "2025-06-03",

    due: "2025-07-03",

    status: "Open",
  },

  {
    id: 5,

    person: "Malika",

    type: "Owes me",

    amt: 1000000,

    date: "2025-06-06",

    due: "2025-07-06",

    status: "Open",
  },

  {
    id: 6,

    person: "Sevinch",

    type: "I owe",

    amt: -120000,

    date: "2025-06-06",

    due: "2025-07-06",

    status: "Closed",
  },

  {
    id: 7,

    person: "Muslima",

    type: "Owes me",

    amt: 1500000,

    date: "2025-06-06",

    due: "2025-07-06",

    status: "Closed",
  },

  {
    id: 8,

    person: "Sevara",

    type: "I owe",

    amt: -120000,

    date: "2025-06-06",

    due: "2025-07-06",

    status: "Open",
  },

  {
    id: 9,

    person: "Bobur",

    type: "I owe",

    amt: -300000,

    date: "2025-06-01",

    due: "2025-07-01",

    status: "Open",
  },

  {
    id: 10,

    person: "Zulfiya",

    type: "Owes me",

    amt: 500000,

    date: "2025-06-02",

    due: "2025-07-02",

    status: "Open",
  },

  {
    id: 11,

    person: "Kamol",

    type: "I owe",

    amt: -450000,

    date: "2025-05-28",

    due: "2025-06-28",

    status: "Closed",
  },

  {
    id: 12,

    person: "Sherzod",

    type: "Owes me",

    amt: 2000000,

    date: "2025-05-25",

    due: "2025-06-25",

    status: "Open",
  },

  {
    id: 13,

    person: "Nodira",

    type: "I owe",

    amt: -180000,

    date: "2025-05-20",

    due: "2025-06-20",

    status: "Open",
  },

  {
    id: 14,

    person: "Umid",

    type: "Owes me",

    amt: 750000,

    date: "2025-05-18",

    due: "2025-06-18",

    status: "Closed",
  },

  {
    id: 15,

    person: "Hulkar",

    type: "I owe",

    amt: -90000,

    date: "2025-05-15",

    due: "2025-06-15",

    status: "Open",
  },

  {
    id: 16,

    person: "Sanjar",

    type: "Owes me",

    amt: 1200000,

    date: "2025-05-12",

    due: "2025-06-12",

    status: "Open",
  },

  {
    id: 17,

    person: "Feruza",

    type: "I owe",

    amt: -600000,

    date: "2025-05-10",

    due: "2025-06-10",

    status: "Closed",
  },

  {
    id: 18,

    person: "Otabek",

    type: "Owes me",

    amt: 350000,

    date: "2025-05-08",

    due: "2025-06-08",

    status: "Open",
  },

  {
    id: 19,

    person: "Lola",

    type: "I owe",

    amt: -250000,

    date: "2025-05-05",

    due: "2025-06-05",

    status: "Open",
  },

  {
    id: 20,

    person: "Davron",

    type: "Owes me",

    amt: 900000,

    date: "2025-05-01",

    due: "2025-06-01",

    status: "Closed",
  },

  {
    id: 21,

    person: "Iroda",

    type: "I owe",

    amt: -130000,

    date: "2025-04-28",

    due: "2025-05-28",

    status: "Open",
  },
];

const ITEMS_PER_PAGE = 10;

const fmt = (n) => Math.abs(n).toLocaleString("uz-UZ").replace(/,/g, " ");

// Modal tashqarisida (yoki fayl boshida) qo‘yamiz

const Field = ({ label, children }) => (
  <div style={{ marginBottom: 14 }}>
    <label
      style={{
        fontSize: 12,
        color: "#6B7280",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: 0.8,
        display: "block",
        marginBottom: 5,
      }}
    >
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

function Modal({ onClose, onSave, editItem }) {
  const [form, setForm] = useState(
    editItem
      ? {
          person: editItem.person,
          type: editItem.type,
          amt: Math.abs(editItem.amt),
          date: editItem.date,
          due: editItem.due,
          status: editItem.status,
        }
      : {
          person: "",
          type: "I owe",
          amt: "",
          date: new Date().toISOString().slice(0, 10),
          due: "",
          status: "Open",
        },
  );

  const handle = () => {
    if (!form.person || !form.amt) return;

    const amt =
      form.type === "I owe"
        ? -Math.abs(Number(form.amt))
        : Math.abs(Number(form.amt));

    onSave({ ...form, amt });
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
      }}
    >
      <div
        style={{
          background: "#fff",

          borderRadius: 20,

          padding: 28,

          width: 380,

          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        }}
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
            : form.type === "I owe"
              ? "Add Debt"
              : "Add Receivable"}
        </h3>

        <Field label="Person Name">
          <input
            value={form.person}
            onChange={(e) => setForm((f) => ({ ...f, person: e.target.value }))}
            style={inputStyle}
            placeholder="e.g. Akmal"
          />
        </Field>

        <Field label="Type">
          <div style={{ display: "flex", gap: 8 }}>
            {["I owe", "Owes me"].map((t) => (
              <button
                key={t}
                onClick={() => setForm((f) => ({ ...f, type: t }))}
                style={{
                  flex: 1,

                  padding: "9px 0",

                  borderRadius: 10,

                  border: "1.5px solid",

                  cursor: "pointer",

                  fontWeight: 700,

                  fontSize: 13,

                  borderColor:
                    form.type === t
                      ? t === "I owe"
                        ? "#EF4444"
                        : "#10B981"
                      : "#E5E7EB",

                  background:
                    form.type === t
                      ? t === "I owe"
                        ? "#FFF1F2"
                        : "#F0FDF4"
                      : "#fff",

                  color:
                    form.type === t
                      ? t === "I owe"
                        ? "#EF4444"
                        : "#10B981"
                      : "#374151",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Amount (UZS)">
          <input
            type="number"
            value={form.amt}
            onChange={(e) => setForm((f) => ({ ...f, amt: e.target.value }))}
            style={inputStyle}
            placeholder="e.g. 500000"
          />
        </Field>

        {/* Qolgan date, due va status fieldlar ham xuddi shu tarzda */}

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,

              padding: "10px 0",

              borderRadius: 10,

              border: "1.5px solid #E5E7EB",

              background: "#fff",

              fontWeight: 600,

              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={handle}
            style={{
              flex: 1,

              padding: "10px 0",

              borderRadius: 10,

              border: "none",

              background: "#1D3557",

              color: "#fff",

              fontWeight: 700,

              cursor: "pointer",
            }}
          >
            {editItem ? "Save Changes" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

function WaveCard({ title, amount, sub, positive }) {
  const color = positive ? "#10B981" : "#EF4444";

  const bg = positive ? "#F0FDF4" : "#FFF1F2";

  return (
    <div
      style={{
        flex: 1,
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
          fontSize: 26,
          fontWeight: 800,
          color,
          letterSpacing: "-0.5px",
        }}
      >
        {positive ? "+" : "-"}
        {fmt(amount)}{" "}
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
        {sub}
      </div>
    </div>
  );
}

function DeleteModal({ item, onClose, onConfirm }) {
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
      }}
    >
      <div
        style={{
          background: "#fff",

          borderRadius: 20,

          padding: 32,

          width: 340,

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

        <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 24 }}>
          <strong>{item.person}</strong> — {item.type === "I owe" ? "-" : "+"}
          {fmt(item.amt)} UZS will be removed.
        </p>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,

              padding: "11px 0",

              borderRadius: 10,

              border: "1.5px solid #E5E7EB",

              background: "#fff",

              fontWeight: 600,

              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            style={{
              flex: 1,

              padding: "11px 0",

              borderRadius: 10,

              border: "none",

              background: "#EF4444",

              color: "#fff",

              fontWeight: 700,

              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Debts() {
  const [records, setRecords] = useState(INITIAL_DEBTS);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null); // null | "receivable" | "debt" | {edit}
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const filtered = records.filter(
    (r) =>
      (filterType === "All" || r.type === filterType) &&
      (filterStatus === "All" || r.status === filterStatus),
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,

    page * ITEMS_PER_PAGE,
  );
  const totalDebts = records

    .filter((r) => r.type === "I owe")

    .reduce((s, r) => s + Math.abs(r.amt), 0);

  const totalRec = records

    .filter((r) => r.type === "Owes me")

    .reduce((s, r) => s + r.amt, 0);

  const debtPeople = new Set(
    records.filter((r) => r.type === "I owe").map((r) => r.person),
  ).size;

  const recPeople = new Set(
    records.filter((r) => r.type === "Owes me").map((r) => r.person),
  ).size;

  const handleSave = (form) => {
    if (modal?.id) {
      setRecords((rs) =>
        rs.map((r) => (r.id === modal.id ? { ...r, ...form } : r)),
      );
    } else {
      setRecords((rs) => [...rs, { ...form, id: Date.now() }]);
    }

    setModal(null);
  };

  const handleDelete = () => {
    setRecords((rs) => rs.filter((r) => r.id !== deleteTarget.id));

    setDeleteTarget(null);

    if (page > Math.ceil((filtered.length - 1) / ITEMS_PER_PAGE))
      setPage((p) => Math.max(1, p - 1));
  };

  const toggleStatus = (id) => {
    setRecords((rs) =>
      rs.map((r) =>
        r.id === id
          ? { ...r, status: r.status === "Open" ? "Closed" : "Open" }
          : r,
      ),
    );
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

  return (
    <div>
      <style>{`
        tr:hover td { background:#FAFAFA; }
        .act-btn { background:none; border:none; cursor:pointer; padding:5px; border-radius:7px; transition:background 0.15s; }
        .act-btn:hover { background:#F3F4F6; }
        .page-btn { min-width:34px; height:34px; border-radius:8px; border:none; font-size:13px; font-weight:600; cursor:pointer; background:#fff; color:#374151; border:1px solid #E5E7EB; }
        .page-btn:hover { background:#EEF2FF; color:#6366F1; }
        .filter-btn { padding:6px 14px; border-radius:8px; border:1.5px solid #E5E7EB; background:#fff; font-size:12px; font-weight:600; cursor:pointer; transition:all 0.15s; }
        .filter-btn.active { border-color:#6366F1; background:#EEF2FF; color:#6366F1; }
        @media(max-width:640px){ .hide-mobile{ display:none!important; } }

      `}</style>

      <div className="shadow-sm bg-white p-5 border border-[#E0E0E0] rounded-2xl">
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 22,
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <h3
            style={{
              fontSize: 24,
              color: "#1F2937",
              margin: 0,
            }}
          >
            Total Debts and Receivables
          </h3>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => setModal("receivable")}
              style={{
                background: "#10B981",
                color: "#fff",

                border: "none",

                borderRadius: 11,

                padding: "10px 18px",

                fontWeight: 700,

                fontSize: 13,

                cursor: "pointer",
              }}
            >
              + Add Receivable
            </button>

            <button
              onClick={() => setModal("debt")}
              style={{
                background: "#EF4444",

                color: "#fff",

                border: "none",

                borderRadius: 11,

                padding: "10px 18px",

                fontWeight: 700,

                fontSize: 13,

                cursor: "pointer",
              }}
            >
              + Add Debt
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="flex flex-col lg:flex-row gap-4 mb-7">
          <WaveCard
            title="Total Debts (I owe)"
            amount={totalDebts}
            sub={`Across ${debtPeople} people`}
            positive={false}
          />

          <WaveCard
            title="Total Receivables (Owes me)"
            amount={totalRec}
            sub={`Across ${recPeople} people`}
            positive={true}
          />
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow p-5 ">
          {/* Table header */}
          <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
            <h3
              style={{
                fontSize: 17,
                color: "#1F2937",
              }}
            >
              Expense Transactions
            </h3>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["All", "I owe", "Owes me"].map((t) => (
                <button
                  key={t}
                  className={`filter-btn${filterType === t ? " active" : ""}`}
                  onClick={() => {
                    setFilterType(t);

                    setPage(1);
                  }}
                >
                  {t}
                </button>
              ))}

              <div
                style={{ width: 1, background: "#E5E7EB", margin: "0 2px" }}
              />

              {["All", "Open", "Closed"].map((s) => (
                <button
                  key={s}
                  className={`filter-btn${filterStatus === s ? " active" : ""}`}
                  onClick={() => {
                    setFilterStatus(s);

                    setPage(1);
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th style={thStyle}>People</th>

                  <th style={thStyle}>Type</th>

                  <th style={thStyle}>Amount</th>

                  <th style={{ ...thStyle }} className="hide-mobile">
                    Date
                  </th>

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
                      colSpan={7}
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
                        {fmt(r.amt)} UZS
                      </td>

                      <td style={tdStyle} className="hide-mobile">
                        {r.date}
                      </td>

                      <td style={tdStyle} className="hide-mobile">
                        {r.due || "—"}
                      </td>

                      <td style={tdStyle}>
                        <button
                          onClick={() => toggleStatus(r.id)}
                          style={{
                            padding: "4px 14px",
                            borderRadius: 8,
                            border: "1.5px solid",
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                            borderColor:
                              r.status === "Open" ? "#6366F1" : "#D1D5DB",
                            background:
                              r.status === "Open" ? "#EEF2FF" : "#F9FAFB",
                            color: r.status === "Open" ? "#6366F1" : "#9CA3AF",
                          }}
                        >
                          {r.status}
                        </button>
                      </td>

                      <td style={{ ...tdStyle, textAlign: "right" }}>
                        <button
                          className="act-btn"
                          onClick={() => setModal(r)}
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
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap justify-between items-center gap-2 p-4 border-t border-gray-200">
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>
              Showing{" "}
              {filtered.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of{" "}
              {filtered.length} records
            </span>

            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
              <button
                className="page-btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ padding: "0 12px" }}
              >
                ‹ Previous
              </button>

              {visiblePages.map((p, i, arr) => (
                <React.Fragment key={p}>
                  {i > 0 && arr[i - 1] !== p - 1 && (
                    <span style={{ color: "#9CA3AF", fontSize: 13 }}>…</span>
                  )}

                  <button
                    className="page-btn"
                    onClick={() => setPage(p)}
                    style={{
                      background: page === p ? "#1D3557" : "#fff",
                      color: page === p ? "#fff" : "#374151",
                      borderColor: page === p ? "#1D3557" : "#E5E7EB",
                    }}
                  >
                    {p}
                  </button>
                </React.Fragment>
              ))}

              <button
                className="page-btn"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{ padding: "0 12px" }}
              >
                Next ›
              </button>
            </div>

            <span style={{ fontSize: 12, color: "#9CA3AF" }}>
              Page {page} of {totalPages || 1}
            </span>
          </div>
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
        />
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          item={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
