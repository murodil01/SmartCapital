import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../../components/dashboard-content/side-bar";
import Navbar from "../../components/dashboard-content/navbar";

const HomeLayout = () => {
  const location = useLocation();

  // URLdan default activeSection olish
  const pathParts = location.pathname.split("/"); // ["", "home", "dashboard"]
  const defaultSection = pathParts[2] || "dashboard";

  const [activeSection, setActiveSection] = useState(defaultSection);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // 🔹 Sahifa o‘zgarganda scrollni yuqoriga qaytarish
  useEffect(() => {
    const content = document.getElementById("content-area");
    if (content) content.scrollTop = 0;
  }, [location.pathname]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Right side: Navbar + Content */}
      <div className="flex-1 flex flex-col">
        <Navbar
          activeSection={activeSection} 
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* Content area */}
        <div
          id="content-area"
          className="flex-1 bg-gray-100 p-4 overflow-auto no-scrollbar"
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default HomeLayout;