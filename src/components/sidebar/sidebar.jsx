import React from "react";
import paths from "./menu.js";
import { Link, useLocation } from "react-router-dom";
import MenuItemWithSub from "./submenu.jsx";
import EVezzFullLogo from "../../assets/logo_full.png";
import { useAuth } from "../../hooks/AuthProvider.jsx";

const Sidebar = () => {
  const { userRole } = useAuth();
  return (
    <div className="max-w-[200px] xl:max-w-[220px] flex-1">
      <header className="px-4 py-4 md:py-0">
        <Link to="/dashboard" className="md:p-2">
          <img src={EVezzFullLogo} alt="EVeez Logo" className="w-40" />
        </Link>
      </header>
      <main className="flex flex-col gap-3 md:px-4">
        {paths.map((item, index) => {
          if (item.allowedRoles.includes(userRole)) {
            return item.hasSubmenu ? (
              <MenuItemWithSub key={index} data={item} />
            ) : (
              <MenuItem key={index} data={item} />
            );
          }
        })}
      </main>
    </div>
  );
};

const MenuItem = ({ data }) => {
  const { pathname } = useLocation();
  const isCurrentpath = pathname.includes(data.path);
  const Icon = data.icon;
  return (
    <Link
      to={data.path}
      className={`flex gap-3 items-center text-sm font-[500] tracking-wide text-[#6C6C74] rounded-lg px-2 py-2 w-[200px] ${
        isCurrentpath ? "bg-[#FFEEEB]" : ""
      }`}
    >
      <Icon
        className={`h-5 w-5`}
        color={isCurrentpath ? "#FF5733" : "#6C6C74"}
      />
      <span
        className={`${isCurrentpath ? "text-[#FF5733]" : "text-[#6C6C74]"}`}
      >
        {data.title}
      </span>
    </Link>
  );
};

export default Sidebar;
