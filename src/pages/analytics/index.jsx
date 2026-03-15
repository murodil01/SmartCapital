// import { useState } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip as PieTooltip,
// } from "recharts";

// // ─── DATA ────────────────────────────────────────────────────────────────────
// const analyticsData = [
//   { month: "Jan", income: 28000, expenses: 27000 },
//   { month: "Feb", income: 38500, expenses: 33000 },
//   { month: "Mar", income: 24000, expenses: 31000 },
//   { month: "Apr", income: 31000, expenses: 44500 },
//   { month: "May", income: 22000, expenses: 30500 },
//   { month: "Jun", income: 30000, expenses: 21000 },
//   { month: "Jul", income: 45000, expenses: 34500 },
//   { month: "Aug", income: 27000, expenses: 30000 },
// ];

// const cashFlowData = [
//   { month: "Jan", balance: 30000 },
//   { month: "Feb", balance: 42000 },
//   { month: "Mar", balance: 38000 },
//   { month: "Apr", balance: 55000 },
//   { month: "May", balance: 72000 },
//   { month: "Jun", balance: 80000 },
// ];

// const expenseCategories = [
//   { name: "Store", value: 2350000, color: "#F5A623" },
//   { name: "Food", value: 1550000, color: "#E05252" },
//   { name: "Transportation", value: 1200000, color: "#7C9FF5" },
//   { name: "Entertainment", value: 800000, color: "#9B8BE8" },
//   { name: "Shopping", value: 1000000, color: "#E06CB0" },
//   { name: "Other", value: 400000, color: "#B0B8C8" },
// ];

// const topIncomeSources = [
//   {
//     name: "Salary",
//     amount: 2350000,
//     icon: "💼",
//     color: "#E8F5E9",
//     iconColor: "#43A047",
//   },
//   {
//     name: "Business",
//     amount: 2350000,
//     icon: "💰",
//     color: "#E3F2FD",
//     iconColor: "#1E88E5",
//   },
//   {
//     name: "Freelance Work",
//     amount: 2350000,
//     icon: "👥",
//     color: "#FFF3E0",
//     iconColor: "#FB8C00",
//   },
//   {
//     name: "Business",
//     amount: 2350000,
//     icon: "🌿",
//     color: "#F3E5F5",
//     iconColor: "#8E24AA",
//   },
// ];

// const topExpenses = [
//   {
//     name: "Store",
//     amount: 2350000,
//     icon: "🏪",
//     color: "#FFF8E1",
//     iconColor: "#F9A825",
//   },
//   {
//     name: "Food",
//     amount: 2350000,
//     icon: "🍕",
//     color: "#FFEBEE",
//     iconColor: "#E53935",
//   },
//   {
//     name: "Transportation",
//     amount: 2350000,
//     icon: "🚗",
//     color: "#E3F2FD",
//     iconColor: "#1E88E5",
//   },
//   {
//     name: "Entertainment",
//     amount: 2350000,
//     icon: "🎮",
//     color: "#EDE7F6",
//     iconColor: "#7B1FA2",
//   },
// ];

// // ─── HELPERS ─────────────────────────────────────────────────────────────────

// const fmtFull = (n) => n.toLocaleString() + " UZS";

// // ─── CUSTOM TOOLTIP ───────────────────────────────────────────────────────────
// const CustomBarTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div
//         style={{
//           background: "#fff",
//           border: "1px solid #e5e7eb",
//           borderRadius: 10,
//           padding: "10px 14px",
//           boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
//           fontSize: 12,
//         }}
//       >
//         <p style={{ fontWeight: 700, marginBottom: 4, color: "#374151" }}>
//           {label}
//         </p>
//         {payload.map((p) => (
//           <p
//             key={p.dataKey}
//             style={{
//               color: p.fill === "#6BC5A8" ? "#6BC5A8" : "#E05252",
//               margin: "2px 0",
//             }}
//           >
//             {p.dataKey === "income" ? "Income" : "Expenses"}:{" "}
//             {p.value.toLocaleString()} UZS
//           </p>
//         ))}
//       </div>
//     );
//   }
//   return null;
// };

// const CustomAreaTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div
//         style={{
//           background: "#fff",
//           border: "1px solid #e5e7eb",
//           borderRadius: 10,
//           padding: "10px 14px",
//           boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
//           fontSize: 12,
//         }}
//       >
//         <p style={{ fontWeight: 700, marginBottom: 4, color: "#374151" }}>
//           {label}
//         </p>
//         <p style={{ color: "#6BC5A8" }}>
//           Net Balance: {payload[0].value.toLocaleString()} UZS
//         </p>
//       </div>
//     );
//   }
//   return null;
// };

