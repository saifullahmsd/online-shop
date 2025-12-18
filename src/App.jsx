import React, { Suspense, lazy, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { fetchCartFromCloud, syncCartToCloud } from "./features/cart/cartSlice";
import { fetchWishlistFromCloud } from "./features/wishlist/wishlistSlice";
import ScrollToTop from "./components/shared/ScrollToTop";
import ErrorBoundary from "./components/shared/ErrorBoundary";
import OfflineBanner from "./components/ui/OfflineBanner";
import MainLayout from "./layout/MainLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { CircleNotch } from "phosphor-react";
import useDebounce from "./hooks/useDebounce";
import { DEBOUNCE } from "./utils/constants";

// LAZY LOAD PAGES
const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Categories = lazy(() => import("./pages/Categories"));
const Cart = lazy(() => import("./pages/Cart"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Contact = lazy(() => import("./pages/Contact"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Profile Pages
const ProfileLayout = lazy(() => import("./components/profile/ProfileLayout"));
const UserProfile = lazy(() => import("./pages/profile/UserProfile"));
const UserOrders = lazy(() => import("./pages/profile/UserOrders"));

// Admin Pages
const AdminRoute = lazy(() => import("./components/auth/AdminRoute"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminProductForm = lazy(() =>
  import("./components/admin/AdminProductForm")
);

const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <CircleNotch size={48} className="animate-spin text-primary" />
  </div>
);

const App = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  // Initial Load: Fetch Cloud Data on Login
  useEffect(() => {
    if (user) {
      dispatch(fetchCartFromCloud());
      dispatch(fetchWishlistFromCloud());
    }
  }, [user, dispatch]);
  const debouncedItems = useDebounce(items, DEBOUNCE.CART_SYNC);

  useEffect(() => {
    if (!user) return;

    dispatch(syncCartToCloud());
  }, [debouncedItems, user, dispatch]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (items.length > 0) dispatch(syncCartToCloud());
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [items, dispatch]);

  //  Theme Handler
  useEffect(() => {
    const root = window.document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [mode]);

  return (
    <ErrorBoundary>
      <OfflineBanner />
      <ScrollToTop />
      <Toaster position="bottom-right" />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="categories" element={<Categories />} />
            <Route path="cart" element={<Cart />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="checkout" element={<Checkout />} />
              <Route path="order-success" element={<OrderSuccess />} />
              <Route path="profile" element={<ProfileLayout />}>
                <Route index element={<UserProfile />} />
                <Route path="orders" element={<UserOrders />} />
              </Route>
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/add" element={<AdminProductForm />} />
                <Route
                  path="products/edit/:id"
                  element={<AdminProductForm />}
                />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
