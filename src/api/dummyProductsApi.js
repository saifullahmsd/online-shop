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

export const dummyProductsApi = createApi({
  reducerPath: "dummyProductsApi",
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

    getAllProducts: builder.query({
      async queryFn(params) {
        try {
          const {
            skip = 0,
            limit = 12,
            search,
            category,
            sortBy,
            order,
          } = params || {};

          let q = collection(db, "products");

          if (category && category !== "all") {
            q = query(q, where("category", "==", category));
          }

          const snapshot = await getDocs(q);
          let products = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          if (search) {
            const lowerSearch = search.toLowerCase();
            products = products.filter(
              (p) =>
                p.title.toLowerCase().includes(lowerSearch) ||
                p.description.toLowerCase().includes(lowerSearch)
            );
          }

          if (sortBy) {
            products.sort((a, b) => {
              if (order === "asc") return a[sortBy] > b[sortBy] ? 1 : -1;
              return a[sortBy] < b[sortBy] ? 1 : -1;
            });
          }

          const total = products.length;
          const paginatedProducts = products.slice(skip, skip + limit);

          return {
            data: {
              products: paginatedProducts,
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
} = dummyProductsApi;