// // ─── STAT CARD ────────────────────────────────────────────────────────────────
// const StatCard = ({ title, value, unit, change, positive, bg }) => (
//   <div
//     style={{
//       background: bg || "#fff",
//       borderRadius: 16,
//       padding: "20px 22px",
//       flex: 1,
//       minWidth: 0,
//       position: "relative",
//       overflow: "hidden",
//       boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
//     }}
//   >
//     {/* Decorative wave */}
//     <svg
//       style={{ position: "absolute", right: 0, bottom: 0, opacity: 0.15 }}
//       width="120"
//       height="60"
//       viewBox="0 0 120 60"
//     >
//       <path d="M0 40 Q30 10 60 30 Q90 50 120 20 L120 60 L0 60Z" fill="#aaa" />
//     </svg>
//     <p
//       style={{
//         fontSize: 12,
//         color: "#6B7280",
//         marginBottom: 6,
//         fontWeight: 500,
//       }}
//     >
//       {title}
//     </p>
//     <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
//       <span
//         style={{
//           fontSize: 22,
//           fontWeight: 800,
//           color: "#111827",
//           letterSpacing: "-0.5px",
//         }}
//       >
//         {typeof value === "number" ? value.toLocaleString() : value}
//       </span>
//       <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>
//         {unit}
//       </span>
//     </div>
//     <p
//       style={{
//         fontSize: 12,
//         color: positive ? "#22C55E" : "#EF4444",
//         marginTop: 4,
//         fontWeight: 600,
//       }}
//     >
//       {change}
//     </p>
//   </div>
// );

// // ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
// const Analytics = () => {
//   const [analyticsView, setAnalyticsView] = useState("Monthly View");
//   const [cashFlowView, setCashFlowView] = useState("Monthly View");
//   const [viewDropdown, setViewDropdown] = useState(null);

//   const viewOptions = ["Monthly View", "Weekly View", "Yearly View"];

//   const handleViewSelect = (panel, opt) => {
//     if (panel === "analytics") setAnalyticsView(opt);
//     else setCashFlowView(opt);
//     setViewDropdown(null);
//   };

//   return (
//     <div
//       style={{
//         padding: "4px",
//         minHeight: "100vh",
//         maxWidth: "100%",
//         boxSizing: "border-box",
//       }}
//       onClick={() => setViewDropdown(null)}
//     >
//       {/* ── TOP STAT CARDS ─────────────────────────────── */}
//       <div className="flex flex-wrap gap-3 mb-4 md:flex-row flex-col">
//         <StatCard
//           title="Total Income"
//           value={17500000}
//           unit="uzs"
//           change="+18% from May"
//           positive
//           bg="#F0FAF6"
//         />
//         <StatCard
//           title="Total Expense"
//           value={7850000}
//           unit="uzs"
//           change="-7% from May"
//           positive={false}
//           bg="#FFF5F5"
//         />
//         <StatCard
//           title="Net Balance"
//           value={9650000}
//           unit="uzs"
//           change="+7% from May"
//           positive
//           bg="#F0F4FF"
//         />
//       </div>

