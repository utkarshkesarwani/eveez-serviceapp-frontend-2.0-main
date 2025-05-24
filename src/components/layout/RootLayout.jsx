import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Sidebar from "../sidebar/sidebar";
import { Toaster } from "react-hot-toast";
import { useAuth } from "../../hooks/AuthProvider";

const RootLayout = () => {
  const { loading, isAuthenticated } = useAuth();
  // if (loading) {
  //   return <p className="w-full text-center">Loading</p>;
  // }
  return (
    <div className="flex h-screen overflow-hidden">
      <Toaster />
      <div className="w-64 hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-shrink-0">
          <Navbar />
        </div>
        <div className="flex-1 bg-slate-100 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
