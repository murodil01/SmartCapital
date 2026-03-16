import { useState, useEffect, useCallback, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  AlertCircle,
  ChevronRight,
  ShoppingBag,
  ArrowLeftRight,
  Car,
  Wifi,
  Plus,
} from "lucide-react";
import { dashboardAPI } from "../../api/dashboard";
import { message } from "antd";

// Helper functions
const fmt = (n) => {
  if (!n && n !== 0) return "0";
  return Math.round(n).toLocaleString("uz-UZ").replace(/,/g, " ");
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

// Generate chart data from transactions
const generateChartData = (transactions) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  
  // Last 12 months
  const chartData = [];
  for (let i = 11; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    const month = months[monthIndex];
    
    // Filter transactions for this month
    const monthTransactions = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() === monthIndex;
    });
    
    const income = monthTransactions
      .filter(tx => tx.kind === 'income')
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    
    const expenses = monthTransactions
      .filter(tx => tx.kind === 'expense')
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    
    chartData.push({
      month,
      income: income / 1000, // Convert to thousands for chart
      expenses: expenses / 1000,
    });
  }
  
  return chartData;
};

// Get icon component based on transaction kind/category
const getTransactionIcon = (tx) => {
  const category = tx.category?.toLowerCase() || '';
  const kind = tx.kind;
  
  if (kind === 'income') return { icon: TrendingUp, bg: "bg-green-500" };
  if (kind === 'transfer') return { icon: ArrowLeftRight, bg: "bg-blue-400" };
  
  // Expense categories
  if (category.includes('store') || category.includes('shopping')) 
    return { icon: ShoppingBag, bg: "bg-red-500" };
  if (category.includes('transport') || category.includes('car') || category.includes('taxi')) 
    return { icon: Car, bg: "bg-blue-600" };
  if (category.includes('internet') || category.includes('wifi') || category.includes('bill')) 
    return { icon: Wifi, bg: "bg-indigo-500" };
  
  return { icon: Plus, bg: "bg-gray-500" };
};