//       {/* ── CHARTS ROW ──────────────────────────────────── */}
//       <div
//         style={{
//           display: "flex",
//           gap: 12,
//           marginBottom: 16,
//           flexWrap: "wrap",
//         }}
//       >
//         {/* Analytics Bar Chart */}
//         <div
//           style={{
//             background: "#fff",
//             borderRadius: 16,
//             padding: "18px 16px",
//             flex: "1 1 300px",
//             minWidth: 0,
//             boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               marginBottom: 12,
//               flexWrap: "wrap",
//               gap: 8,
//             }}
//           >
//             <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//               <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
//                 Analytics
//               </span>
//               <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                 <span
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 4,
//                     fontSize: 11,
//                     color: "#6B7280",
//                   }}
//                 >
//                   <span
//                     style={{
//                       width: 20,
//                       height: 3,
//                       background: "#6BC5A8",
//                       borderRadius: 2,
//                       display: "inline-block",
//                     }}
//                   />{" "}
//                   Income
//                 </span>
//                 <span
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 4,
//                     fontSize: 11,
//                     color: "#6B7280",
//                   }}
//                 >
//                   <span
//                     style={{
//                       width: 20,
//                       height: 3,
//                       background: "#E05252",
//                       borderRadius: 2,
//                       display: "inline-block",
//                     }}
//                   />{" "}
//                   Expenses
//                 </span>
//               </div>
//             </div>
//             <div
//               style={{ position: "relative" }}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <button
//                 onClick={() =>
//                   setViewDropdown(
//                     viewDropdown === "analytics" ? null : "analytics",
//                   )
//                 }
//                 style={{
//                   fontSize: 11,
//                   color: "#374151",
//                   background: "#F9FAFB",
//                   border: "1px solid #E5E7EB",
//                   borderRadius: 8,
//                   padding: "4px 10px",
//                   cursor: "pointer",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 4,
//                 }}
//               >
//                 {analyticsView} <span style={{ fontSize: 9 }}>▼</span>
//               </button>
//               {viewDropdown === "analytics" && (
//                 <div
//                   style={{
//                     position: "absolute",
//                     right: 0,
//                     top: "110%",
//                     background: "#fff",
//                     border: "1px solid #E5E7EB",
//                     borderRadius: 10,
//                     boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
//                     zIndex: 100,
//                     minWidth: 130,
//                     overflow: "hidden",
//                   }}
//                 >
//                   {viewOptions.map((opt) => (
//                     <button
//                       key={opt}
//                       onClick={() => handleViewSelect("analytics", opt)}
//                       style={{
//                         display: "block",
//                         width: "100%",
//                         textAlign: "left",
//                         padding: "8px 14px",
//                         fontSize: 12,
//                         color: opt === analyticsView ? "#6BC5A8" : "#374151",
//                         background:
//                           opt === analyticsView ? "#F0FAF6" : "transparent",
//                         border: "none",
//                         cursor: "pointer",
//                         fontWeight: opt === analyticsView ? 600 : 400,
//                       }}
//                     >
//                       {opt}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//           <ResponsiveContainer width="100%" height={200}>
//             <BarChart data={analyticsData} barGap={2} barCategoryGap="30%">
//               <CartesianGrid
//                 strokeDasharray="3 3"
//                 stroke="#F3F4F6"
//                 vertical={false}
//               />
//               <XAxis
//                 dataKey="month"
//                 tick={{ fontSize: 11, fill: "#9CA3AF" }}
//                 axisLine={false}
//                 tickLine={false}
//               />
//               <YAxis
//                 tick={{ fontSize: 10, fill: "#9CA3AF" }}
//                 axisLine={false}
//                 tickLine={false}
//                 tickFormatter={(v) => `${v / 1000}K`}
//               />
//               <Tooltip content={<CustomBarTooltip />} />
//               <Bar dataKey="income" fill="#6BC5A8" radius={[4, 4, 0, 0]} />
//               <Bar dataKey="expenses" fill="#E05252" radius={[4, 4, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Cash Flow Area Chart */}
//         <div
//           style={{
//             background: "#fff",
//             borderRadius: 16,
//             padding: "18px 16px",
//             flex: "1 1 280px",
//             minWidth: 0,
//             boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               marginBottom: 12,
//               flexWrap: "wrap",
//               gap: 8,
//             }}
//           >
//             <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
//               Cash Flow
//             </span>
//             <div
//               style={{ position: "relative" }}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <button
//                 onClick={() =>
//                   setViewDropdown(
//                     viewDropdown === "cashflow" ? null : "cashflow",
//                   )
//                 }
//                 style={{
//                   fontSize: 11,
//                   color: "#374151",
//                   background: "#F9FAFB",
//                   border: "1px solid #E5E7EB",
//                   borderRadius: 8,
//                   padding: "4px 10px",
//                   cursor: "pointer",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 4,
//                 }}
//               >
//                 {cashFlowView} <span style={{ fontSize: 9 }}>▼</span>
//               </button>
//               {viewDropdown === "cashflow" && (
//                 <div
//                   style={{
//                     position: "absolute",
//                     right: 0,
//                     top: "110%",
//                     background: "#fff",
//                     border: "1px solid #E5E7EB",
//                     borderRadius: 10,
//                     boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
//                     zIndex: 100,
//                     minWidth: 130,
//                     overflow: "hidden",
//                   }}
//                 >
//                   {viewOptions.map((opt) => (
//                     <button
//                       key={opt}
//                       onClick={() => handleViewSelect("cashflow", opt)}
//                       style={{
//                         display: "block",
//                         width: "100%",
//                         textAlign: "left",
//                         padding: "8px 14px",
//                         fontSize: 12,
//                         color: opt === cashFlowView ? "#6BC5A8" : "#374151",
//                         background:
//                           opt === cashFlowView ? "#F0FAF6" : "transparent",
//                         border: "none",
//                         cursor: "pointer",
//                         fontWeight: opt === cashFlowView ? 600 : 400,
//                       }}
//                     >
//                       {opt}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//           <ResponsiveContainer width="100%" height={200}>
//             <AreaChart data={cashFlowData}>
//               <defs>
//                 <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#6BC5A8" stopOpacity={0.25} />
//                   <stop offset="95%" stopColor="#6BC5A8" stopOpacity={0.02} />
//                 </linearGradient>
//               </defs>
//               <CartesianGrid
//                 strokeDasharray="3 3"
//                 stroke="#F3F4F6"
//                 vertical={false}
//               />
//               <XAxis
//                 dataKey="month"
//                 tick={{ fontSize: 11, fill: "#9CA3AF" }}
//                 axisLine={false}
//                 tickLine={false}
//               />
//               <YAxis
//                 tick={{ fontSize: 10, fill: "#9CA3AF" }}
//                 axisLine={false}
//                 tickLine={false}
//                 tickFormatter={(v) => `$${v / 1000}K`}
//               />
//               <Tooltip content={<CustomAreaTooltip />} />
//               <Area
//                 type="monotone"
//                 dataKey="balance"
//                 stroke="#6BC5A8"
//                 strokeWidth={2.5}
//                 fill="url(#cashGrad)"
//                 dot={false}
//                 activeDot={{ r: 5, fill: "#6BC5A8" }}
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* ── BOTTOM ROW ──────────────────────────────────── */}
//       <div
//         style={{
//           display: "flex",
//           gap: 12,
//           flexWrap: "wrap",
//         }}
//       >
//         {/* Expense by Category */}
//         <div
//           style={{
//             background: "#fff",
//             borderRadius: 16,
//             padding: "18px 16px",
//             flex: "1 1 240px",
//             minWidth: 0,
//             boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
//           }}
//         >
//           <p
//             style={{
//               fontSize: 14,
//               fontWeight: 700,
//               color: "#111827",
//               marginBottom: 12,
//             }}
//           >
//             Expense by Category
//           </p>
//           <div
//             style={{
//               display: "flex",
//               flexDirection: window.innerWidth <= 375 ? "column" : "row", // iPhone SE da ustun qilib yuboramiz
//               alignItems: window.innerWidth <= 375 ? "stretch" : "center",
//               gap: 16,
//             }}
//           >
//             {/* Chart - iPhone SE da markazga */}
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "center",
//                 width: window.innerWidth <= 375 ? "100%" : "auto",
//               }}
//             >
//               <PieChart width={120} height={120}>
//                 <Pie
//                   data={expenseCategories}
//                   cx={55}
//                   cy={55}
//                   innerRadius={32}
//                   outerRadius={55}
//                   dataKey="value"
//                   stroke="none"
//                 >
//                   {expenseCategories.map((entry, i) => (
//                     <Cell key={i} fill={entry.color} />
//                   ))}
//                 </Pie>
//               </PieChart>
//             </div>

