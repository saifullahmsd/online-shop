import React from "react";
import { useGetAllUsersQuery } from "../../api/productsApi";
import Skeleton from "../../components/shared/Skeleton";

const AdminUsers = () => {
  const { data: users, isLoading } = useGetAllUsersQuery();

  if (isLoading)
    return (
      <div className="p-8">
        <Skeleton className="h-96 w-full" />
      </div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Customers ({users?.length})
      </h1>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold uppercase text-gray-500 dark:bg-slate-700/50">
            <tr>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
            {users?.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 dark:hover:bg-slate-700/30"
              >
                <td className="px-6 py-4 flex items-center gap-3">
                  <img
                    src={user.image || "https://ui-avatars.com/api/?name=User"}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="font-bold text-gray-800 dark:text-white">
                    {user.firstName} {user.lastName}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-bold uppercase ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
