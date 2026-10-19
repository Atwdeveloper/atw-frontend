import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import Footer from "../../admin/components/Footer";

const CompanyLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 overflow-hidden">
      <div className="shrink-0">
        <Header toggleSidebar={toggleSidebar} />
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Footer ko main ke saath rakho, sidebar ke baad */}
        <div className="flex flex-col flex-1">
          <main className="flex-1 overflow-y-auto px-6 py-4 pb-[50px] bg-gray-50 relative">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default CompanyLayout;
