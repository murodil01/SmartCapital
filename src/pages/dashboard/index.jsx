import { useState } from "react";
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

const chartData = [
  { month: "Jan", income: 800, expenses: 600 },
  { month: "Feb", income: 1200, expenses: 900 },
  { month: "Mar", income: 900, expenses: 1100 },
  { month: "Apr", income: 1400, expenses: 800 },
  { month: "May", income: 1100, expenses: 700 },
  { month: "Jun", income: 1600, expenses: 600 },
  { month: "Jul", income: 1300, expenses: 900 },
  { month: "Aug", income: 4800, expenses: 1200 },
  { month: "Oct", income: 3200, expenses: 2200 },
  { month: "Sept", income: 2600, expenses: 2000 },
  { month: "Nov", income: 3400, expenses: 2400 },
  { month: "Dec", income: 3800, expenses: 4800 },
];

const transactions = [
  {
    id: 1,
    name: "Salary",
    amount: "+4 000 000",
    color: "text-green-600",
    date: "2025-06-06",
    icon: Plus,
    iconBg: "bg-blue-500",
  },
  {
    id: 2,
    name: "Store",
    amount: "-150 000",
    color: "text-red-500",
    date: "2025-06-06",
    icon: ShoppingBag,
    iconBg: "bg-red-500",
  },
  {
    id: 3,
    name: "Card Transfer",
    amount: "-500 000",
    color: "text-red-500",
    date: "2025-06-06",
    icon: ArrowLeftRight,
    iconBg: "bg-blue-400",
  },
  {
    id: 4,
    name: "Taxi",
    amount: "-35 000",
    color: "text-red-500",
    date: "2025-06-06",
    icon: Car,
    iconBg: "bg-blue-600",
  },
  {
    id: 5,
    name: "Internet Bill",
    amount: "-80 000",
    color: "text-red-500",
    date: "2025-06-06",
    icon: Wifi,
    iconBg: "bg-indigo-500",
  },
];

function StatCard({ icon: Icon, label, amount, sub, subColor, borderColor }) {
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
          {amount}
        </span>
        <span className="text-[12px] text-gray-400 font-medium">UZS</span>
        {label === "Total Balance" && (
          <Eye size={16} className="text-gray-400 ml-1 cursor-pointer" />
        )}
      </div>
      <div className="flex items-center justify-between text-[14px] text-gray-400">
        <span>
          {label === "Total Balance"
            ? "Across all accounts"
            : "Since last month"}
        </span>
        <span className={`font-semibold ${subColor}`}>{sub}</span>
      </div>
    </div>
  );
}

const Dashboard = () => {
  const [viewMode, setViewMode] = useState("Monthly View");

  return (
    <div className="flex flex-col gap-5">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Wallet}
          label="Total Balance"
          amount="7 300 000"
          sub="↑ 12.73%"
          subColor="text-green-500"
          borderColor="border-l-blue-700"
        />
        <StatCard
          icon={TrendingUp}
          label="Income"
          amount="+5 000 000"
          sub="↑ 11.94%"
          subColor="text-green-500"
          borderColor="border-l-green-600"
        />
        <StatCard
          icon={TrendingDown}
          label="Expenses"
          amount="-3 200 000"
          sub="↓ 13.00%"
          subColor="text-red-500"
          borderColor="border-l-red-500"
        />
        <StatCard
          icon={DollarSign}
          label="Profit"
          amount="1 800 000"
          sub="↑ 9.80%"
          subColor="text-green-500"
          borderColor="border-l-purple-600"
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
                className="flex items-center gap-1 text-[10px] sm:text-[11px] md:text-[12px] lg:text-[12px]border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50"
              >
                {viewMode} <TrendingDown size={12} />
              </button>
            </div>
          </div>
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
                tickFormatter={(v) => `${v / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid #e5e7eb",
                  fontSize: 12,
                }}
                formatter={(val, name) => [
                  `${val}`,
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
          <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl p-3">
            <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle size={30} className="text-white" />
            </div>
            <p className="text-[16px] font-normal text-[#F83C3F] leading-snug">
              You have exceeded your Food category limit!
            </p>
          </div>
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
        <div className="flex flex-col divide-y divide-gray-50">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between py-3 border-b border-gray-300">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl ${tx.iconBg} flex items-center justify-center shrink-0`}
                >
                  <tx.icon size={16} className="text-white" />
                </div>
                <span className="text-[14px] font-medium text-gray-800">
                  {tx.name}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <span className={`text-[14px] font-bold ${tx.color}`}>
                  {tx.amount}{" "}
                  <span className="text-[11px] font-normal text-gray-400">
                    UZS
                  </span>
                </span>
                <span className="text-[12px] text-gray-400 hidden sm:block">
                  {tx.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
