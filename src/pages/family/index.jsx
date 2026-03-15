import { useState, useEffect } from "react";

const COLORS = ["#2563eb", "#16a34a", "#7c3aed", "#d97706", "#dc2626"];

const initialMembers = [
  {
    name: "Sevinch Sharobidinova",
    role: "admin",
    joined: "2025-06-06",
    balance: 12000000,
  },
  {
    name: "Sevinch Sharobidinova",
    role: "member",
    joined: "2025-06-06",
    balance: 12000000,
  },
  {
    name: "Sevinch Sharobidinova",
    role: "child",
    joined: "2025-06-06",
    balance: 12000000,
  },
  {
    name: "Sevinch Sharobidinova",
    role: "member",
    joined: "2025-06-06",
    balance: 12000000,
  },
  {
    name: "Sevinch Sharobidinova",
    role: "member",
    joined: "2025-06-06",
    balance: 12000000,
  },
  {
    name: "Alisher Karimov",
    role: "member",
    joined: "2025-07-01",
    balance: 8000000,
  },
  {
    name: "Dilnoza Yusupova",
    role: "child",
    joined: "2025-07-15",
    balance: 3000000,
  },
  {
    name: "Bobur Toshmatov",
    role: "admin",
    joined: "2025-08-01",
    balance: 20000000,
  },
  {
    name: "Malika Nazarova",
    role: "member",
    joined: "2025-08-10",
    balance: 9000000,
  },
  {
    name: "Jasur Rahimov",
    role: "member",
    joined: "2025-09-01",
    balance: 11000000,
  },
  ...Array.from({ length: 11 }, (_, i) => ({
    name: `Family Member ${i + 11}`,
    role: "member",
    joined: "2025-09-15",
    balance: 5000000,
  })),
];

const initialGoals = [
  {
    name: "Family Vacation",
    emoji: "🏖️",
    current: 12000000,
    target: 15000000,
    color: "#2563eb",
  },
  {
    name: "New Car",
    emoji: "🚗",
    current: 12000000,
    target: 15000000,
    color: "#d97706",
  },
  {
    name: "Education",
    emoji: "🎓",
    current: 12000000,
    target: 15000000,
    color: "#7c3aed",
  },
];

const chartData = {
  "Monthly View": {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    income: [30, 38, 25, 42, 35, 48, 40, 50],
    expense: [15, 18, 10, 20, 16, 22, 18, 25],
    savings: [10, 15, 12, 18, 15, 20, 18, 22],
  },
  "Weekly View": {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    income: [20, 30, 25, 35, 40, 28, 32],
    expense: [10, 12, 8, 15, 18, 10, 14],
    savings: [8, 12, 10, 15, 18, 12, 14],
  },
  "Yearly View": {
    labels: ["2020", "2021", "2022", "2023", "2024", "2025"],
    income: [25, 32, 38, 42, 46, 50],
    expense: [12, 15, 18, 20, 22, 24],
    savings: [10, 14, 17, 20, 22, 24],
  },
};

