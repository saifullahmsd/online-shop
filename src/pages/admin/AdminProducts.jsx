import React from "react";
import {
  useGetAllProductsQuery,
  useDeleteProductMutation,
} from "../../api/productsApi";
import { PencilSimple, Trash, Plus } from "phosphor-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Skeleton from "../../components/shared/Skeleton";

const AdminProducts = () => {
  const { data, isLoading } = useGetAllProductsQuery({ limit: 100 });
  const [deleteProduct] = useDeleteProductMutation();
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id).unwrap();
        toast.success(`Product deleted`);
      } catch (err) {
        toast.error("Failed to delete");
      }
    }
  };

  if (isLoading)
    return (
      <div className="p-8">
        <Skeleton className="h-96 w-full" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Products
        </h1>
        <button
          onClick={() => navigate("/admin/products/add")}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-bold text-white transition hover:bg-blue-700"
        >
          <Plus weight="bold" /> Add Product
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-gray-50 text-xs font-bold uppercase text-gray-500 dark:bg-slate-700/50 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
            {data?.products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-50 dark:hover:bg-slate-700/30"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.thumbnail}
                      alt=""
                      className="h-10 w-10 rounded border object-contain bg-white dark:border-slate-600"
                    />
                    <span className="font-medium text-gray-800 line-clamp-1 max-w-xs dark:text-gray-200">
                      {product.title}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm capitalize text-gray-600 dark:text-gray-400">
                  {product.category}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gray-800 dark:text-gray-200">
                  ${product.price}
                </td>
                <td className="px-6 py-4 text-sm">
                  {product.stock > 10 ? (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      {product.stock} In Stock
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                      Low Stock
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      to={`/admin/products/edit/${product.id}`}
                      className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-primary dark:text-gray-400 dark:hover:bg-slate-700"
                    >
                      <PencilSimple size={20} />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="rounded p-2 text-gray-500 hover:bg-red-50 hover:text-red-500 dark:text-gray-400 dark:hover:bg-red-900/20"
                    >
                      <Trash size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
