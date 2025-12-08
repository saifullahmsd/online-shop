import React from "react";
import { useGetAllOrdersQuery } from "../../api/dummyProductsApi";
import { Clock, CheckCircle, Package } from "phosphor-react";
import Skeleton from "../../components/shared/Skeleton";

const AdminOrders = () => {
  const { data: orders, isLoading } = useGetAllOrdersQuery();

  if (isLoading)
    return (
      <div className="p-8">
        <Skeleton className="h-96 w-full" />
      </div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        All Orders ({orders?.length})
      </h1>
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-gray-50 text-xs font-bold uppercase text-gray-500 dark:bg-slate-700/50">
            <tr>
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Items</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
            {orders?.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50 dark:hover:bg-slate-700/30"
              >
                <td className="px-6 py-4 font-mono text-xs">#{order.id}</td>
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-800 dark:text-white">
                    {order.userInfo?.name || "Guest"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.userInfo?.email}
                  </p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(order.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${
                      order.status === "Processing"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {order.status === "Processing" ? (
                      <Clock size={12} />
                    ) : (
                      <CheckCircle size={12} />
                    )}
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-gray-800 dark:text-gray-200">
                  ${order.totalAmount}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {order.products?.length} Items
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
