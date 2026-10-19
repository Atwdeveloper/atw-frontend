import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import Footer from "../../admin/components/Footer";

const AgentLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 overflow-hidden">
      <div className="shrink-0">
        <Header toggleSidebar={toggleSidebar} />
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Pass agent-specific role or props to Sidebar if needed */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          userRole="agent" // if Sidebar accepts role prop
        />

        <main className="flex-1 overflow-y-auto px-6 py-4 pb-[50px] bg-gray-50 relative">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AgentLayout;
