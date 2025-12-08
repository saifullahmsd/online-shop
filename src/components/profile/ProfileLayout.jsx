import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import { User, Package, SignOut } from "phosphor-react";

const ProfileLayout = () => {
  const dispatch = useDispatch();

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
      isActive
        ? "bg-primary text-white shadow-md"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-slate-700 dark:hover:text-white"
    }`;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">My Account</h1>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* LEFT: Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24 rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:bg-slate-800 dark:border-slate-700">
            <nav className="flex flex-col space-y-2">
              <NavLink end to="/profile" className={navLinkClass}>
                <User size={20} /> Personal Info
              </NavLink>

              <NavLink to="/profile/orders" className={navLinkClass}>
                <Package size={20} /> My Orders
              </NavLink>

              <div className="my-2 border-t border-gray-100 dark:border-slate-500"></div>

              <button
                onClick={() => dispatch(logoutUser())}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-slate-700"
              >
                <SignOut size={20} /> Logout
              </button>
            </nav>
          </div>
        </aside>

        {/* RIGHT: Content Area */}
        <div className="flex-1">
          {/* Outlet renders the child routes (Info or Orders) */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
