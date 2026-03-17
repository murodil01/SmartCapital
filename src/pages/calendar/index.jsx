import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { calendarAPI } from "../../api/calendar";

const CATEGORIES = {
  Salary: { icon: "💼", color: "#6366F1", bg: "#EEF2FF", type: "income" },
  Business: { icon: "🌿", color: "#10B981", bg: "#D1FAE5", type: "income" },
  Transfer: { icon: "🔄", color: "#3B82F6", bg: "#DBEAFE", type: "income" },
  Food: { icon: "🍔", color: "#EF4444", bg: "#FEE2E2", type: "expense" },
  Lunch: { icon: "🍽️", color: "#F97316", bg: "#FFEDD5", type: "expense" },
  Store: { icon: "🏪", color: "#F59E0B", bg: "#FEF3C7", type: "expense" },
  Transportation: {
    icon: "🚗",
    color: "#8B5CF6",
    bg: "#EDE9FE",
    type: "expense",
  },
  Entertainment: {
    icon: "🎮",
    color: "#EC4899",
    bg: "#FCE7F3",
    type: "expense",
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = ["MON", "TUE", "WED", "THUR", "FRI", "SAT", "SUN"];

const fmt = (n) => {
  if (!n || n === "0") return "0";
  const abs = Math.abs(Number(n));
  if (isNaN(abs)) return "0";
  return abs.toLocaleString("uz-UZ").replace(/,/g, " ");
};

const toDateStr = (year, month1based, day) => {
  const m = String(month1based).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
};

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  let d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

// Map API transaction to local shape
function mapApiTx(apiTx) {
  const catKey =
    Object.keys(CATEGORIES).find(
      (k) => k.toLowerCase() === (apiTx.category || "").toLowerCase(),
    ) || (apiTx.kind === "income" ? "Transfer" : "Food");

  return {
    id: apiTx.id,
    cat: catKey,
    amt:
      apiTx.kind === "expense"
        ? -Math.abs(Number(apiTx.amount))
        : Math.abs(Number(apiTx.amount)),
    title: apiTx.title || catKey,
    merchant: apiTx.merchant,
    account_name: apiTx.account_name,
  };
}

// ─── AddTransactionModal ───────────────────────────────────────────────────────
function AddTransactionModal({ date, onClose, onAdd }) {
  const [cat, setCat] = useState("Salary");
  const [amt, setAmt] = useState("");
  const [type, setType] = useState("income");

  const handle = () => {
    if (!amt || isNaN(amt)) return;
    const val =
      type === "expense" ? -Math.abs(Number(amt)) : Math.abs(Number(amt));
    onAdd(date, { id: Date.now(), cat, amt: val });
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 16px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 24,
          width: "100%",
          maxWidth: 340,
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        }}
      >
        <h3
          style={{
            fontFamily: "Georgia,serif",
            fontSize: 18,
            marginTop: 0,
            marginBottom: 18,
          }}
        >
          Add Transaction
        </h3>
        <div style={{ marginBottom: 14 }}>
          <label
            style={{
              fontSize: 12,
              color: "#6B7280",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 0.8,
            }}
          >
            Type
          </label>
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            {["income", "expense"].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                style={{
                  flex: 1,
                  padding: "9px 0",
                  borderRadius: 10,
                  border: "1.5px solid",
                  borderColor: type === t ? "#6366F1" : "#E5E7EB",
                  background: type === t ? "#EEF2FF" : "#fff",
                  color: type === t ? "#6366F1" : "#374151",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: 13,
                  textTransform: "capitalize",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label
            style={{
              fontSize: 12,
              color: "#6B7280",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 0.8,
            }}
          >
            Category
          </label>
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              marginTop: 5,
              border: "1.5px solid #E5E7EB",
              borderRadius: 10,
              padding: "9px 12px",
              fontSize: 14,
              outline: "none",
            }}
          >
            {Object.keys(CATEGORIES)
              .filter((c) => CATEGORIES[c].type === type)
              .map((c) => (
                <option key={c} value={c}>
                  {CATEGORIES[c].icon} {c}
                </option>
              ))}
          </select>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              fontSize: 12,
              color: "#6B7280",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 0.8,
            }}
          >
            Amount (UZS)
          </label>
          <input
            type="number"
            value={amt}
            onChange={(e) => setAmt(e.target.value)}
            placeholder="e.g. 500000"
            style={{
              display: "block",
              width: "100%",
              marginTop: 5,
              border: "1.5px solid #E5E7EB",
              borderRadius: 10,
              padding: "9px 12px",
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
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
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Calendar Component ───────────────────────────────────────────────────
export default function Calendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [addModal, setAddModal] = useState(null);
  const [rangeFilter, setRangeFilter] = useState(false);

  // ── API state ──
  const [monthData, setMonthData] = useState({});
  const [dayData, setDayData] = useState(null);
  const [monthLoading, setMonthLoading] = useState(false);
  const [dayLoading, setDayLoading] = useState(false);
  const [monthError, setMonthError] = useState(null);
  const [dayError, setDayError] = useState(null);

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);

  useEffect(() => {
    const checkRes = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsSmallMobile(width < 480);
    };
    checkRes();
    window.addEventListener("resize", checkRes);
    return () => window.removeEventListener("resize", checkRes);
  }, []);

  // ── Fetch month data when year/month changes ──
  const fetchMonthData = useCallback(async () => {
    setMonthLoading(true);
    setMonthError(null);
    try {
      const data = await calendarAPI.getMonthData(year, month + 1);
      setMonthData(data || {});
    } catch (err) {
      console.error("Month data fetch error:", err);
      setMonthError(err);
      setMonthData({});
    } finally {
      setMonthLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetchMonthData();
  }, [fetchMonthData]);

  // ── Fetch day data when selectedDay changes ──
  const fetchDayData = useCallback(async () => {
    setDayLoading(true);
    setDayError(null);
    try {
      const data = await calendarAPI.getDayData(year, month + 1, selectedDay);
      setDayData(data);
    } catch (err) {
      console.error("Day data fetch error:", err);
      setDayError(err);
      setDayData(null);
    } finally {
      setDayLoading(false);
    }
  }, [year, month, selectedDay]);

  useEffect(() => {
    fetchDayData();
  }, [fetchDayData]);

  // ── Calendar grid ──
  const daysInMonth = getDaysInMonth(year, month);
  const firstDow = getFirstDayOfWeek(year, month);
  const daysInPrev = getDaysInMonth(year, month - 1 < 0 ? 11 : month - 1);

  const prevMonth = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else setMonth((m) => m - 1);
    setSelectedDay(1);
  };

  const nextMonth = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else setMonth((m) => m + 1);
    setSelectedDay(1);
  };

  // Get per-day summary from monthData
  const getDaySummary = (d) => {
    const dateStr = toDateStr(year, month + 1, d);
    return monthData[dateStr] || null;
  };

  // Transactions for selected day (from dayData)
  const selTx = dayData?.transactions ? dayData.transactions.map(mapApiTx) : [];
  const income = dayData ? Math.abs(Number(dayData.income || 0)) : 0;
  const expense = dayData ? Math.abs(Number(dayData.expense || 0)) : 0;

  const handleAdd = (dateKey, tx) => {
    // Local optimistic update only
    setDayData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        transactions: [
          ...(prev.transactions || []),
          {
            ...tx,
            kind: tx.amt > 0 ? "income" : "expense",
            category: tx.cat,
            amount: String(Math.abs(tx.amt)),
          },
        ],
      };
    });
  };

  // Build calendar cells
  const cells = [];
  for (let i = 0; i < firstDow; i++)
    cells.push({ day: daysInPrev - firstDow + 1 + i, cur: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, cur: true });
  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) cells.push({ day: i, cur: false });

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <div>
      <style>{`
        * { box-sizing:border-box; }
        .cal-cell { cursor:pointer; transition:background 0.15s; min-height: 90px; height: 100%; }
        @media (max-width: 768px) { .cal-cell { min-height: 70px !important; padding: 4px !important; } }
        @media (max-width: 480px) {
          .cal-cell { min-height: 50px !important; padding: 3px !important; }
          .tx-pill { display: none !important; }
          .more-indicator { font-size: 9px !important; margin-top: 0 !important; }
          .day-num-sel { font-size: 12px !important; }
        }
        .cal-cell:hover { background:#F0F4FF !important; }
        .tx-pill { font-size: 11px; font-weight: 700; border-radius: 6px; padding: 2px 5px; margin-top: 2px; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
        .tx-pill:hover { opacity:0.8; }
        @media (max-width: 480px) {
          .main-grid { grid-template-columns: 1fr !important; }
          .nav-title { font-size: 18px !important; }
          .range-filter span { display: none; }
          .range-filter { padding: 7px 10px !important; }
        }
      `}</style>

      <div className="shadow-sm bg-white p-5 border border-[#E0E0E0] rounded-2xl">
        <div className="flex flex-col gap-5">
          {/* Nav */}
          <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: isSmallMobile ? 6 : 10,
                flexWrap: "wrap",
              }}
            >
              <h3
                style={{
                  fontFamily: "Georgia,serif",
                  fontSize: isSmallMobile ? 18 : isMobile ? 20 : 22,
                  margin: 0,
                  color: "#1F2937",
                }}
              >
                {isSmallMobile ? MONTHS[month].slice(0, 3) : MONTHS[month]}{" "}
                {year}
                {monthLoading && (
                  <span
                    style={{ fontSize: 12, color: "#9CA3AF", marginLeft: 8 }}
                  >
                    ...
                  </span>
                )}
              </h3>
              <div style={{ display: "flex", gap: 5 }}>
                <button
                  onClick={prevMonth}
                  style={{
                    border: "1.5px solid #E5E7EB",
                    background: "#fff",
                    borderRadius: 8,
                    width: isSmallMobile ? 28 : 32,
                    height: isSmallMobile ? 28 : 32,
                    cursor: "pointer",
                    fontSize: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ArrowLeft size={isSmallMobile ? 13 : 15} />
                </button>
                <button
                  onClick={nextMonth}
                  style={{
                    border: "1.5px solid #E5E7EB",
                    background: "#fff",
                    borderRadius: 8,
                    width: isSmallMobile ? 28 : 32,
                    height: isSmallMobile ? 28 : 32,
                    cursor: "pointer",
                    fontSize: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ArrowRight size={isSmallMobile ? 13 : 15} />
                </button>
              </div>
            </div>

            <button
              onClick={() => setRangeFilter((v) => !v)}
              className="range-filter"
              style={{
                display: "flex",
                alignItems: "center",
                gap: isSmallMobile ? 4 : 6,
                border: "1.5px solid #E5E7EB",
                background: "#fff",
                borderRadius: 10,
                padding: isSmallMobile ? "7px 10px" : "7px 14px",
                cursor: "pointer",
                fontSize: isSmallMobile ? 12 : 13,
                fontWeight: 600,
                color: "#374151",
              }}
            >
              📅
              <span>
                {rangeFilter
                  ? "All Dates"
                  : isSmallMobile
                    ? "10–20 May"
                    : "10 May – 20 May"}
              </span>
              ▾
            </button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start items-center justify-center gap-5">
            {/* Calendar grid */}
            <div className="flex-1 w-full min-w-0">
              {/* Day headers */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7,1fr)",
                  marginBottom: 2,
                }}
              >
                {DAYS.map((d) => (
                  <div
                    key={d}
                    style={{
                      textAlign: "center",
                      fontSize: isSmallMobile ? 9 : isMobile ? 10 : 11,
                      fontWeight: 700,
                      color: "#9CA3AF",
                      padding: isSmallMobile ? "2px 0" : "4px 0",
                      letterSpacing: 0.5,
                    }}
                  >
                    {isSmallMobile ? d.slice(0, 1) : d}
                  </div>
                ))}
              </div>

              {/* Weeks */}
              {weeks.map((week, wi) => (
                <div
                  key={wi}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7,1fr)",
                    borderTop: "1px solid #F3F4F6",
                  }}
                >
                  {week.map((cell, ci) => {
                    const summary = cell.cur ? getDaySummary(cell.day) : null;
                    const hasTx =
                      summary &&
                      (Number(summary.income || 0) !== 0 ||
                        Number(summary.expense || 0) !== 0);
                    const isSel = cell.cur && cell.day === selectedDay;

                    return (
                      <div
                        key={ci}
                        className="cal-cell"
                        onClick={() => {
                          if (cell.cur) setSelectedDay(cell.day);
                        }}
                        style={{
                          padding: isSmallMobile
                            ? "3px"
                            : isMobile
                              ? "4px 4px 6px"
                              : "6px 6px 8px",
                          background: isSel ? "#EEF2FF" : "#fff",
                          borderLeft: ci > 0 ? "1px solid #F3F4F6" : "none",
                          position: "relative",
                        }}
                      >
                        <div
                          className="day-num-sel"
                          style={{
                            fontSize: isSmallMobile ? 12 : isMobile ? 13 : 13,
                            fontWeight: isSel ? 700 : 500,
                            color: !cell.cur
                              ? "#D1D5DB"
                              : isSel
                                ? "#6366F1"
                                : "#374151",
                            marginBottom: isSmallMobile ? 0 : 2,
                          }}
                        >
                          {cell.day}
                        </div>

                        {/* Show income/expense pills from monthData */}
                        {!isSmallMobile && hasTx && (
                          <>
                            {Number(summary.income) > 0 && (
                              <div
                                className="tx-pill"
                                style={{
                                  background: "#D1FAE5",
                                  color: "#10B981",
                                  fontSize: isMobile ? 9 : 11,
                                  padding: isMobile ? "1px 3px" : "2px 5px",
                                }}
                              >
                                +
                                {isMobile
                                  ? fmt(summary.income).slice(0, 3) + "k"
                                  : fmt(summary.income)}
                              </div>
                            )}
                            {Number(summary.expense) > 0 && (
                              <div
                                className="tx-pill"
                                style={{
                                  background: "#FEE2E2",
                                  color: "#EF4444",
                                  fontSize: isMobile ? 9 : 11,
                                  padding: isMobile ? "1px 3px" : "2px 5px",
                                }}
                              >
                                -
                                {isMobile
                                  ? fmt(summary.expense).slice(0, 3) + "k"
                                  : fmt(summary.expense)}
                              </div>
                            )}
                          </>
                        )}

                        {/* Dot indicator for small mobile */}
                        {isSmallMobile && hasTx && (
                          <div
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: "50%",
                              background: "#6366F1",
                              margin: "2px auto 0",
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

              {monthError && (
                <div
                  style={{
                    textAlign: "center",
                    color: "#EF4444",
                    fontSize: 12,
                    marginTop: 8,
                  }}
                >
                  Failed to load month data
                </div>
              )}
            </div>
            {/* Details Panel */}
            <div className="w-full lg:w-70 shrink-0">
              <div className="shadow-sm bg-white p-5 border border-[#E0E0E0] rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3
                    style={{
                      fontSize: isSmallMobile ? 14 : 16,
                      margin: 0,
                      color: "#1F2937",
                    }}
                  >
                    {isSmallMobile
                      ? `${selectedDay} ${MONTHS[month].slice(0, 3)}`
                      : `Daily Details: ${MONTHS[month]} ${selectedDay}`}
                  </h3>
                  {dayLoading && (
                    <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                      Loading...
                    </span>
                  )}
                </div>

                {/* SCROLL QO'SHILGAN QISMI SHU YERDA */}
                <div
                  style={{
                    maxHeight: "320px", 
                    overflowY: "auto", 
                    paddingRight: "4px", 
                  }}
                  className="custom-scrollbar no-scrollbar" // Agar CSS-da chiroyli scrollbar qilmoqchi bo'lsangiz
                >
                  {dayError ? (
                    <div
                      style={{
                        textAlign: "center",
                        color: "#EF4444",
                        fontSize: 13,
                        padding: "20px 0",
                      }}
                    >
                      Failed to load day data
                    </div>
                  ) : dayLoading ? (
                    <div
                      style={{
                        textAlign: "center",
                        color: "#9CA3AF",
                        fontSize: 13,
                        padding: "20px 0",
                      }}
                    >
                      Loading...
                    </div>
                  ) : selTx.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        color: "#9CA3AF",
                        fontSize: isSmallMobile ? 12 : 13,
                        padding: isSmallMobile ? "15px 0" : "20px 0",
                      }}
                    >
                      No transactions
                    </div>
                  ) : (
                    selTx.map((tx) => {
                      const c = CATEGORIES[tx.cat] || CATEGORIES.Transfer;
                      return (
                        <div
                          key={tx.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 12,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: isSmallMobile ? 8 : 10,
                            }}
                          >
                            <div
                              style={{
                                width: isSmallMobile ? 32 : 36,
                                height: isSmallMobile ? 32 : 36,
                                borderRadius: 10,
                                background: c.bg,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: isSmallMobile ? 16 : 18,
                              }}
                            >
                              {c.icon}
                            </div>
                            <div>
                              <span
                                style={{
                                  fontWeight: 600,
                                  fontSize: isSmallMobile ? 13 : 14,
                                  color: "#374151",
                                }}
                              >
                                {isSmallMobile
                                  ? tx.cat.slice(0, 5) +
                                    (tx.cat.length > 5 ? "..." : "")
                                  : tx.cat}
                              </span>
                              {tx.title && tx.title !== tx.cat && (
                                <div style={{ fontSize: 11, color: "#9CA3AF" }}>
                                  {tx.title}
                                </div>
                              )}
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 700,
                                fontSize: isSmallMobile ? 12 : 14,
                                color: tx.amt > 0 ? "#10B981" : "#EF4444",
                              }}
                            >
                              {tx.amt > 0 ? "+" : ""}
                              {isSmallMobile
                                ? fmt(tx.amt).slice(0, 4) + "k"
                                : fmt(tx.amt)}{" "}
                              UZS
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                {/* SCROLL TUGADI */}

                <div
                  style={{
                    borderTop: "1px solid #F3F4F6",
                    marginTop: 14,
                    paddingTop: 14,
                  }}
                >
                  <div
                    style={{
                      fontSize: isSmallMobile ? 12 : 13,
                      fontWeight: 700,
                      color: "#1F2937",
                      marginBottom: 8,
                    }}
                  >
                    Daily Summary:
                  </div>
                  {/* ... Summary qismlari ... */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: isSmallMobile ? 12 : 13,
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ color: "#6B7280" }}>Income</span>
                    <span style={{ fontWeight: 600, color: "#374151" }}>
                      {fmt(income)} UZS
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: isSmallMobile ? 12 : 13,
                    }}
                  >
                    <span style={{ color: "#6B7280" }}>Expense</span>
                    <span style={{ fontWeight: 600, color: "#374151" }}>
                      {fmt(expense)} UZS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {addModal && (
        <AddTransactionModal
          date={addModal}
          onClose={() => setAddModal(null)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
}
