import { useState } from "react";
import { Eye, EyeOff, Plus, MoreVertical, CreditCard } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const accounts = [
  {
    id: 1,
    name: "Uzcard",
    type: "CARD",
    balance: 123000,
    hidden: true,
    color: "from-blue-500 to-blue-700",
    bg: "#3b82f6",
  },
  {
    id: 2,
    name: "Humo",
    type: "CARD",
    balance: 2000000,
    hidden: false,
    color: "from-orange-400 to-orange-600",
    bg: "#f97316",
  },
  {
    id: 3,
    name: "Cash",
    type: "CASH",
    balance: 500000,
    hidden: false,
    color: "from-green-400 to-green-600",
    bg: "#22c55e",
  },
  {
    id: 4,
    name: "VISA",
    type: "VISA CARD",
    balance: 4800000,
    hidden: false,
    color: "from-purple-500 to-purple-700",
    bg: "#a855f7",
  },
  {
    id: 5,
    name: "Uzcard",
    type: "CARD",
    balance: 123000,
    hidden: false,
    color: "from-gray-700 to-gray-900",
    bg: "#374151",
  },
];

const fmt = (n) => n.toLocaleString("ru-RU").replace(/,/g, " ");

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

const AccountCard = ({ account }) => {
  const [hidden, setHidden] = useState(account.hidden);
  return (
    <div
      className={`relative bg-linear-to-br ${account.color} rounded-2xl p-4 overflow-hidden cursor-pointer select-none`}
      style={{ minHeight: 140 }}
    >
      <WavePattern />
      <div className="relative z-10 flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold text-[14px]">
            {account.name}
          </span>
          <button onClick={() => setHidden(!hidden)}>
            {hidden ? (
              <EyeOff size={14} className="text-white/70" />
            ) : (
              <Eye size={14} className="text-white/70" />
            )}
          </button>
        </div>
        <button>
          <MoreVertical size={16} className="text-white/70" />
        </button>
      </div>
      <div className="relative z-10 mb-6">
        {hidden ? (
          <span className="text-white text-[18px] font-bold tracking-widest">
            •••••
          </span>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className="text-white text-[20px] font-bold tracking-tight">
              {fmt(account.balance)}
            </span>
            <span className="text-white/60 text-[11px]">UZS</span>
          </div>
        )}
      </div>
      <div className="relative z-10 flex justify-between items-center">
        <span className="text-white/60 text-[10px] font-medium tracking-wider">
          {account.type}
        </span>
        <CreditCard size={16} className="text-white/40" />
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
  const [showChart, setShowChart] = useState(false);
  const total = accounts.reduce((s, a) => s + a.balance, 0);

  const pieData = accounts.map((a) => ({
    name: `${a.name} (${a.type})`,
    value: a.balance,
    color: a.bg,
  }));

  return (
    <div className="shadow-sm bg-white p-5 border border-[#E0E0E0] rounded-2xl flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-bold text-gray-900">Total Balance</h3>
        <button className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-[13px] font-medium px-4 py-2 rounded-xl transition-colors">
          <Plus size={15} /> Add Account
        </button>
      </div>

      {/* Total Balance Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Balance info */}
          <div
            className="relative p-6 flex-1 overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 60%, #e8f4fd 100%)",
            }}
          >
            <WavePattern />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-gray-600 text-[13px] mb-2">
                My Total Balance
                <button
                  onClick={() => setShowChart(!showChart)}
                  className="hover:scale-110 transition-transform"
                >
                  {showChart ? (
                    <EyeOff size={16} className="text-blue-500" />
                  ) : (
                    <Eye size={16} className="text-blue-500" />
                  )}
                </button>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[31px] xl:text-[34px] font-bold text-gray-900 tracking-tight">
                  {fmt(total)}
                </span>
                <span className="text-gray-400 text-[13px]">UZS</span>
              </div>
              <p className="text-gray-400 text-[12px]">
                Across {accounts.length} accounts
              </p>
            </div>
          </div>

          {/* Pie Chart */}
          {showChart && (
            <div
              className="flex-1 p-4 flex items-center justify-center border-t md:border-t-0 md:border-l border-gray-100"
              style={{
                background:
                  "linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 60%, #e8f4fd 100%)",
              }}
            >
              <div className="w-full" style={{ height: 200 }}>
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
                          {val}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((acc) => (
            <AccountCard key={acc.id} account={acc} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Accounts;
