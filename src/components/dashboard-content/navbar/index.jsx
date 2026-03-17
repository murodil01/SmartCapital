import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ChevronDown,
  Calendar,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { settingsAPI } from "../../../api/settings";

// ── Month picker data ─────────────────────────────────────────────
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

// ── Helper ──────────────────────────────────────────────────────
const today = new Date();

const sectionTitles = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Manage your Debts and Receivables.",
  },
  accounts: {
    title: "Accounts",
    subtitle: "Gain insights into your income and expenses.",
  },
  transactions: {
    title: "Transactions",
    subtitle: "Track and manage all your financial activity.",
  },
  budget: {
    title: "Budgets",
    subtitle: "Plan and manage your monthly spending.",
  },
  debts: { title: "Debts", subtitle: "Manage your Debts and Receivables." },
  analytics: {
    title: "Analytics",
    subtitle: "Gain insights into your income and expenses.",
  },
  calendar: {
    title: "Calendar",
    subtitle: "Track your income and expenses by date",
  },
  family: {
    title: "Family",
    subtitle: "Manage your family members, budgets and shared expenses.",
  },
  settings: { title: "Settings", subtitle: "Manage your profile." },
  support: { title: "Support", subtitle: "Get help or contact support." },
  logout: { title: "Log Out", subtitle: "Manage your session or logout." },
};

