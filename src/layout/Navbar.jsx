import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ShoppingCart,
  User,
  MagnifyingGlass,
  List,
  X,
  Heart,
  SignOut,
  Package,
  SquaresFour,
} from "phosphor-react";
import { useGetAllProductsQuery } from "../api/productsApi";
import SearchSuggestions from "../components/ui/SearchSuggestions";
import MobileMenu from "./MobileMenu";
import { openCart } from "../features/cart/cartSlice";

import ThemeToggle from "../components/ui/ThemeToggle";
import BrandLogo from "../components/ui/BrandLogo";
import useAuth from "../hooks/useAuth";
import useDebounce from "../hooks/useDebounce";
import { DEBOUNCE } from "../utils/constants";

const StyledNavLink = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `relative font-medium transition-colors ${isActive
        ? "text-primary"
        : "text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-white"
      } after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:origin-center after:scale-x-0 after:bg-primary after:transition-transform ${isActive ? "after:scale-x-100" : "hover:after:scale-x-100"
      }`
    }
  >
    {children}
  </NavLink>
);

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { items = [], totalQuantity } = useSelector(
    (state) => state.cart || {}
  );
  const { user, isAuthenticated, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const urlSearchQuery = searchParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(urlSearchQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (searchTerm !== urlSearchQuery) {
      setSearchTerm(urlSearchQuery);
    }
  }, [urlSearchQuery]);

  const debouncedTerm = useDebounce(searchTerm, DEBOUNCE.SEARCH);

  const shouldFetch = debouncedTerm.length > 2;
  const { data, isLoading } = useGetAllProductsQuery(
    { search: debouncedTerm, limit: 5 },
    {
      skip: !shouldFetch,
      refetchOnMountOrArgChange: 30,
    }
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowSuggestions(false);
      navigate(`/products?search=${searchTerm}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/90 border-b border-gray-100 shadow-sm backdrop-blur-md dark:bg-slate-900/90 dark:border-slate-800 transition-colors duration-300">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link
            to="/"
            className="flex items-center gap-1 text-primary transition-opacity hover:opacity-80"
            aria-label="OnlineShop Home"
          >
            <BrandLogo className="h-8 w-8 md:h-9 md:w-9" />

            <span className="hidden text-xl font-extrabold tracking-tight md:block lg:text-2xl">
              OnlineShop
            </span>
          </Link>

          <div className="hidden items-center space-x-6 md:flex">
            <StyledNavLink to="/">Home</StyledNavLink>
            <StyledNavLink to="/products">Products</StyledNavLink>
            <StyledNavLink to="/categories">Categories</StyledNavLink>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden lg:block" ref={searchRef}>
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-64 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-800 transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:bg-slate-800"
                />
                <MagnifyingGlass
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setShowSuggestions(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  >
                    <X size={16} />
                  </button>
                )}
              </form>

              {showSuggestions && debouncedTerm.length > 2 && (
                <SearchSuggestions
                  suggestions={data?.products}
                  isLoading={isLoading}
                  searchTerm={searchTerm}
                  closeSearch={() => setShowSuggestions(false)}
                />
              )}
            </div>

            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="hidden rounded-full p-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-red-500 dark:text-gray-300 dark:hover:bg-slate-800 sm:block"
            >
              <Heart size={24} />
            </Link>

            <button
              onClick={() => dispatch(openCart())}
              aria-label={`Open Cart, ${totalQuantity} items`}
              className="relative rounded-full p-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-primary dark:text-gray-300 dark:hover:bg-slate-800"
            >
              <ShoppingCart size={24} />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-slate-900">
                  {totalQuantity}
                </span>
              )}
            </button>

            <ThemeToggle />

            {isAuthenticated ? (
              <div className="group relative z-50">
                <button
                  aria-label="User Menu"
                  className="flex items-center gap-2 rounded-full p-1 transition-all hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  <img
                    src={user.image}
                    alt="User"
                    className="h-8 w-8 rounded-full border border-gray-200 object-cover dark:border-slate-700"
                  />
                  <span className="hidden text-sm font-semibold text-gray-700 dark:text-gray-200 md:block">
                    {user.firstName}
                  </span>
                </button>

                <div className="invisible absolute right-0 top-full z-50 mt-2 w-48 translate-y-2 rounded-xl border border-gray-100 bg-white opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 dark:bg-slate-800 dark:border-slate-700">
                  <div className="bg-gray-50 p-4 border-b border-gray-100 rounded-t-xl dark:bg-slate-700/50 dark:border-slate-700">
                    <p className="font-bold text-gray-800 dark:text-white">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>

                  <div className="p-1">
                    {user?.role === "admin" && (
                      <Link
                        to="/admin"
                        className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <SquaresFour size={18} weight="fill" /> Dashboard
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary dark:text-gray-300 dark:hover:bg-slate-700"
                    >
                      <User size={18} /> My Profile
                    </Link>
                    <Link
                      to="/profile/orders"
                      className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary dark:text-gray-300 dark:hover:bg-slate-700"
                    >
                      <Package size={18} /> My Orders
                    </Link>
                  </div>

                  <div className="border-t border-gray-100 p-1 dark:border-slate-700">
                    <button
                      onClick={logout}
                      className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <SignOut size={18} /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                aria-label="Login"
                className="rounded-full p-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-primary dark:text-gray-300 dark:hover:bg-slate-800"
              >
                <User size={24} />
              </Link>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Menu"
              className="rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800 md:hidden"
            >
              <List size={24} />
            </button>
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
    </>
  );
};

export default Navbar;
