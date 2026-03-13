import {
  CreditCard,
  Settings,
  LogOut,
  LayoutGrid,
  ArrowLeftRight,
  ChartLine,
  CalendarRange,
  GitFork,
  Database,
  Headset,
  Signal,
} from "lucide-react";
import logo from "../../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";

const Sidebar = ({
  activeSection,
  setActiveSection,
  collapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const navigate = useNavigate();

  const mainSections = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutGrid size={20} /> },
    { id: "accounts", label: "Accounts", icon: <CreditCard size={20} /> },
    {
      id: "transactions",
      label: "Transactions",
      icon: <ArrowLeftRight size={20} />,
    },
    { id: "budget", label: "Budget", icon: <Database size={20} /> },
    { id: "debts", label: "Debts", icon: <Signal size={20} /> },
    { id: "analytics", label: "Analytics", icon: <ChartLine size={20} /> },
    { id: "calendar", label: "Calendar", icon: <CalendarRange size={20} /> },
    { id: "family", label: "Family", icon: <GitFork size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  const bottomSections = [
    { id: "support", label: "Support", icon: <Headset size={20} /> },
    { id: "logout", label: "Log Out", icon: <LogOut size={20} /> },
  ];

  // Sidebar desktop/mobile styles
  const baseClasses = `bg-[linear-gradient(180deg,#071A4B,#0A2560,#0B2E6D,#021033)] text-white shadow-lg h-full flex flex-col justify-between transition-all duration-300`;

  const desktopWidth = collapsed ? "w-20" : "w-64";

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)} // overlay bosilganda yopilsin
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Sidebar itself */}
      <div
        className={`${baseClasses} 
        ${desktopWidth} 
        fixed md:relative z-50 
        left-0 top-0 h-full 
        transform md:translate-x-0 transition-width duration-300 ease-in-out
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Logo */}
        <div
          className={`flex items-center py-4 border-b border-gray-700 transition-all duration-300 ${
            collapsed ? "justify-center px-3" : "justify-start px-6"
          }`}
        >
          <img src={logo} alt="Logo" className="w-10 h-10" />
          {!collapsed && (
            <h3 className="ml-2 text-lg font-semibold tracking-wide">
              SmartCapital
            </h3>
          )}
        </div>

        {/* Main Sections */}
        <div
          className={`flex flex-col flex-1 justify-start gap-2 mt-4 ${collapsed ? "px-3" : "px-6"}`}
        >
          {mainSections.map((section) => (
            <div
              key={section.id}
              className={`relative group ${collapsed ? "flex justify-center" : ""}`}
            >
              <button
                onClick={() => {
                  navigate(`/home/${section.id}`);
                  setActiveSection(section.id);
                  setMobileOpen(false);
                }}
                className={`flex items-center ${collapsed ? "justify-center" : "gap-3"} p-3 font-medium rounded-lg w-full transition-all duration-200 ${
                  activeSection === section.id
                    ? "bg-white text-blue-900 shadow-md"
                    : "hover:bg-white hover:text-blue-900"
                }`}
              >
                {section.icon}
                {!collapsed && <span>{section.label}</span>}
              </button>

              {collapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {section.label}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Sections */}
        <div
          className={`flex flex-col gap-2 mb-4 ${collapsed ? "px-3" : "px-6"}`}
        >
          <div className="w-full border-t border-gray-700 mb-2"></div>
          {bottomSections.map((section) => (
            <div
              key={section.id}
              className={`relative group ${collapsed ? "flex justify-center" : ""}`}
            >
              <button
                onClick={() => {
                  if (section.id === "logout") {
                    localStorage.removeItem("token");
                    navigate("/login");
                  } else if (section.id === "support") {
                    // Telegram linkga yo'naltirish
                    window.open("https://t.me/Murodil_N", "_blank");
                  } else {
                    setActiveSection(section.id);
                    setMobileOpen(false);
                  }
                }}
                className={`flex items-center ${collapsed ? "justify-center" : "gap-3"} font-medium p-3 rounded-lg w-full transition-all duration-200 ${
                  activeSection === section.id
                    ? "bg-white text-blue-900 shadow-md"
                    : "hover:bg-white hover:text-blue-900"
                }`}
              >
                {section.icon}
                {!collapsed && <span>{section.label}</span>}
              </button>

              {collapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {section.label}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