const Navbar = ({
  activeSection = "dashboard",
  mobileOpen,
  setMobileOpen,
}) => {
  // ── Search ────────────────────────────────────────────────────
  const [searchValue, setSearchValue] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const navigate = useNavigate();

  // ── Month picker ──────────────────────────────────────────────
  const [monthOpen, setMonthOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [pickerYear, setPickerYear] = useState(today.getFullYear());
  const monthRef = useRef(null);

  // ── Profile dropdown ─────────────────────────────────────────
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // ── Profile data from API ────────────────────────────────────
  const [profileData, setProfileData] = useState({
    full_name: "",
    email: "",
    avatar_url: null,
  });
  const [loading, setLoading] = useState(true);

  // ── Fetch profile data ───────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await settingsAPI.getProfile();
        setProfileData(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ── Get initials for avatar ──────────────────────────────────
  const getInitials = () => {
    if (profileData.full_name) {
      return profileData.full_name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return "U";
  };

  // ── Close dropdowns on outside click ─────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (monthRef.current && !monthRef.current.contains(e.target))
        setMonthOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target)
      ) {
        setMobileSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Auto-focus search input on mobile ───────────────────────
  useEffect(() => {
    if (mobileSearchOpen && searchRef.current) searchRef.current.focus();
  }, [mobileSearchOpen]);

  const { title, subtitle } =
    sectionTitles[activeSection] || sectionTitles.dashboard;

  const monthLabel =
    selectedMonth === today.getMonth() && pickerYear === today.getFullYear()
      ? "This month"
      : `${MONTHS[selectedMonth].slice(0, 3)} ${pickerYear}`;

  // ── Handle logout ────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("tokenData");
    setProfileOpen(false);
    navigate("/login");
  };

  return (
    <div className="bg-[#EEF1FF] shadow-2xl border-b border-[#E0E0E0] px-2 lg:px-9.5 py-3 flex flex-col gap-2 relative">
      {/* Mobile search bar */}
      {mobileSearchOpen && (
        <div
          ref={mobileSearchRef}
          className="md:hidden flex items-center gap-2 bg-white rounded-xl border border-blue-300 px-3 py-2 shadow"
        >
          <Search size={15} className="text-gray-400 shrink-0" />
          <input
            ref={searchRef}
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search..."
            className="flex-1 text-[13px] text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
          />
          {searchValue && (
            <button onClick={() => setSearchValue("")}>
              <X size={13} className="text-gray-400" />
            </button>
          )}
          <button onClick={() => setMobileSearchOpen(false)}>
            <X size={15} className="text-gray-500" />
          </button>
        </div>
      )}

      {/* Main row */}
      <div className="flex justify-between gap-1 items-center">
        {/* LEFT */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Mobile menu button - Yangi qo'shildi */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/60 transition-colors shrink-0"
          >
            <Menu size={20} className="text-gray-600" />
          </button>

          {/* Section title & subtitle - Responsive qilindi */}
          <div className="flex flex-col min-w-0 flex-1">
            <h3 
              className="text-[13px] sm:text-lg md:text-xl lg:text-[22px] font-semibold text-black leading-tight truncate" 
              title={title}
            >
              {title}
            </h3>
            <p 
              className="hidden md:block text-[13px] font-normal text-gray-500 mt-0.5 truncate" 
              title={subtitle}
            >
              {subtitle}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Desktop Search */}
          <div className="relative hidden md:flex items-center">
            <Search
              size={14}
              className="absolute left-3 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search..."
              className="w-44 lg:w-52 pl-9 pr-8 py-2 text-[13px] bg-white/60 border border-[#D1D5DB] rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-150"
            />
            {searchValue && (
              <button
                onClick={() => setSearchValue("")}
                className="absolute right-2.5 text-gray-400 hover:text-gray-600"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Mobile Search icon */}
          <button
            onClick={() => setMobileSearchOpen(true)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-[#D1D5DB] bg-white/60 hover:bg-white transition-colors shrink-0"
          >
            <Search size={16} className="text-gray-500" />
          </button>

          {/* Desktop Month Picker */}
          <div className="relative hidden md:block" ref={monthRef}>
            <button
              onClick={() => {
                setMonthOpen(!monthOpen);
                setProfileOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#D1D5DB] text-[13px] font-medium text-gray-600 bg-white/60 hover:bg-white transition-all duration-150 whitespace-nowrap"
            >
              <Calendar size={14} className="text-gray-400 shrink-0" />
              <span className="hidden lg:inline">{monthLabel}</span>
              <span className="lg:hidden">
                {selectedMonth === today.getMonth() && pickerYear === today.getFullYear()
                  ? "This month"
                  : `${MONTHS[selectedMonth].slice(0, 3)} ${pickerYear}`}
              </span>
              <ChevronDown
                size={13}
                className={`text-gray-400 transition-transform duration-200 shrink-0 ${monthOpen ? "rotate-180" : ""}`}
              />
            </button>

            {monthOpen && (
              <div className="absolute right-0 top-[110%] z-50 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-4 w-64">
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => setPickerYear((y) => y - 1)}
                    className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center"
                  >
                    <ChevronLeft size={15} className="text-gray-500" />
                  </button>
                  <span className="text-[14px] font-semibold text-gray-700">
                    {pickerYear}
                  </span>
                  <button
                    onClick={() => setPickerYear((y) => y + 1)}
                    className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center"
                  >
                    <ChevronRight size={15} className="text-gray-500" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {MONTHS.map((m, i) => {
                    const isSelected = i === selectedMonth;
                    const isToday = i === today.getMonth() && pickerYear === today.getFullYear();
                    return (
                      <button
                        key={m}
                        onClick={() => {
                          setSelectedMonth(i);
                          setMonthOpen(false);
                        }}
                        className={`py-1.5 rounded-lg text-[12px] font-medium transition-colors
                          ${isSelected ? "bg-blue-500 text-white" : isToday ? "border border-blue-400 text-blue-600" : "hover:bg-gray-100 text-gray-600"}`}
                      >
                        {m.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => {
                    setSelectedMonth(today.getMonth());
                    setPickerYear(today.getFullYear());
                    setMonthOpen(false);
                  }}
                  className="mt-3 w-full text-[12px] text-blue-500 hover:underline font-medium"
                >
                  Reset to current month
                </button>
              </div>
            )}
          </div>

          {/* Mobile Month Picker */}
          <div className="relative md:hidden" ref={monthRef}>
            <button
              onClick={() => {
                setMonthOpen(!monthOpen);
                setProfileOpen(false);
              }}
              className="flex items-center justify-center w-9 h-9 rounded-xl border border-[#D1D5DB] bg-white/60 hover:bg-white transition-colors shrink-0"
            >
              <Calendar size={16} className="text-gray-500" />
            </button>

            {monthOpen && (
              <div className="absolute right-0 top-[110%] z-50 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-4 w-64">
                <div className="grid grid-cols-3 gap-1.5">
                  {MONTHS.map((m, i) => {
                    const isToday = i === today.getMonth() && pickerYear === today.getFullYear();
                    return (
                      <button
                        key={m}
                        onClick={() => {
                          setSelectedMonth(i);
                          setMonthOpen(false);
                        }}
                        className={`py-1.5 rounded-lg text-[12px] font-medium transition-colors
                          ${i === selectedMonth ? "bg-blue-500 text-white" : isToday ? "border border-blue-400 text-blue-600" : "hover:bg-gray-100 text-gray-600"}`}
                      >
                        {m.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => {
                    setSelectedMonth(today.getMonth());
                    setPickerYear(today.getFullYear());
                    setMonthOpen(false);
                  }}
                  className="mt-3 w-full text-[12px] text-blue-500 hover:underline font-medium"
                >
                  Reset to current month
                </button>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setMonthOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#D1D5DB] text-[13px] font-medium text-gray-700 bg-white/60 hover:bg-white transition-all duration-150 shrink-0"
            >
              {profileData.avatar_url ? (
                <img
                  src={profileData.avatar_url}
                  alt={profileData.full_name}
                  className="w-6 h-6 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                  {loading ? "..." : getInitials()}
                </div>
              )}
              <span className="hidden md:inline max-w-20 truncate">
                {loading
                  ? "Loading"
                  : (profileData.full_name?.length > 8
                      ? profileData.full_name.slice(0, 8) + "..."
                      : profileData.full_name) || "User"}
              </span>
              <ChevronDown
                size={13}
                className={`text-gray-400 transition-transform duration-200 shrink-0 ${profileOpen ? "rotate-180" : ""}`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-[110%] z-50 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl w-52 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    {profileData.avatar_url ? (
                      <img
                        src={profileData.avatar_url}
                        alt={profileData.full_name}
                        className="w-9 h-9 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                        {getInitials()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-gray-800 truncate">
                        {profileData.full_name
                          ? profileData.full_name.slice(0, 18)
                          : "User"}
                      </p>
                      <p className="text-[11px] text-gray-400 font-normal truncate">
                        {profileData.email || "user@example.com"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100">
                  <button
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut size={15} className="text-red-400 shrink-0" />
                    <span className="truncate">Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;