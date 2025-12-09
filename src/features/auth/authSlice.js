import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth, db } from "../../firebase/firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

// REGISTER USER
export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ email, password, firstName, lastName }, { rejectWithValue }) => {
    try {
      // Create User in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 2. Update "Display Name"
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });

      // 3. Save Extra Info
      const userData = {
        id: user.uid,
        firstName,
        lastName,
        email,
        role: "customer",
        createdAt: new Date().toISOString(),
        image: "https://ui-avatars.com/api/?name=" + firstName + "+" + lastName,
      };

      await setDoc(doc(db, "users", user.uid), userData);

      return userData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// LOGIN USER
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return {
          id: user.uid,
          email: user.email,
          firstName: user.displayName?.split(" ")[0] || "User",
          lastName: user.displayName?.split(" ")[1] || "",
          role: "customer",
          image: user.photoURL || null,
        };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// UPDATE USER PROFILE
export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async (updates, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user) return rejectWithValue("No user logged in");

      const userRef = doc(db, "users", user.id);
      await setDoc(userRef, updates, { merge: true });

      return { ...user, ...updates };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await signOut(auth);
});

// --- 2. SLICE ---
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE PROFILE
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
