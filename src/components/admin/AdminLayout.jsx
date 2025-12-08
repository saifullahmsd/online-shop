import React, { useState } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import ThemeToggle from "../ui/ThemeToggle";
import {
  SquaresFour,
  ShoppingBag,
  Users,
  SignOut,
  ChartLineUp,
  List,
  X,
} from "phosphor-react";

const AdminLayout = () => {
  const dispatch = useDispatch();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
      isActive
        ? "bg-primary text-white shadow-lg shadow-blue-900/20"
        : "text-gray-400 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-gray-900 dark:bg-black dark:text-gray-100 transition-colors duration-300">
      {/* MOBILE OVERLAY (Backdrop) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white shadow-xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } dark:border-r dark:border-slate-800`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-800 px-6">
          <Link to="/" className="text-xl font-bold tracking-wide text-white">
            Online<span className="text-primary">Admin</span>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-2 p-4">
          <div className="mb-2 px-4 text-xs font-bold uppercase tracking-wider text-gray-500">
            Overview
          </div>
          <NavLink
            to="/admin"
            end
            className={navClass}
            onClick={() => setSidebarOpen(false)}
          >
            <SquaresFour size={20} /> Dashboard
          </NavLink>
          <NavLink
            to="/admin/products"
            className={navClass}
            onClick={() => setSidebarOpen(false)}
          >
            <ShoppingBag size={20} /> Products
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={navClass}
            onClick={() => setSidebarOpen(false)}
          >
            <ChartLineUp size={20} /> Orders
          </NavLink>
          <NavLink
            to="/admin/users"
            className={navClass}
            onClick={() => setSidebarOpen(false)}
          >
            <Users size={20} /> Customers
          </NavLink>
        </nav>

        <div className="absolute bottom-0 w-full border-t border-gray-800 p-4">
          <button
            onClick={() => dispatch(logoutUser())}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <SignOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-white px-4 shadow-sm lg:px-8 dark:bg-slate-900 dark:border-b dark:border-slate-800">
          <div className="flex items-center gap-3">
            {/* Hamburger Button (Mobile Only) */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
            >
              <List size={24} />
            </button>
            <h2 className="font-semibold text-gray-700">Admin Workspace</h2>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle /> {/* Added Toggle here too */}
            <span className="hidden text-sm font-medium text-gray-600 sm:block dark:text-gray-300">
              Super Admin
            </span>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold dark:bg-primary/20 dark:text-primary-light">
              A
            </div>
          </div>
        </header>
        {/* Page Content */}
        <div className="p-4 lg:p-8 overflow-x-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
