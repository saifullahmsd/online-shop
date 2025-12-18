import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

// --- HELPERS ---
const calculateTotals = (items) => {
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  return {
    totalQuantity,
    totalAmount: parseFloat(totalAmount.toFixed(2)),
  };
};

//  THUNKS (Database Actions)

// Save Cart to Cloud
export const syncCartToCloud = createAsyncThunk(
  "cart/sync",
  async (_, { getState }) => {
    const { user } = getState().auth;
    const { items } = getState().cart;

    // Only save if user is logged in
    if (user && user.id) {
      const userRef = doc(db, "users", user.id);

      await setDoc(userRef, { cart: items }, { merge: true });
    }
  }
);

// Load Cart from Cloud
export const fetchCartFromCloud = createAsyncThunk(
  "cart/fetch",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user) return [];

      const userRef = doc(db, "users", user.id);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists() && docSnap.data().cart) {
        return docSnap.data().cart;
      }
      return [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// --- SLICE ---
const initialState = {
  items: JSON.parse(localStorage.getItem("cart") || "[]"),
  ...calculateTotals(JSON.parse(localStorage.getItem("cart") || "[]")),
  isCartOpen: false,
  status: "idle",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    openCart: (state) => {
      state.isCartOpen = true;
    },
    closeCart: (state) => {
      state.isCartOpen = false;
    },

    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      if (existingItem) {
        existingItem.quantity += newItem.quantityToAdd || 1;
        toast.success(`Updated ${newItem.title} quantity`);
      } else {
        state.items.push({
          id: newItem.id,
          title: newItem.title,
          price: newItem.price,
          image: newItem.thumbnail,
          quantity: newItem.quantityToAdd || 1,
          stock: newItem.stock || 100,
        });
        toast.success(`${newItem.title} added to cart`);
      }

      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalAmount = totals.totalAmount;
      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalAmount = totals.totalAmount;
      localStorage.setItem("cart", JSON.stringify(state.items));
      toast.error("Item removed");
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        item.quantity++;
        const totals = calculateTotals(state.items);
        state.totalQuantity = totals.totalQuantity;
        state.totalAmount = totals.totalAmount;
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity--;
        } else {
          state.items = state.items.filter((i) => i.id !== action.payload);
        }
        const totals = calculateTotals(state.items);
        state.totalQuantity = totals.totalQuantity;
        state.totalAmount = totals.totalAmount;
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchCartFromCloud.pending, (state) => {
        state.status = "loading";
      })

      .addCase(fetchCartFromCloud.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload && action.payload.length > 0) {
          state.items = action.payload;

          const totals = calculateTotals(state.items);
          state.totalQuantity = totals.totalQuantity;
          state.totalAmount = totals.totalAmount;

          localStorage.setItem("cart", JSON.stringify(state.items));
        }
      })

      .addCase(fetchCartFromCloud.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const {
  toggleCart,
  openCart,
  closeCart,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
