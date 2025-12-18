import React from "react";
import { CurrencyDollar, ShoppingCart, Users, TrendUp } from "phosphor-react";

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:bg-slate-800 dark:border-slate-700">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </p>
        <h3 className="mt-2 text-3xl font-bold text-gray-800 dark:text-white">
          {value}
        </h3>
      </div>
      <div className={`rounded-full p-3 ${color} text-white shadow-lg`}>
        <Icon size={24} weight="fill" />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2 text-sm">
      <span className="flex items-center font-medium text-green-500">
        <TrendUp className="mr-1" /> {trend}
      </span>
      <span className="text-gray-400 dark:text-gray-500">vs last month</span>
    </div>
  </div>
);

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="$48,294"
          icon={CurrencyDollar}
          color="bg-primary"
          trend="+12.5%"
        />
        <StatCard
          title="Total Orders"
          value="1,240"
          icon={ShoppingCart}
          color="bg-purple-500"
          trend="+8.2%"
        />
        <StatCard
          title="Active Customers"
          value="342"
          icon={Users}
          color="bg-orange-500"
          trend="+5.1%"
        />
        <StatCard
          title="Growth Rate"
          value="24.5%"
          icon={TrendUp}
          color="bg-green-500"
          trend="+2.4%"
        />
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <h3 className="mb-4 text-lg font-bold text-gray-800 dark:text-white">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 dark:border-slate-700"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-slate-700" />
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    New order #100{i} placed
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    2 minutes ago
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                $120.00
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
