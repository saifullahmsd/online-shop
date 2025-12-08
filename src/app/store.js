import { configureStore } from "@reduxjs/toolkit";
import { dummyProductsApi } from "../api/dummyProductsApi";

import cartReducer from "../features/cart/cartSlice";

import wishlistReducer from "../features/wishlist/wishlistSlice";
import authReducer from "../features/auth/authSlice";
import themeReducer from "../features/theme/themeSlice";

export const store = configureStore({
  reducer: {
    [dummyProductsApi.reducerPath]: dummyProductsApi.reducer,
    cart: cartReducer,

    wishlist: wishlistReducer,
    auth: authReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(dummyProductsApi.middleware),
});
