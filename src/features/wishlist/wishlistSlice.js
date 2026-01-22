import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";


export const toggleWishlistCloud = createAsyncThunk(
  "wishlist/toggleCloud",
  async (product, { getState, rejectWithValue }) => {
    const { user } = getState().auth;
    const { items } = getState().wishlist;

    if (!user) return;

    const userRef = doc(db, "users", user.id);
    const isInWishlist = items.some((item) => item.id === product.id);

    try {
      if (isInWishlist) {
        await updateDoc(userRef, {
          wishlist: arrayRemove(product),
        });
        return { action: "remove", product };
      } else {
        await setDoc(
          userRef,
          {
            wishlist: arrayUnion(product),
          },
          { merge: true }
        );
        return { action: "add", product };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const fetchWishlistFromCloud = createAsyncThunk(
  "wishlist/fetch",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user) return [];

      const userRef = doc(db, "users", user.id);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists() && docSnap.data().wishlist) {
        return docSnap.data().wishlist;
      }
      return [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: JSON.parse(localStorage.getItem("wishlist") || "[]"),
  },
  reducers: {
    toggleWishlistLocal: (state, action) => {
      const product = action.payload;
      const index = state.items.findIndex((item) => item.id === product.id);

      if (index >= 0) {
        state.items.splice(index, 1);
        toast.success(`${product.title} removed from wishlist`);
      } else {
        state.items.push(product);
        toast.success(`${product.title} added to wishlist`);
      }
      localStorage.setItem("wishlist", JSON.stringify(state.items));
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem("wishlist");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWishlistFromCloud.fulfilled, (state, action) => {
      state.items = action.payload;
      localStorage.setItem("wishlist", JSON.stringify(state.items));
    });
  },
});

export const { toggleWishlistLocal, clearWishlist } = wishlistSlice.actions;

export const toggleWishlist = (product) => (dispatch, getState) => {
  const { user } = getState().auth;

  dispatch(toggleWishlistLocal(product));

  if (user) {
    dispatch(toggleWishlistCloud(product));
  }
};

export default wishlistSlice.reducer;