const fmt = (n) => n?.toLocaleString("ru-RU").replace(/,/g, " ") ?? "0";
const initials = (name) =>
  name
    .split(" ")
    .map((x) => x[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const ROLE_STYLES = {
  admin: { bg: "#dcfce7", color: "#16a34a" },
  member: { bg: "#dbeafe", color: "#2563eb" },
  child: { bg: "#f3e8ff", color: "#7c3aed" },
};

const PER_PAGE = 5;

// ─── Sub-components ───────────────────────────────────────────────────────────

function Modal({ show, onClose, title, children }) {
  if (!show) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.45)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 16px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          width: "100%",
          maxWidth: 380,
          boxShadow: "0 20px 60px rgba(0,0,0,.18)",
          fontFamily: "'DM Sans', sans-serif",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 18 }}>
          {title}
        </h3>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label
        style={{
          display: "block",
          fontSize: 12,
          fontWeight: 600,
          color: "#64748b",
          marginBottom: 5,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  padding: "9px 12px",
  fontSize: 13,
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
};

function Btn({ onClick, children, variant = "primary", style = {} }) {
  const base = {
    flex: 1,
    border: "none",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background .2s",
  };
  const styles = {
    primary: { background: "#1a2550", color: "#fff" },
    secondary: { background: "#f1f5f9", color: "#1e293b" },
    outline: {
      background: "#eff6ff",
      color: "#2563eb",
      border: "1px solid #bfdbfe",
    },
  };
  return (
    <button onClick={onClick} style={{ ...base, ...styles[variant], ...style }}>
      {children}
    </button>
  );
}

function Toast({ msg }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        left: 20,
        background: "#1a2550",
        color: "#fff",
        maxWidth: 400,
        margin: "0 auto",
        padding: "12px 18px",
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 500,
        zIndex: 200,
        opacity: msg ? 1 : 0,
        transform: msg ? "translateY(0)" : "translateY(60px)",
        transition: "all .3s",
        textAlign: "center",
      }}
    >
      {msg}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Family() {
  const [members, setMembers] = useState(initialMembers);
  const [goals, setGoals] = useState(initialGoals);
  const [activity, setActivity] = useState([
    {
      name: "Name Surname",
      amount: 12000000,
      positive: true,
      time: "2 hours ago",
    },
    {
      name: "Name Surname",
      amount: 100000,
      positive: false,
      time: "2 hours ago",
    },
  ]);
  const [page, setPage] = useState(1);
  const [chartView, setChartView] = useState("Monthly View");

  const [inviteModal, setInviteModal] = useState(false);
  const [goalModal, setGoalModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [toast, setToast] = useState("");

  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    role: "member",
    balance: "",
  });
  const [editForm, setEditForm] = useState({
    name: "",
    role: "member",
    balance: "",
  });
  const [goalForm, setGoalForm] = useState({
    name: "",
    emoji: "",
    current: "",
    target: "",
  });

  const [isMobile, setIsMobile] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);

  useEffect(() => {
    const checkRes = () => {
      const width = window.innerWidth;
      setIsMobile(width < 1024);
      setIsSmallMobile(width < 480);
    };
    checkRes();
    window.addEventListener("resize", checkRes);
    return () => window.removeEventListener("resize", checkRes);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const totalPages = Math.ceil(members.length / PER_PAGE);
  const pageMembers = members.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleDelete = (idx) => {
    if (!window.confirm("Delete this member?")) return;
    setMembers((prev) => prev.filter((_, i) => i !== idx));
    if ((page - 1) * PER_PAGE >= members.length - 1 && page > 1)
      setPage((p) => p - 1);
    showToast("Member deleted");
  };

  const handleEdit = (idx) => {
    const m = members[idx];
    setEditIdx(idx);
    setEditForm({ name: m.name, role: m.role, balance: m.balance });
    setEditModal(true);
  };

  const saveEdit = () => {
    setMembers((prev) =>
      prev.map((m, i) =>
        i === editIdx
          ? {
              ...m,
              name: editForm.name || m.name,
              role: editForm.role,
              balance: +editForm.balance || m.balance,
            }
          : m,
      ),
    );
    setEditModal(false);
    showToast("Member updated");
  };

  const addMember = () => {
    if (!inviteForm.name.trim()) {
      showToast("Please enter a name");
      return;
    }
    const newM = {
      name: inviteForm.name,
      role: inviteForm.role,
      joined: new Date().toISOString().slice(0, 10),
      balance: +inviteForm.balance || 0,
    };
    setMembers((prev) => [...prev, newM]);
    setActivity((prev) => [
      {
        name: inviteForm.name,
        amount: +inviteForm.balance || 0,
        positive: true,
        time: "Just now",
      },
      ...prev,
    ]);
    setInviteForm({ name: "", email: "", role: "member", balance: "" });
    setInviteModal(false);
    showToast("Member invited successfully!");
  };

  const addGoal = () => {
    if (!goalForm.name.trim()) {
      showToast("Please enter goal name");
      return;
    }
    const colors = ["#2563eb", "#d97706", "#7c3aed", "#16a34a"];
    setGoals((prev) => [
      ...prev,
      {
        name: goalForm.name,
        emoji: goalForm.emoji || "🎯",
        current: +goalForm.current || 0,
        target: +goalForm.target || 15000000,
        color: colors[prev.length % colors.length],
      },
    ]);
    setGoalForm({ name: "", emoji: "", current: "", target: "" });
    setGoalModal(false);
    showToast("Goal added!");
  };

  const cd = chartData[chartView];
  const maxBar = 50;

  // ── Styles ─────────────────────────────────────────────────────────────────
  const s = {
    page: {
      minHeight: "100vh",
      padding: isSmallMobile ? 8 : isMobile ? 12 : 4,
      color: "#1e293b",
    },
    grid4: {
      display: "grid",
      gridTemplateColumns: isSmallMobile
        ? "1fr" // iPhone SE da 1 ustun
        : isMobile
          ? "1fr" // planshetda 1 ustun
          : "repeat(4,1fr)", // desktopda 4 ustun
      gap: isSmallMobile ? 12 : 16,
      marginBottom: 20,
    },
    statCard: (borderColor) => ({
      background: "#fff",
      borderRadius: 14,
      padding: isSmallMobile ? "14px 16px" : "18px 20px",
      borderLeft: `4px solid ${borderColor}`,
      boxShadow: "0 1px 4px rgba(0,0,0,.06)",
    }),
    main: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 300px",
      gap: 20,
    },
    card: {
      background: "#fff",
      borderRadius: 14,
      padding: isSmallMobile ? 12 : isMobile ? 16 : 24,
      boxShadow: "0 1px 4px rgba(0,0,0,.06)",
    },
    cardHeader: {
      display: "flex",
      flexDirection: isSmallMobile ? "column" : "row",
      alignItems: isSmallMobile ? "flex-start" : "center",
      justifyContent: "space-between",
      marginBottom: isSmallMobile ? 16 : 20,
      gap: 12,
    },
    cardTitle: { fontSize: isSmallMobile ? 15 : 16, fontWeight: 700 },
    th: {
      padding: isSmallMobile ? "8px 6px" : "12px",
      fontSize: isSmallMobile ? 11 : 12,
      fontWeight: 600,
      textAlign: "left",
      color: "#fff",
      whiteSpace: "nowrap",
    },
    td: {
      padding: isSmallMobile ? "10px 6px" : "12px",
      fontSize: isSmallMobile ? 12 : 13,
      verticalAlign: "middle",
      whiteSpace: "nowrap",
    },
    avatar: (color) => ({
      width: isSmallMobile ? 30 : 34,
      height: isSmallMobile ? 30 : 34,
      borderRadius: "50%",
      background: color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: isSmallMobile ? 10 : 12,
      fontWeight: 700,
      color: "#fff",
      flexShrink: 0,
    }),
    iconBtn: {
      background: "none",
      border: "1px solid #e2e8f0",
      borderRadius: 7,
      width: isSmallMobile ? 28 : 32,
      height: isSmallMobile ? 28 : 32,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all .15s",
      fontSize: isSmallMobile ? 12 : 14,
    },
    pageBtn: (active) => ({
      border: `1px solid ${active ? "#1a2550" : "#e2e8f0"}`,
      background: active ? "#1a2550" : "#fff",
      color: active ? "#fff" : "#1e293b",
      borderRadius: 6,
      minWidth: isSmallMobile ? 24 : 28,
      height: isSmallMobile ? 24 : 28,
      cursor: "pointer",
      fontSize: isSmallMobile ? 11 : 12,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 6px",
    }),
  };

  // Pagination uchun mobil versiya
  const renderPagination = () => {
    if (isSmallMobile) {
      // iPhone SE uchun soddalashtirilgan pagination
      return (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            style={{
              border: "1px solid #e2e8f0",
              background: "#fff",
              borderRadius: 6,
              padding: "0 8px",
              height: 28,
              cursor: "pointer",
              fontSize: 12,
            }}
            disabled={page === 1}
          >
            ‹
          </button>
          <span style={{ fontSize: 12 }}>
            {page}/{totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            style={{
              border: "1px solid #e2e8f0",
              background: "#fff",
              borderRadius: 6,
              padding: "0 8px",
              height: 28,
              cursor: "pointer",
              fontSize: 12,
            }}
            disabled={page === totalPages}
          >
            ›
          </button>
        </div>
      );
    }

    return (
      <>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          style={{
            border: "1px solid #e2e8f0",
            background: "#fff",
            borderRadius: 6,
            padding: "0 10px",
            height: 28,
            cursor: "pointer",
          }}
        >
          ‹ Prev
        </button>
        {Array.from(
          { length: Math.min(totalPages, 4) },
          (_, i) => i + 1,
        ).map((n) => (
          <button
            key={n}
            onClick={() => setPage(n)}
            style={s.pageBtn(page === n)}
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          style={{
            border: "1px solid #e2e8f0",
            background: "#fff",
            borderRadius: 6,
            padding: "0 10px",
            height: 28,
            cursor: "pointer",
          }}
        >
          Next ›
        </button>
      </>
    );
  };

  return (
    <>
      {/* Viewport meta uchun - HTML head qismiga qo'shilishi kerak */}
      <style>{`
        @media (max-width: 375px) {
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }
      `}</style>

      <div style={s.page}>
        {/* ── STATS ── */}
        <div style={s.grid4}>
          {[
            {
              label: "Family Balance",
              value: `${fmt(members.reduce((a, m) => a + m.balance, 0))}`,
              unit: "UZS",
              change: "↑ 12%",
              up: true,
              border: "#2563eb",
            },
            {
              label: "Total Income",
              value: "42 500 000",
              unit: "UZS",
              change: "↑ 18%",
              up: true,
              border: "#16a34a",
              valueColor: "#16a34a",
            },
            {
              label: "Total Expenses",
              value: "-3 200 000",
              unit: "UZS",
              change: "↓ 6%",
              up: false,
              border: "#dc2626",
              valueColor: "#dc2626",
            },
            {
              label: "Shared Budgets",
              value: members.length,
              unit: "Active",
              change: "Since last month",
              border: "#7c3aed",
            },
          ].map((st, i) => (
            <div key={i} style={s.statCard(st.border)}>
              <div style={{ fontSize: isSmallMobile ? 12 : 13, color: "#64748b", marginBottom: 6 }}>
                {st.label}
              </div>
              <div
                style={{
                  fontSize: isSmallMobile ? 18 : 22,
                  fontWeight: 700,
                  color: st.valueColor || "#1e293b",
                }}
              >
                {st.value}{" "}
                <span
                  style={{ fontSize: isSmallMobile ? 10 : 12, fontWeight: 500, color: "#64748b" }}
                >
                  {st.unit}
                </span>
              </div>
              <div style={{ fontSize: isSmallMobile ? 11 : 12, color: "#64748b", marginTop: 4 }}>
                <span
                  style={{
                    color:
                      st.up === true
                        ? "#16a34a"
                        : st.up === false
                          ? "#dc2626"
                          : "#64748b",
                  }}
                >
                  {st.change}
                </span>
                {st.up !== undefined && " Since last month"}
              </div>
            </div>
          ))}
        </div>

        {/* ── MAIN GRID ── */}
        <div style={s.main}>
          <div style={{ minWidth: 0 }}>
            {/* Members Table */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <span
                  style={{ ...s.cardTitle, fontFamily: "'Syne', sans-serif" }}
                >
                  Family Members
                </span>
                <button
                  onClick={() => setInviteModal(true)}
                  style={{
                    background: "#1a2550",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: isSmallMobile ? "8px 14px" : "9px 16px",
                    fontSize: isSmallMobile ? 12 : 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    width: isSmallMobile ? "100%" : "auto",
                    justifyContent: "center",
                  }}
                >
                  + Invite Member
                </button>
              </div>

              {/* Jadval gorizontal scroll bilan */}
              <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }} className="no-scrollbar">
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isSmallMobile ? 500 : "100%" }}>
                  <thead>
                    <tr style={{ background: "#1a2550" }}>
                      {["Member", "Role", "Joined", "Balance", "Action"].map(
                        (h, i) => (
                          <th
                            key={h}
                            style={{
                              ...s.th,
                              borderRadius:
                                i === 0
                                  ? "8px 0 0 8px"
                                  : i === 4
                                    ? "0 8px 8px 0"
                                    : 0,
                            }}
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {pageMembers.map((m, i) => {
                      const absIdx = (page - 1) * PER_PAGE + i;
                      const badge = ROLE_STYLES[m.role] || ROLE_STYLES.member;
                      return (
                        <tr
                          key={absIdx}
                          style={{ borderBottom: "1px solid #e2e8f0" }}
                        >
                          <td style={s.td}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: isSmallMobile ? 6 : 10,
                              }}
                            >
                              <div
                                style={s.avatar(COLORS[absIdx % COLORS.length])}
                              >
                                {initials(m.name)}
                              </div>
                              <span style={{ fontSize: isSmallMobile ? 12 : 13 }}>
                                {m.name.length > (isSmallMobile ? 10 : 20) 
                                  ? m.name.substring(0, isSmallMobile ? 8 : 18) + "..." 
                                  : m.name}
                              </span>
                            </div>
                          </td>
                          <td style={s.td}>
                            <span
                              style={{
                                background: badge.bg,
                                color: badge.color,
                                borderRadius: 20,
                                padding: isSmallMobile ? "2px 8px" : "3px 10px",
                                fontSize: isSmallMobile ? 10 : 11,
                                fontWeight: 600,
                              }}
                            >
                              {m.role.charAt(0).toUpperCase() + m.role.slice(1)}
                            </span>
                          </td>
                          <td style={s.td}>{m.joined}</td>
                          <td style={s.td}>{fmt(m.balance)} UZS</td>
                          <td style={s.td}>
                            <div style={{ display: "flex", gap: isSmallMobile ? 4 : 8 }}>
                              <button
                                onClick={() => handleEdit(absIdx)}
                                style={s.iconBtn}
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDelete(absIdx)}
                                style={s.iconBtn}
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div
                style={{
                  display: "flex",
                  flexDirection: isSmallMobile ? "column" : "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 20,
                  gap: 12,
                  fontSize: 12,
                  color: "#64748b",
                }}
              >
                <span>
                  Showing {(page - 1) * PER_PAGE + 1}–
                  {Math.min(page * PER_PAGE, members.length)} of{" "}
                  {members.length} records
                </span>
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  {renderPagination()}
                </div>
                {!isSmallMobile && (
                  <span>
                    Page {page} of {totalPages}
                  </span>
                )}
              </div>
            </div>

            {/* Chart */}
            <div style={{ ...s.card, marginTop: 20 }}>
              <div style={s.cardHeader}>
                <span style={{ ...s.cardTitle }}>Overview</span>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: isSmallMobile ? 8 : 16,
                  flexWrap: isSmallMobile ? "wrap" : "nowrap"
                }}>
                  {!isMobile && (
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        fontSize: 12,
                        color: "#64748b",
                      }}
                    >
                      {[
                        ["#16a34a", "Income"],
                        ["#dc2626", "Expenses"],
                        ["#2563eb", "Savings"],
                      ].map(([c, l]) => (
                        <span key={l}>
                          <span
                            style={{
                              display: "inline-block",
                              width: 10,
                              height: 3,
                              background: c,
                              borderRadius: 99,
                              marginRight: 4,
                            }}
                          ></span>
                          {l}
                        </span>
                      ))}
                    </div>
                  )}
                  <select
                    value={chartView}
                    onChange={(e) => setChartView(e.target.value)}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 7,
                      padding: isSmallMobile ? "4px 8px" : "6px 12px",
                      fontSize: isSmallMobile ? 11 : 12,
                      background: "#fff",
                    }}
                  >
                    <option>Monthly View</option>
                    <option>Weekly View</option>
                    <option>Yearly View</option>
                  </select>
                </div>
              </div>
              <div className="no-scrollbar" style={{ overflowX: "auto", paddingBottom: 10, WebkitOverflowScrolling: "touch" }}>
                <div style={{ display: "flex", minWidth: isSmallMobile ? 350 : 400 }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      fontSize: 9,
                      color: "#94a3b8",
                      height: 100,
                      marginRight: 8,
                      textAlign: "right",
                    }}
                  >
                    {["50K", "40K", "30K", "20K", "10K", "0"].map((l) => (
                      <span key={l}>{l}</span>
                    ))}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 6,
                      height: 100,
                    }}
                  >
                    {cd.labels.map((label, i) => (
                      <div
                        key={label}
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: 2,
                            alignItems: "flex-end",
                          }}
                        >
                          <div
                            style={{
                              width: isSmallMobile ? 6 : 10,
                              height: (cd.income[i] / maxBar) * 100,
                              background: "#16a34a",
                              borderRadius: "3px 3px 0 0",
                            }}
                          ></div>
                          <div
                            style={{
                              width: isSmallMobile ? 6 : 10,
                              height: (cd.expense[i] / maxBar) * 100,
                              background: "#dc2626",
                              borderRadius: "3px 3px 0 0",
                            }}
                          ></div>
                          <div
                            style={{
                              width: isSmallMobile ? 6 : 10,
                              height: (cd.savings[i] / maxBar) * 100,
                              background: "#2563eb",
                              borderRadius: "3px 3px 0 0",
                            }}
                          ></div>
                        </div>
                        <span style={{ fontSize: isSmallMobile ? 8 : 10, color: "#94a3b8" }}>
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={s.card}>
              <div style={s.cardHeader}>
                <span style={{ fontSize: isSmallMobile ? 15 : 16 }}>Shared Goals</span>
                <button
                  onClick={() => setGoalModal(true)}
                  style={{
                    background: "#eff6ff",
                    color: "#2563eb",
                    border: "1px solid #bfdbfe",
                    borderRadius: 8,
                    padding: isSmallMobile ? "4px 10px" : "6px 12px",
                    fontSize: isSmallMobile ? 11 : 12,
                    fontWeight: 600,
                  }}
                >
                  + Add
                </button>
              </div>
              {goals.map((g, i) => {
                const pct = Math.min(
                  100,
                  Math.round((g.current / g.target) * 100),
                );
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 10,
                      padding: isSmallMobile ? "10px 0" : "12px 0",
                      borderBottom:
                        i < goals.length - 1 ? "1px solid #e2e8f0" : "none",
                    }}
                  >
                    <div
                      style={{
                        width: isSmallMobile ? 32 : 40,
                        height: isSmallMobile ? 32 : 40,
                        borderRadius: 10,
                        background: "#f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: isSmallMobile ? 16 : 18,
                        flexShrink: 0,
                      }}
                    >
                      {g.emoji}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 4,
                        }}
                      >
                        <span style={{ fontSize: isSmallMobile ? 12 : 13, fontWeight: 600 }}>
                          {g.name}
                        </span>
                        <span
                          style={{
                            fontSize: isSmallMobile ? 11 : 12,
                            fontWeight: 700,
                            color: g.color,
                          }}
                        >
                          {pct}%
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: isSmallMobile ? 10 : 11,
                          color: "#64748b",
                          marginBottom: 6,
                        }}
                      >
                        UZS {fmt(g.current)} / {fmt(g.target)}
                      </div>
                      <div
                        style={{
                          height: isSmallMobile ? 4 : 6,
                          background: "#e2e8f0",
                          borderRadius: 99,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${pct}%`,
                            height: "100%",
                            background: g.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={s.card}>
              <div
                style={{
                  ...s.cardTitle,
                  fontFamily: "'Syne', sans-serif",
                  marginBottom: 16,
                }}
              >
                Recent Activity
              </div>
              {activity.map((a, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: isSmallMobile ? "10px 0" : "12px 0",
                    borderBottom:
                      i < activity.length - 1 ? "1px solid #e2e8f0" : "none",
                  }}
                >
                  <div
                    style={{ ...s.avatar("#1a2550"), width: isSmallMobile ? 32 : 36, height: isSmallMobile ? 32 : 36 }}
                  >
                    {initials(a.name)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: isSmallMobile ? 12 : 13,
                        fontWeight: 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {a.name}
                    </div>
                    <div style={{ fontSize: isSmallMobile ? 10 : 11, color: "#64748b" }}>
                      {a.time}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: isSmallMobile ? 11 : 13,
                      fontWeight: 700,
                      color: a.positive ? "#16a34a" : "#dc2626",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {a.positive ? "+" : "-"}
                    {fmt(a.amount)} UZS
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MODALS */}
        <Modal
          show={inviteModal}
          onClose={() => setInviteModal(false)}
          title="Invite Family Member"
        >
          <Field label="Full Name">
            <input
              style={inputStyle}
              value={inviteForm.name}
              onChange={(e) =>
                setInviteForm((f) => ({ ...f, name: e.target.value }))
              }
              placeholder="e.g. Jasur Rahimov"
            />
          </Field>
          <Field label="Email">
            <input
              style={inputStyle}
              type="email"
              value={inviteForm.email}
              onChange={(e) =>
                setInviteForm((f) => ({ ...f, email: e.target.value }))
              }
              placeholder="email@example.com"
            />
          </Field>
          <Field label="Role">
            <select
              style={inputStyle}
              value={inviteForm.role}
              onChange={(e) =>
                setInviteForm((f) => ({ ...f, role: e.target.value }))
              }
            >
              <option value="admin">Admin</option>
              <option value="member">Member</option>
              <option value="child">Child</option>
            </select>
          </Field>
          <Field label="Initial Balance (UZS)">
            <input
              style={inputStyle}
              type="number"
              value={inviteForm.balance}
              onChange={(e) =>
                setInviteForm((f) => ({ ...f, balance: e.target.value }))
              }
            />
          </Field>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <Btn variant="secondary" onClick={() => setInviteModal(false)}>
              Cancel
            </Btn>
            <Btn onClick={addMember}>Send Invite</Btn>
          </div>
        </Modal>

        <Modal
          show={editModal}
          onClose={() => setEditModal(false)}
          title="Edit Member"
        >
          <Field label="Full Name">
            <input
              style={inputStyle}
              value={editForm.name}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, name: e.target.value }))
              }
            />
          </Field>
          <Field label="Role">
            <select
              style={inputStyle}
              value={editForm.role}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, role: e.target.value }))
              }
            >
              <option value="admin">Admin</option>
              <option value="member">Member</option>
              <option value="child">Child</option>
            </select>
          </Field>
          <Field label="Balance (UZS)">
            <input
              style={inputStyle}
              type="number"
              value={editForm.balance}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, balance: e.target.value }))
              }
            />
          </Field>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <Btn variant="secondary" onClick={() => setEditModal(false)}>
              Cancel
            </Btn>
            <Btn onClick={saveEdit}>Save Changes</Btn>
          </div>
        </Modal>

        <Modal
          show={goalModal}
          onClose={() => setGoalModal(false)}
          title="Add Shared Goal"
        >
          <Field label="Goal Name">
            <input
              style={inputStyle}
              value={goalForm.name}
              onChange={(e) =>
                setGoalForm((f) => ({ ...f, name: e.target.value }))
              }
              placeholder="e.g. New House"
            />
          </Field>
          <Field label="Emoji Icon">
            <input
              style={inputStyle}
              value={goalForm.emoji}
              onChange={(e) =>
                setGoalForm((f) => ({ ...f, emoji: e.target.value }))
              }
              maxLength={2}
            />
          </Field>
          <Field label="Current Amount">
            <input
              style={inputStyle}
              type="number"
              value={goalForm.current}
              onChange={(e) =>
                setGoalForm((f) => ({ ...f, current: e.target.value }))
              }
            />
          </Field>
          <Field label="Target Amount">
            <input
              style={inputStyle}
              type="number"
              value={goalForm.target}
              onChange={(e) =>
                setGoalForm((f) => ({ ...f, target: e.target.value }))
              }
            />
          </Field>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <Btn variant="secondary" onClick={() => setGoalModal(false)}>
              Cancel
            </Btn>
            <Btn onClick={addGoal}>Add Goal</Btn>
          </div>
        </Modal>

        <Toast msg={toast} />
      </div>
    </>
  );
}