//             {/* Categories list - iPhone SE da to'liq kenglik */}
//             <div
//               style={{
//                 flex: 1,
//                 minWidth: window.innerWidth <= 375 ? "100%" : 140, // iPhone SE da to'liq kenglik
//               }}
//             >
//               {expenseCategories.map((cat, i) => (
//                 <div
//                   key={i}
//                   style={{
//                     display: "flex",
//                     alignItems: "flex-start", // "center" emas, yuqoridan boshlab joylashtiramiz
//                     justifyContent: "space-between",
//                     marginBottom: 10,
//                     width: "100%",
//                     gap: 8,
//                   }}
//                 >
//                   {/* Chap qism - nom va dot */}
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "flex-start", // dot va matn yuqoridan tekislanadi
//                       gap: 6,
//                       flex: 1,
//                       minWidth: 0, // bu MUHIM!
//                     }}
//                   >
//                     <span
//                       style={{
//                         width: 8,
//                         height: 8,
//                         borderRadius: "50%",
//                         background: cat.color,
//                         flexShrink: 0,
//                         display: "inline-block",
//                         marginTop: 3, // matn bilan tekis turishi uchun
//                       }}
//                     />
//                     <span
//                       style={{
//                         fontSize: 11,
//                         color: "#374151",
//                         whiteSpace: "normal", // matn sig'masa qator tashlaydi
//                         wordBreak: "break-word", // so'zlar uziladi
//                         lineHeight: "1.3",
//                       }}
//                     >
//                       {cat.name}
//                     </span>
//                   </div>

//                   {/* O'ng qism - UZS */}
//                   <span
//                     style={{
//                       fontSize: 11,
//                       color: "#6B7280",
//                       fontWeight: 500,
//                       whiteSpace: "nowrap", // UZS bir qatorda qoladi
//                       flexShrink: 0, // qisqarmaydi
//                       marginLeft: "auto", // o'ngga suriladi
//                       paddingLeft: 4,
//                     }}
//                   >
//                     {cat.value.toLocaleString()} UZS
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Top Income Sources */}
//         <div
//           style={{
//             background: "#fff",
//             borderRadius: 16,
//             padding: "18px 16px",
//             flex: "1 1 200px",
//             minWidth: 0,
//             boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
//           }}
//         >
//           <p
//             style={{
//               fontSize: 14,
//               fontWeight: 700,
//               color: "#111827",
//               marginBottom: 12,
//             }}
//           >
//             Top Income Sources
//           </p>
//           {topIncomeSources.map((item, i) => (
//             <div
//               key={i}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 padding: "7px 0",
//                 borderBottom:
//                   i < topIncomeSources.length - 1
//                     ? "1px solid #F3F4F6"
//                     : "none",
//               }}
//             >
//               <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                 <span
//                   style={{
//                     width: 32,
//                     height: 32,
//                     borderRadius: 8,
//                     background: item.color,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     fontSize: 15,
//                     flexShrink: 0,
//                   }}
//                 >
//                   {item.icon}
//                 </span>
//                 <span
//                   style={{ fontSize: 12, fontWeight: 500, color: "#374151" }}
//                 >
//                   {item.name}
//                 </span>
//               </div>
//               <span style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>
//                 {fmtFull(item.amount)}
//               </span>
//             </div>
//           ))}
//         </div>

