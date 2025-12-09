import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Products", "UserOrders"],
  endpoints: (builder) => ({
    getCategories: builder.query({
      async queryFn() {
        try {
          const productsRef = collection(db, "products");
          const snapshot = await getDocs(productsRef);

          const categories = new Set();
          snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.category) categories.add(data.category);
          });
          return { data: Array.from(categories) };
        } catch (error) {
          return { error: error.message };
        }
      },
    }),

    // 2. Get All Products
    getAllProducts: builder.query({
      async queryFn(params) {
        try {
          const {
            skip = 0,
            limit = 100,
            search,
            category,
            sortBy,
            order,
            minPrice,
            maxPrice,
            minRating,
          } = params || {};

          let q = collection(db, "products");

          // 1. Database Level Filtering
          if (category && category !== "all") {
            q = query(q, where("category", "==", category));
          }

          const snapshot = await getDocs(q);
          let products = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // 2. JS Level Filtering (Search, Price, Rating)

          products = products.filter((p) => {
            // Search
            if (search) {
              const lowerSearch = search.toLowerCase();
              const matchesSearch =
                p.title.toLowerCase().includes(lowerSearch) ||
                p.description.toLowerCase().includes(lowerSearch);
              if (!matchesSearch) return false;
            }

            // Price Range
            const price = parseFloat(p.price);
            if (minPrice && price < parseFloat(minPrice)) return false;
            if (maxPrice && price > parseFloat(maxPrice)) return false;

            // Rating
            if (minRating && p.rating < parseFloat(minRating)) return false;

            return true;
          });

          // 3. Sorting
          if (sortBy) {
            products.sort((a, b) => {
              if (order === "asc") return a[sortBy] > b[sortBy] ? 1 : -1;
              return a[sortBy] < b[sortBy] ? 1 : -1;
            });
          }

          // 4. Pagination Metadata
          const total = products.length;

          return {
            data: {
              products,
              total,
              skip,
              limit,
            },
          };
        } catch (error) {
          return { error: error.message };
        }
      },
      providesTags: ["Products"],
    }),

    getProductById: builder.query({
      async queryFn(id) {
        try {
          const docRef = doc(db, "products", id.toString());
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            return { data: { id: docSnap.id, ...docSnap.data() } };
          } else {
            return { error: "Product not found" };
          }
        } catch (error) {
          return { error: error.message };
        }
      },
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    // 4. Get User Orders
    getUserOrders: builder.query({
      async queryFn(userId) {
        try {
          if (!userId) return { data: [] };

          const ordersRef = collection(db, "orders");

          const q = query(ordersRef, where("userId", "==", userId));

          const snapshot = await getDocs(q);
          const orders = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          orders.sort((a, b) => new Date(b.date) - new Date(a.date));

          return { data: orders };
        } catch (error) {
          return { error: error.message };
        }
      },
      providesTags: ["UserOrders"],
    }),

    getAllOrders: builder.query({
      async queryFn() {
        try {
          const ordersRef = collection(db, "orders");
          const snapshot = await getDocs(ordersRef);
          const orders = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          orders.sort((a, b) => new Date(b.date) - new Date(a.date));
          return { data: orders };
        } catch (error) {
          return { error: error.message };
        }
      },
      providesTags: ["UserOrders"],
    }),

    getAllUsers: builder.query({
      async queryFn() {
        try {
          const usersRef = collection(db, "users");
          const snapshot = await getDocs(usersRef);
          const users = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          return { data: users };
        } catch (error) {
          return { error: error.message };
        }
      },
    }),

    createOrder: builder.mutation({
      async queryFn(orderData) {
        try {
          const docRef = await addDoc(collection(db, "orders"), {
            ...orderData,
            date: new Date().toISOString(),
            status: "Processing",
          });
          return { data: { id: docRef.id, ...orderData } };
        } catch (error) {
          return { error: error.message };
        }
      },
      invalidatesTags: ["UserOrders"],
    }),

    // 6. Add, Update, Delete Product Mutations
    addProduct: builder.mutation({
      async queryFn(newProduct) {
        try {
          const docRef = await addDoc(collection(db, "products"), {
            ...newProduct,
            createdAt: new Date().toISOString(),
          });
          return { data: { id: docRef.id, ...newProduct } };
        } catch (error) {
          return { error: error.message };
        }
      },
      invalidatesTags: ["Products"],
    }),

    updateProduct: builder.mutation({
      async queryFn({ id, ...updates }) {
        try {
          const docRef = doc(db, "products", id.toString());
          await updateDoc(docRef, updates);
          return { data: { id, ...updates } };
        } catch (error) {
          return { error: error.message };
        }
      },
      invalidatesTags: (result, error, { id }) => [
        "Products",
        { type: "Products", id },
      ],
    }),

    deleteProduct: builder.mutation({
      async queryFn(id) {
        try {
          const docRef = doc(db, "products", id.toString());
          await deleteDoc(docRef);
          return { data: "Deleted" };
        } catch (error) {
          return { error: error.message };
        }
      },
      invalidatesTags: ["Products"],
    }),

    addReview: builder.mutation({
      async queryFn({ productId, newReview }) {
        try {
          const { doc, updateDoc, arrayUnion } = await import(
            "firebase/firestore"
          );
          const productRef = doc(db, "products", productId.toString());

          await updateDoc(productRef, {
            reviews: arrayUnion(newReview),
          });

          return { data: "Review Added" };
        } catch (error) {
          return { error: error.message };
        }
      },
      invalidatesTags: (result, error, { productId }) => [
        { type: "Products", id: productId },
      ],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useGetUserOrdersQuery,
  useGetAllOrdersQuery,
  useGetAllUsersQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateOrderMutation,
  useAddReviewMutation,
} = productsApi;
