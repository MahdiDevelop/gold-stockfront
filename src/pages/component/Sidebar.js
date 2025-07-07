// Sidebar.js
import React from 'react';
import { useSidebar } from './SidebarContext'; // Adjust path as needed

const Sidebar = () => {
  const { isToggled, toggleSidebar } = useSidebar();

  return (
    <aside
      id={isToggled ? "sidebar" : "collapsed"}
      style={{
        borderRight: "solid 1px #F7EEDD",
        boxShadow: "4px 2px 2px solid rgba(0, 0, 0, 0.5)",
        backgroundColor: "#4a5cf2",
        boxShadow: "0 0 .875rem 0 rgb(34, 46, 60,.05)",
      }}
    >
      {/* Sidebar content here */}
      <div className="h-100" style={{ backgroundColor: "white" }}>
        {/* Sidebar content */}
      </div>
    </aside>
  );
};

export default Sidebar;
