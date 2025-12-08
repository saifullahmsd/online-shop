import React, { Suspense, lazy, useEffect } from "react";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { fetchCartFromCloud, syncCartToCloud } from "./features/cart/cartSlice";
import { fetchWishlistFromCloud } from "./features/wishlist/wishlistSlice";
import ScrollToTop from "./components/shared/ScrollToTop";
import ErrorBoundary from "./components/shared/ErrorBoundary";
import OfflineBanner from "./components/ui/OfflineBanner";
import MainLayout from "./layout/MainLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Import Loading Spinner for Suspense
import { CircleNotch } from "phosphor-react";

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

// admin pages
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

  useEffect(() => {
    if (user) {
      dispatch(fetchCartFromCloud());
      dispatch(fetchWishlistFromCloud());
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (user) {
      const saveTimer = setTimeout(() => {
        dispatch(syncCartToCloud());
      }, 1000);
      return () => clearTimeout(saveTimer);
    }
  }, [items, user, dispatch]);

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
      {/* Wrap Routes in Suspense */}
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

            {/* protected route  */}
            <Route element={<ProtectedRoute />}>
              <Route path="checkout" element={<Checkout />} />
              <Route path="order-success" element={<OrderSuccess />} />

              {/* profile route  */}
              <Route path="profile" element={<ProfileLayout />}>
                <Route index element={<UserProfile />} />
                <Route path="orders" element={<UserOrders />} />
              </Route>
            </Route>

            {/* admin route  */}
            <Route element={<AdminRoute />}>
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/add" element={<AdminProductForm />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<AdminUsers />} />
                <Route
                  path="products/edit/:id"
                  element={<AdminProductForm />}
                />
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