//         {/* Top Expenses */}
//         <div
//           style={{
//             background: "#fff",
//             borderRadius: 16,
//             padding: "18px 16px",
//             flex: "1 1 200px",
//             minWidth: 0,
//             boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
//           }}
//         >
//           <p
//             style={{
//               fontSize: 14,
//               fontWeight: 700,
//               color: "#111827",
//               marginBottom: 12,
//             }}
//           >
//             Top Expenses
//           </p>
//           {topExpenses.map((item, i) => (
//             <div
//               key={i}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 padding: "7px 0",
//                 borderBottom:
//                   i < topExpenses.length - 1 ? "1px solid #F3F4F6" : "none",
//               }}
//             >
//               <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                 <span
//                   style={{
//                     width: 32,
//                     height: 32,
//                     borderRadius: 8,
//                     background: item.color,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     fontSize: 15,
//                     flexShrink: 0,
//                   }}
//                 >
//                   {item.icon}
//                 </span>
//                 <span
//                   style={{ fontSize: 12, fontWeight: 500, color: "#374151" }}
//                 >
//                   {item.name}
//                 </span>
//               </div>
//               <span style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>
//                 {fmtFull(item.amount)}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Responsive styles */}
//       <style>{`
//         @media (max-width: 375px) {
//           .stat-cards { flex-direction: column !important; }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Analytics;

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { analyticsAPI } from "../../api/analytics";
import { message } from "antd";

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmtFull = (n) => {
  if (!n && n !== 0) return "0 UZS";
  // Katta sonlarni formatlash (masalan: 1,234,567)
  return Math.round(n).toLocaleString() + " UZS";
};

const fmtShort = (n) => {
  if (!n && n !== 0) return "0";
  if (n >= 1000000) {
    return (n / 1000000).toFixed(1) + "M";
  }
  if (n >= 1000) {
    return (n / 1000).toFixed(1) + "K";
  }
  return n.toString();
};

