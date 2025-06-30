'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";
import { useTheme } from "@/hooks/use-theme";

import { CreditCard, DollarSign, Package, Users, TrendingUp } from "lucide-react";

const DashboardPage = () => {
  const { theme } = useTheme();
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/products/");
      setProducts(res.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  }


  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/users/getall");
      setUsers(res.data || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchUsers();
  }, []);

  const totalProducts = products.length;
  const totalSoldProducts = products.reduce((sum, p) => sum + (parseInt(p.sales) || 0), 0);
  const totalSales = products.reduce((sum, p) => sum + (parseFloat(p.price || 0) * (parseInt(p.sales) || 0)), 0);

  const overviewData = products.slice(0, 7).map((p, idx) => ({
    name: `P${idx + 1}`,
    total: parseFloat(p.price) || 0,
  }));

  return (
    <div className="flex flex-col gap-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={<Package size={26} />} title="Total Products" value={totalProducts} />
        <StatsCard icon={<DollarSign size={26} />} title="Total Number of Sold Products" value={totalSoldProducts} />
        <StatsCard icon={<Users size={26} />} title="Total Users" value={users.length} />
        <StatsCard icon={<CreditCard size={26} />} title="Sales" value={`TND ${totalSales.toFixed(2)}`} />
      </div>

      {/* Chart + Recent Sales */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
        {/* Overview Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 col-span-1 lg:col-span-4">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={overviewData}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip formatter={(value) => `TND ${value}`} />
              <XAxis dataKey="name" stroke={theme === "light" ? "#475569" : "#94a3b8"} />
              <YAxis stroke={theme === "light" ? "#475569" : "#94a3b8"} tickFormatter={(v) => `TND ${v}`} />
              <Area type="monotone" dataKey="total" stroke="#60a5fa" fill="url(#colorTotal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Sales */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 col-span-1 lg:col-span-3">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Recent Sales</h2>
          <div className="space-y-4">
            {products.slice(0, 5).map((product) => (
              <div key={product._id || product.name} className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{product.name}</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">TND {parseFloat(product.price).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    
    </div>
  );
};

const StatsCard = ({ icon, title, value }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-3 rounded-lg">
        {icon}
      </div>
      <div className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
        <TrendingUp size={16} />
        <span>20%</span>
      </div>
    </div>
    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
  </div>
);

export default DashboardPage;
