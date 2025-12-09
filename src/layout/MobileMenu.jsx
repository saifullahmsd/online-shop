import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { X, MagnifyingGlass } from "phosphor-react";

// Helper component for mobile nav links
const MobileNavLink = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `block px-4 py-3 text-lg font-medium ${
        isActive ? "text-primary" : "text-text"
      }`
    }
  >
    {children}
  </NavLink>
);

const MobileMenu = ({ isOpen, setIsOpen }) => {
  const [mobileSearch, setMobileSearch] = useState("");
  const navigate = useNavigate();

  const handleMobileSearch = (e) => {
    e.preventDefault();
    if (mobileSearch.trim()) {
      setIsOpen(false);
      navigate(`/products?search=${mobileSearch}`);
    }
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* 2. Side Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 transform bg-card shadow-xl transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between border-b border-background p-4">
          <h2 className="text-xl font-bold text-text">Menu</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-1 text-text-muted hover:bg-background"
          >
            <X size={24} />
          </button>
        </div>

        {/* mobile search bar  */}
        <div className="p-4 pb-0">
          <form onSubmit={handleMobileSearch} className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={mobileSearch}
              onChange={(e) => setMobileSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 focus:border-primary focus:outline-none"
            />
            <MagnifyingGlass
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
          </form>
        </div>

        {/* Menu Links */}
        <nav className="flex flex-col p-4">
          <MobileNavLink to="/" onClick={() => setIsOpen(false)}>
            Home
          </MobileNavLink>
          <MobileNavLink to="/products" onClick={() => setIsOpen(false)}>
            Products
          </MobileNavLink>
          <MobileNavLink to="/categories" onClick={() => setIsOpen(false)}>
            Categories
          </MobileNavLink>
          <MobileNavLink to="/cart" onClick={() => setIsOpen(false)}>
            Cart
          </MobileNavLink>
          <MobileNavLink to="/login" onClick={() => setIsOpen(false)}>
            Login
          </MobileNavLink>
        </nav>
      </div>
    </>
  );
};

export default MobileMenu;