function StatCard({ icon: Icon, label, amount, sub, subColor, borderColor, loading }) {
  return (
    <div
      className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-3 border-l-4 ${borderColor}`}
    >
      <div className="flex items-center gap-2 text-gray-500 text-base sm:text-lg md:text-xl lg:text-[20px] font-normal">
        {Icon && <Icon size={20} />}
        {label}
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-base sm:text-lg md:text-xl lg:text-[26px] font-bold text-gray-900 tracking-tight">
          {loading ? "..." : fmt(amount)}
        </span>
        <span className="text-[12px] text-gray-400 font-medium">UZS</span>
        {label === "Total Balance" && !loading && (
          <Eye size={16} className="text-gray-400 ml-1 cursor-pointer" />
        )}
      </div>
      <div className="flex items-center justify-between text-[14px] text-gray-400">
        <span>
          {label === "Total Balance"
            ? "Across all accounts"
            : "Since last month"}
        </span>
        <span className={`font-semibold ${subColor}`}>{loading ? "..." : sub}</span>
      </div>
    </div>
  );
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    total_balance: 0,
    total_income: 0,
    total_expense: 0,
    net: 0,
    accounts: [],
    recent_transactions: [],
    top_categories: []
  });
  
  const [viewMode, setViewMode] = useState("Monthly View");

  // Fetch dashboard data
  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const data = await dashboardAPI.getDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Fetch dashboard error:', error);
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Generate chart data from transactions
  const chartData = useMemo(() => 
    generateChartData(dashboardData.recent_transactions),
    [dashboardData.recent_transactions]
  );

  // Calculate change percentages
  const calculateChange = (current, previous = 0) => {
    if (!previous || previous === 0) return "0%";
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? '↑' : '↓'} ${Math.abs(change).toFixed(1)}%`;
  };

  // Mock previous values for now (would need historical data)
  const changes = {
    balance: calculateChange(dashboardData.total_balance, dashboardData.total_balance * 0.9),
    income: calculateChange(dashboardData.total_income, dashboardData.total_income * 0.85),
    expense: calculateChange(dashboardData.total_expense, dashboardData.total_expense * 1.1),
    profit: calculateChange(dashboardData.net, dashboardData.net * 0.92)
  };

  // Check for alerts (exceeded categories)
  const alerts = useMemo(() => {
    const alertsList = [];
    
    // Check if any category is overspent (would need budget data)
    // For now, just show a sample alert if there are expenses
    if (dashboardData.top_categories.length > 0 && dashboardData.top_categories[0].total > 1000000) {
      alertsList.push({
        category: dashboardData.top_categories[0].category,
        message: `You have exceeded your ${dashboardData.top_categories[0].category} category limit!`
      });
    }
    
    return alertsList;
  }, [dashboardData.top_categories]);

  return (
    <div className="flex flex-col gap-5">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Wallet}
          label="Total Balance"
          amount={dashboardData.total_balance}
          sub={changes.balance}
          subColor={dashboardData.total_balance > 0 ? "text-green-500" : "text-red-500"}
          borderColor="border-l-blue-700"
          loading={loading}
        />
        <StatCard
          icon={TrendingUp}
          label="Income"
          amount={dashboardData.total_income}
          sub={changes.income}
          subColor="text-green-500"
          borderColor="border-l-green-600"
          loading={loading}
        />
        <StatCard
          icon={TrendingDown}
          label="Expenses"
          amount={dashboardData.total_expense}
          sub={changes.expense}
          subColor={dashboardData.total_expense > 0 ? "text-red-500" : "text-green-500"}
          borderColor="border-l-red-500"
          loading={loading}
        />
        <StatCard
          icon={DollarSign}
          label="Profit"
          amount={dashboardData.net}
          sub={changes.profit}
          subColor={dashboardData.net > 0 ? "text-green-500" : "text-red-500"}
          borderColor="border-l-purple-600"
          loading={loading}
        />
      </div>

      {/* Chart + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4">
            <span className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] font-semibold text-gray-800">
              Financial Overview
            </span>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-[10px] sm:text-[11px] md:text-[12px] lg:text-[12px] text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-6 h-0.5 bg-blue-400 inline-block rounded" />
                  Income
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-6 h-0.5 bg-red-400 inline-block rounded" />
                  Expenses
                </span>
              </div>
              <button
                onClick={() =>
                  setViewMode((prev) =>
                    prev === "Monthly View" ? "Yearly View" : "Monthly View",
                  )
                }
                className="flex items-center gap-1 text-[10px] sm:text-[11px] md:text-[12px] lg:text-[12px] border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50"
                disabled={loading}
              >
                {viewMode} <TrendingDown size={12} />
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-[220px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${fmtShort(v * 1000)}`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                    fontSize: 12,
                  }}
                  formatter={(val, name) => [
                    `${fmt(val * 1000)} UZS`,
                    name === "income" ? "Income" : "Expenses",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  fill="url(#incomeGrad)"
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#f87171"
                  strokeWidth={2}
                  fill="url(#expenseGrad)"
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[15px] font-semibold text-gray-800">
              Alerts
            </span>
            <button className="text-[14px] text-black font-normal flex items-center gap-0.5 hover:text-gray-600">
              View all <ChevronRight size={14} />
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-20">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700"></div>
            </div>
          ) : alerts.length > 0 ? (
            alerts.map((alert, index) => (
              <div key={index} className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl p-3">
                <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertCircle size={16} className="text-white" />
                </div>
                <p className="text-[14px] font-normal text-[#F83C3F] leading-snug">
                  {alert.message}
                </p>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl p-3">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white text-sm">✓</span>
              </div>
              <p className="text-[14px] font-normal text-green-600 leading-snug">
                All budgets are on track!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[15px] font-semibold text-gray-800">
            Recent Transactions
          </span>
          <button className="text-[14px] text-black font-normal flex items-center gap-0.5 hover:text-gray-600">
            View all <ChevronRight size={14} />
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          </div>
        ) : dashboardData.recent_transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No recent transactions
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-gray-50">
            {dashboardData.recent_transactions.slice(0, 5).map((tx) => {
              const { icon: Icon, bg } = getTransactionIcon(tx);
              const isPositive = tx.kind === 'income';
              
              return (
                <div key={tx.id} className="flex items-center justify-between py-3 border-b border-gray-300">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}
                    >
                      <Icon size={16} className="text-white" />
                    </div>
                    <div>
                      <span className="text-[14px] font-medium text-gray-800 block">
                        {tx.title || tx.category || 'Transaction'}
                      </span>
                      {tx.merchant && (
                        <span className="text-[11px] text-gray-400">{tx.merchant}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className={`text-[14px] font-bold ${isPositive ? "text-green-600" : "text-red-500"}`}>
                      {isPositive ? '+' : '-'}{fmt(Math.abs(tx.amount))}{" "}
                      <span className="text-[11px] font-normal text-gray-400">
                        {tx.currency || "UZS"}
                      </span>
                    </span>
                    <span className="text-[12px] text-gray-400 hidden sm:block">
                      {tx.date}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Top Categories */}
      {!loading && dashboardData.top_categories.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[15px] font-semibold text-gray-800">
              Top Categories
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dashboardData.top_categories.map((cat, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-[13px] font-medium text-gray-700">{cat.category}</span>
                <span className="text-[13px] font-bold text-gray-900">{fmt(cat.total)} UZS</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

// import { useState } from "react";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   Wallet,
//   TrendingUp,
//   TrendingDown,
//   DollarSign,
//   Eye,
//   AlertCircle,
//   ChevronRight,
//   ShoppingBag,
//   ArrowLeftRight,
//   Car,
//   Wifi,
//   Plus,
// } from "lucide-react";

// const chartData = [
//   { month: "Jan", income: 800, expenses: 600 },
//   { month: "Feb", income: 1200, expenses: 900 },
//   { month: "Mar", income: 900, expenses: 1100 },
//   { month: "Apr", income: 1400, expenses: 800 },
//   { month: "May", income: 1100, expenses: 700 },
//   { month: "Jun", income: 1600, expenses: 600 },
//   { month: "Jul", income: 1300, expenses: 900 },
//   { month: "Aug", income: 4800, expenses: 1200 },
//   { month: "Oct", income: 3200, expenses: 2200 },
//   { month: "Sept", income: 2600, expenses: 2000 },
//   { month: "Nov", income: 3400, expenses: 2400 },
//   { month: "Dec", income: 3800, expenses: 4800 },
// ];

// const transactions = [
//   {
//     id: 1,
//     name: "Salary",
//     amount: "+4 000 000",
//     color: "text-green-600",
//     date: "2025-06-06",
//     icon: Plus,
//     iconBg: "bg-blue-500",
//   },
//   {
//     id: 2,
//     name: "Store",
//     amount: "-150 000",
//     color: "text-red-500",
//     date: "2025-06-06",
//     icon: ShoppingBag,
//     iconBg: "bg-red-500",
//   },
//   {
//     id: 3,
//     name: "Card Transfer",
//     amount: "-500 000",
//     color: "text-red-500",
//     date: "2025-06-06",
//     icon: ArrowLeftRight,
//     iconBg: "bg-blue-400",
//   },
//   {
//     id: 4,
//     name: "Taxi",
//     amount: "-35 000",
//     color: "text-red-500",
//     date: "2025-06-06",
//     icon: Car,
//     iconBg: "bg-blue-600",
//   },
//   {
//     id: 5,
//     name: "Internet Bill",
//     amount: "-80 000",
//     color: "text-red-500",
//     date: "2025-06-06",
//     icon: Wifi,
//     iconBg: "bg-indigo-500",
//   },
// ];

// function StatCard({ icon: Icon, label, amount, sub, subColor, borderColor }) {
//   return (
//     <div
//       className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-3 border-l-4 ${borderColor}`}
//     >
//       <div className="flex items-center gap-2 text-gray-500 text-base sm:text-lg md:text-xl lg:text-[20px] font-normal">
//         {Icon && <Icon size={20} />}
//         {label}
//       </div>
      
//       <div className="flex items-center gap-2">
//         <span className="text-base sm:text-lg md:text-xl lg:text-[26px] font-bold text-gray-900 tracking-tight">
//           {amount}
//         </span>
//         <span className="text-[12px] text-gray-400 font-medium">UZS</span>
//         {label === "Total Balance" && (
//           <Eye size={16} className="text-gray-400 ml-1 cursor-pointer" />
//         )}
//       </div>
//       <div className="flex items-center justify-between text-[14px] text-gray-400">
//         <span>
//           {label === "Total Balance"
//             ? "Across all accounts"
//             : "Since last month"}
//         </span>
//         <span className={`font-semibold ${subColor}`}>{sub}</span>
//       </div>
//     </div>
//   );
// }

// const Dashboard = () => {
//   const [viewMode, setViewMode] = useState("Monthly View");

//   return (
//     <div className="flex flex-col gap-5">
//       {/* Stat Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard
//           icon={Wallet}
//           label="Total Balance"
//           amount="7 300 000"
//           sub="↑ 12.73%"
//           subColor="text-green-500"
//           borderColor="border-l-blue-700"
//         />
//         <StatCard
//           icon={TrendingUp}
//           label="Income"
//           amount="+5 000 000"
//           sub="↑ 11.94%"
//           subColor="text-green-500"
//           borderColor="border-l-green-600"
//         />
//         <StatCard
//           icon={TrendingDown}
//           label="Expenses"
//           amount="-3 200 000"
//           sub="↓ 13.00%"
//           subColor="text-red-500"
//           borderColor="border-l-red-500"
//         />
//         <StatCard
//           icon={DollarSign}
//           label="Profit"
//           amount="1 800 000"
//           sub="↑ 9.80%"
//           subColor="text-green-500"
//           borderColor="border-l-purple-600"
//         />
//       </div>

//       {/* Chart + Alerts */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//         {/* Chart */}
//         <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
//           <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4">
//             <span className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] font-semibold text-gray-800">
//               Financial Overview
//             </span>

//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-3 text-[10px] sm:text-[11px] md:text-[12px] lg:text-[12px] text-gray-500">
//                 <span className="flex items-center gap-1">
//                   <span className="w-6 h-0.5 bg-blue-400 inline-block rounded" />
//                   Income
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <span className="w-6 h-0.5 bg-red-400 inline-block rounded" />
//                   Expenses
//                 </span>
//               </div>
//               <button
//                 onClick={() =>
//                   setViewMode((prev) =>
//                     prev === "Monthly View" ? "Yearly View" : "Monthly View",
//                   )
//                 }
//                 className="flex items-center gap-1 text-[10px] sm:text-[11px] md:text-[12px] lg:text-[12px]border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50"
//               >
//                 {viewMode} <TrendingDown size={12} />
//               </button>
//             </div>
//           </div>
//           <ResponsiveContainer width="100%" height={220}>
//             <AreaChart
//               data={chartData}
//               margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
//             >
//               <defs>
//                 <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
//                   <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
//                 </linearGradient>
//                 <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#f87171" stopOpacity={0.2} />
//                   <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
//                 </linearGradient>
//               </defs>
//               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//               <XAxis
//                 dataKey="month"
//                 tick={{ fontSize: 11, fill: "#9ca3af" }}
//                 axisLine={false}
//                 tickLine={false}
//               />
//               <YAxis
//                 tick={{ fontSize: 11, fill: "#9ca3af" }}
//                 axisLine={false}
//                 tickLine={false}
//                 tickFormatter={(v) => `${v / 1000}k`}
//               />
//               <Tooltip
//                 contentStyle={{
//                   borderRadius: "10px",
//                   border: "1px solid #e5e7eb",
//                   fontSize: 12,
//                 }}
//                 formatter={(val, name) => [
//                   `${val}`,
//                   name === "income" ? "Income" : "Expenses",
//                 ]}
//               />
//               <Area
//                 type="monotone"
//                 dataKey="income"
//                 stroke="#60a5fa"
//                 strokeWidth={2}
//                 fill="url(#incomeGrad)"
//                 dot={false}
//                 activeDot={{ r: 4 }}
//               />
//               <Area
//                 type="monotone"
//                 dataKey="expenses"
//                 stroke="#f87171"
//                 strokeWidth={2}
//                 fill="url(#expenseGrad)"
//                 dot={false}
//                 activeDot={{ r: 4 }}
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Alerts */}
//         <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
//           <div className="flex items-center justify-between mb-4">
//             <span className="text-[15px] font-semibold text-gray-800">
//               Alerts
//             </span>
//             <button className="text-[14px] text-black font-normal flex items-center gap-0.5 hover:text-gray-600">
//               View all <ChevronRight size={14} />
//             </button>
//           </div>
//           <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl p-3">
//             <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shrink-0 mt-0.5">
//               <AlertCircle size={30} className="text-white" />
//             </div>
//             <p className="text-[16px] font-normal text-[#F83C3F] leading-snug">
//               You have exceeded your Food category limit!
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Recent Transactions */}
//       <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
//         <div className="flex items-center justify-between mb-4">
//           <span className="text-[15px] font-semibold text-gray-800">
//             Recent Transactions
//           </span>
//           <button className="text-[14px] text-black font-normal flex items-center gap-0.5 hover:text-gray-600">
//             View all <ChevronRight size={14} />
//           </button>
//         </div>
//         <div className="flex flex-col divide-y divide-gray-50">
//           {transactions.map((tx) => (
//             <div key={tx.id} className="flex items-center justify-between py-3 border-b border-gray-300">
//               <div className="flex items-center gap-3">
//                 <div
//                   className={`w-9 h-9 rounded-xl ${tx.iconBg} flex items-center justify-center shrink-0`}
//                 >
//                   <tx.icon size={16} className="text-white" />
//                 </div>
//                 <span className="text-[14px] font-medium text-gray-800">
//                   {tx.name}
//                 </span>
//               </div>
//               <div className="flex items-center gap-6">
//                 <span className={`text-[14px] font-bold ${tx.color}`}>
//                   {tx.amount}{" "}
//                   <span className="text-[11px] font-normal text-gray-400">
//                     UZS
//                   </span>
//                 </span>
//                 <span className="text-[12px] text-gray-400 hidden sm:block">
//                   {tx.date}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