// ─── CUSTOM TOOLTIP ───────────────────────────────────────────────────────────
const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 10,
          padding: "10px 14px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
          fontSize: 12,
        }}
      >
        <p style={{ fontWeight: 700, marginBottom: 4, color: "#374151" }}>
          {label}
        </p>
        {payload.map((p) => (
          <p
            key={p.dataKey}
            style={{
              color: p.fill === "#6BC5A8" ? "#6BC5A8" : "#E05252",
              margin: "2px 0",
            }}
          >
            {p.dataKey === "income" ? "Income" : "Expenses"}: {fmtFull(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomAreaTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 10,
          padding: "10px 14px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
          fontSize: 12,
        }}
      >
        <p style={{ fontWeight: 700, marginBottom: 4, color: "#374151" }}>
          {label}
        </p>
        <p style={{ color: "#6BC5A8" }}>
          Net Balance: {fmtFull(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

// ─── STAT CARD ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, unit, change, positive, bg, loading }) => (
  <div
    style={{
      background: bg || "#fff",
      borderRadius: 16,
      padding: "20px 22px",
      flex: 1,
      minWidth: 0,
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    }}
  >
    <svg
      style={{ position: "absolute", right: 0, bottom: 0, opacity: 0.15 }}
      width="120"
      height="60"
      viewBox="0 0 120 60"
    >
      <path d="M0 40 Q30 10 60 30 Q90 50 120 20 L120 60 L0 60Z" fill="#aaa" />
    </svg>
    <p
      style={{
        fontSize: 12,
        color: "#6B7280",
        marginBottom: 6,
        fontWeight: 500,
      }}
    >
      {title}
    </p>
    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
      <span
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: "#111827",
          letterSpacing: "-0.5px",
        }}
      >
        {loading
          ? "..."
          : typeof value === "number"
            ? Math.round(value).toLocaleString()
            : value}
      </span>
      <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>
        {unit}
      </span>
    </div>
    <p
      style={{
        fontSize: 12,
        color: positive ? "#22C55E" : "#EF4444",
        marginTop: 4,
        fontWeight: 600,
      }}
    >
      {loading ? "" : change}
    </p>
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({
    total_income: 0,
    total_expense: 0,
    net: 0,
  });

  const [expenseCategories, setExpenseCategories] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [timelineData, setTimelineData] = useState({
    income: [],
    expense: [],
  });

  const [analyticsView, setAnalyticsView] = useState("Monthly View");
  const [cashFlowView, setCashFlowView] = useState("Monthly View");
  const [viewDropdown, setViewDropdown] = useState(null);
  const [granularity, setGranularity] = useState("month");

  const viewOptions = ["Monthly View", "Weekly View", "Yearly View"];

  // Fetch all analytics data
  const fetchAllAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      // Parallel fetch all data
      const [
        overviewData,
        expenseCatData,
        incomeCatData,
        timelineIncome,
        timelineExpense,
      ] = await Promise.allSettled([
        analyticsAPI.getOverview(),
        analyticsAPI.getByCategory("expense"),
        analyticsAPI.getByCategory("income"),
        analyticsAPI.getTimeline("income", granularity),
        analyticsAPI.getTimeline("expense", granularity),
      ]);

      // Overview
      if (overviewData.status === "fulfilled") {
        setOverview(overviewData.value);
      } else {
        console.error("Failed to fetch overview:", overviewData.reason);
      }

      // Expense categories
      if (expenseCatData.status === "fulfilled") {
        const formattedExpense = expenseCatData.value.map((item, index) => ({
          name: item.category,
          value: item.total,
          color: getCategoryColor(index),
        }));
        setExpenseCategories(formattedExpense);
      }

      // Income categories
      if (incomeCatData.status === "fulfilled") {
        const formattedIncome = incomeCatData.value.map((item, index) => ({
          name: item.category,
          value: item.total,
          color: getCategoryColor(index, true),
        }));
        setIncomeCategories(formattedIncome);
      }

      // Timeline data
      const timelineIncomeData =
        timelineIncome.status === "fulfilled"
          ? timelineIncome.value.points
          : [];
      const timelineExpenseData =
        timelineExpense.status === "fulfilled"
          ? timelineExpense.value.points
          : [];

      setTimelineData({
        income: timelineIncomeData,
        expense: timelineExpenseData,
      });
    } catch (error) {
      message.error("Failed to load analytics data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [granularity]);

  // Fetch timeline data when view changes
  const fetchTimelineData = useCallback(async () => {
    try {
      const kind =
        analyticsView === "Income"
          ? "income"
          : analyticsView === "Expense"
            ? "expense"
            : "all";

      const [timelineIncome, timelineExpense] = await Promise.all([
        analyticsAPI.getTimeline(kind, granularity).catch((err) => {
          console.warn("Income timeline fetch failed:", err);
          return { points: [] };
        }),
        analyticsAPI.getTimeline("expense", granularity).catch((err) => {
          console.warn("Expense timeline fetch failed:", err);
          return { points: [] };
        }),
      ]);

      const timelineIncomePoints = timelineIncome?.points || [];
      const timelineExpensePoints = timelineExpense?.points || [];

      // Ensure both arrays have same length
      const maxLength = Math.max(
        timelineIncomePoints.length,
        timelineExpensePoints.length,
      );
      const paddedIncome = [...timelineIncomePoints];
      const paddedExpense = [...timelineExpensePoints];

      while (paddedIncome.length < maxLength) {
        paddedIncome.push({ bucket: `M${paddedIncome.length + 1}`, total: 0 });
      }
      while (paddedExpense.length < maxLength) {
        paddedExpense.push({
          bucket: `M${paddedExpense.length + 1}`,
          total: 0,
        });
      }

      setTimelineData({
        income: paddedIncome,
        expense: paddedExpense,
      });
    } catch (error) {
      console.error("Failed to fetch timeline:", error);
    }
  }, [analyticsView, granularity]);

  // Initial fetch
  useEffect(() => {
    fetchAllAnalytics();
  }, [fetchAllAnalytics]);

  // Fetch when granularity changes
  useEffect(() => {
    if (!loading) {
      fetchTimelineData();
    }
  }, [granularity, analyticsView, loading, fetchTimelineData]);

  const getCategoryColor = (index, isIncome = false) => {
    const colors = isIncome
      ? ["#43A047", "#1E88E5", "#FB8C00", "#8E24AA", "#E53935", "#6BC5A8"]
      : ["#F5A623", "#E05252", "#7C9FF5", "#9B8BE8", "#E06CB0", "#B0B8C8"];
    return colors[index % colors.length];
  };

  // Prepare chart data
  const chartData = useMemo(() => {
    const incomePoints = timelineData.income || [];
    const expensePoints = timelineData.expense || [];

    return incomePoints.map((point, index) => ({
      month: point.bucket
        ? new Date(point.bucket).toLocaleString("default", { month: "short" })
        : `M${index + 1}`,
      income: point.total || 0,
      expenses: expensePoints[index]?.total || 0,
    }));
  }, [timelineData]);

  const cashFlowData = useMemo(
    () =>
      chartData.map((item) => ({
        month: item.month,
        balance: (item.income || 0) - (item.expenses || 0),
      })),
    [chartData],
  );

  // Top income sources from categories
  const topIncomeSources = useMemo(
    () =>
      incomeCategories.slice(0, 4).map((item, index) => ({
        name: item.name,
        amount: item.value,
        icon: getIncomeIcon(index),
        color: "#E8F5E9",
        iconColor: "#43A047",
      })),
    [incomeCategories],
  );

  // Top expenses from categories
  const topExpenses = useMemo(
    () =>
      expenseCategories.slice(0, 4).map((item, index) => ({
        name: item.name,
        amount: item.value,
        icon: getExpenseIcon(index),
        color: "#FFF8E1",
        iconColor: "#F9A825",
      })),
    [expenseCategories],
  );

  const getIncomeIcon = (index) => {
    const icons = ["💼", "💰", "👥", "🌿", "📊", "🏦"];
    return icons[index % icons.length];
  };

  const getExpenseIcon = (index) => {
    const icons = ["🏪", "🍕", "🚗", "🎮", "🛒", "🏥"];
    return icons[index % icons.length];
  };

  const handleViewSelect = (panel, opt) => {
    if (panel === "analytics") {
      setAnalyticsView(opt);
      // Update granularity based on view
      if (opt === "Weekly View") setGranularity("week");
      else if (opt === "Monthly View") setGranularity("month");
      else if (opt === "Yearly View") setGranularity("year");
    } else {
      setCashFlowView(opt);
    }
    setViewDropdown(null);
  };

  return (
    <div
      onClick={() => setViewDropdown(null)}
    >
      {/* ── TOP STAT CARDS ─────────────────────────────── */}
      <div className="flex flex-wrap gap-3 mb-4 md:flex-row flex-col">
        <StatCard
          title="Total Income"
          value={overview.total_income}
          unit="uzs"
          change={loading ? "" : "+18% from last month"}
          positive
          bg="#F0FAF6"
          loading={loading}
        />
        <StatCard
          title="Total Expense"
          value={overview.total_expense}
          unit="uzs"
          change={loading ? "" : "-7% from last month"}
          positive={false}
          bg="#FFF5F5"
          loading={loading}
        />
        <StatCard
          title="Net Balance"
          value={overview.net}
          unit="uzs"
          change={loading ? "" : "+7% from last month"}
          positive
          bg="#F0F4FF"
          loading={loading}
        />
      </div>

      {/* ── CHARTS ROW ──────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        {/* Analytics Bar Chart */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: "18px 16px",
            flex: "1 1 300px",
            minWidth: 0,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
                Analytics
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 11,
                    color: "#6B7280",
                  }}
                >
                  <span
                    style={{
                      width: 20,
                      height: 3,
                      background: "#6BC5A8",
                      borderRadius: 2,
                      display: "inline-block",
                    }}
                  />{" "}
                  Income
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 11,
                    color: "#6B7280",
                  }}
                >
                  <span
                    style={{
                      width: 20,
                      height: 3,
                      background: "#E05252",
                      borderRadius: 2,
                      display: "inline-block",
                    }}
                  />{" "}
                  Expenses
                </span>
              </div>
            </div>
            <div
              style={{ position: "relative" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() =>
                  setViewDropdown(
                    viewDropdown === "analytics" ? null : "analytics",
                  )
                }
                style={{
                  fontSize: 11,
                  color: "#374151",
                  background: "#F9FAFB",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  padding: "4px 10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {analyticsView} <span style={{ fontSize: 9 }}>▼</span>
              </button>
              {viewDropdown === "analytics" && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "110%",
                    background: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: 10,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    zIndex: 100,
                    minWidth: 130,
                    overflow: "hidden",
                  }}
                >
                  {viewOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleViewSelect("analytics", opt)}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "8px 14px",
                        fontSize: 12,
                        color: opt === analyticsView ? "#6BC5A8" : "#374151",
                        background:
                          opt === analyticsView ? "#F0FAF6" : "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: opt === analyticsView ? 600 : 400,
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barGap={2} barCategoryGap="30%">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F3F4F6"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => fmtShort(v)}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="income" fill="#6BC5A8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#E05252" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cash Flow Area Chart */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: "18px 16px",
            flex: "1 1 280px",
            minWidth: 0,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
              Cash Flow
            </span>
            <div
              style={{ position: "relative" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() =>
                  setViewDropdown(
                    viewDropdown === "cashflow" ? null : "cashflow",
                  )
                }
                style={{
                  fontSize: 11,
                  color: "#374151",
                  background: "#F9FAFB",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  padding: "4px 10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {cashFlowView} <span style={{ fontSize: 9 }}>▼</span>
              </button>
              {viewDropdown === "cashflow" && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "110%",
                    background: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: 10,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    zIndex: 100,
                    minWidth: 130,
                    overflow: "hidden",
                  }}
                >
                  {viewOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleViewSelect("cashflow", opt)}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "8px 14px",
                        fontSize: 12,
                        color: opt === cashFlowView ? "#6BC5A8" : "#374151",
                        background:
                          opt === cashFlowView ? "#F0FAF6" : "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: opt === cashFlowView ? 600 : 400,
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={cashFlowData}>
              <defs>
                <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6BC5A8" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6BC5A8" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F3F4F6"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => fmtShort(v)}
              />
              <Tooltip content={<CustomAreaTooltip />} />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#6BC5A8"
                strokeWidth={2.5}
                fill="url(#cashGrad)"
                dot={false}
                activeDot={{ r: 5, fill: "#6BC5A8" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── BOTTOM ROW ──────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        {/* Expense by Category */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: "18px 16px",
            flex: "1 1 240px",
            minWidth: 0,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <p
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#111827",
              marginBottom: 12,
            }}
          >
            Expense by Category
          </p>
          {expenseCategories.length === 0 ? (
            <p
              style={{
                color: "#9CA3AF",
                fontSize: 12,
                textAlign: "center",
                padding: 20,
              }}
            >
              No expense data available
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: window.innerWidth <= 375 ? "column" : "row",
                alignItems: window.innerWidth <= 375 ? "stretch" : "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: window.innerWidth <= 375 ? "100%" : "auto",
                }}
              >
                <PieChart width={120} height={120}>
                  <Pie
                    data={expenseCategories}
                    cx={55}
                    cy={55}
                    innerRadius={32}
                    outerRadius={55}
                    dataKey="value"
                    stroke="none"
                  >
                    {expenseCategories.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </div>

              <div
                style={{
                  flex: 1,
                  minWidth: window.innerWidth <= 375 ? "100%" : 140,
                }}
              >
                {expenseCategories.slice(0, 6).map((cat, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginBottom: 10,
                      width: "100%",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 6,
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: cat.color,
                          flexShrink: 0,
                          display: "inline-block",
                          marginTop: 3,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 11,
                          color: "#374151",
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                          lineHeight: "1.3",
                        }}
                      >
                        {cat.name}
                      </span>
                    </div>

                    <span
                      style={{
                        fontSize: 11,
                        color: "#6B7280",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                        marginLeft: "auto",
                        paddingLeft: 4,
                      }}
                    >
                      {fmtShort(cat.value)} UZS
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Top Income Sources */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: "18px 16px",
            flex: "1 1 200px",
            minWidth: 0,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <p
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#111827",
              marginBottom: 12,
            }}
          >
            Top Income Sources
          </p>
          {topIncomeSources.length === 0 ? (
            <p
              style={{
                color: "#9CA3AF",
                fontSize: 12,
                textAlign: "center",
                padding: 20,
              }}
            >
              No income data
            </p>
          ) : (
            topIncomeSources.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "7px 0",
                  borderBottom:
                    i < topIncomeSources.length - 1
                      ? "1px solid #F3F4F6"
                      : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: item.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </span>
                  <span
                    style={{ fontSize: 12, fontWeight: 500, color: "#374151" }}
                  >
                    {item.name}
                  </span>
                </div>
                <span
                  style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}
                >
                  {fmtShort(item.amount)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Top Expenses */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: "18px 16px",
            flex: "1 1 200px",
            minWidth: 0,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <p
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#111827",
              marginBottom: 12,
            }}
          >
            Top Expenses
          </p>
          {topExpenses.length === 0 ? (
            <p
              style={{
                color: "#9CA3AF",
                fontSize: 12,
                textAlign: "center",
                padding: 20,
              }}
            >
              No expense data
            </p>
          ) : (
            topExpenses.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "7px 0",
                  borderBottom:
                    i < topExpenses.length - 1 ? "1px solid #F3F4F6" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: item.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </span>
                  <span
                    style={{ fontSize: 12, fontWeight: 500, color: "#374151" }}
                  >
                    {item.name}
                  </span>
                </div>
                <span
                  style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}
                >
                  {fmtShort(item.amount)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 375px) {
          .stat-cards { flex-direction: column !important; }
        }
      `}</style>
    </div>
  );
};

export default Analytics;
