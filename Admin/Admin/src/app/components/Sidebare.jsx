'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  PlusCircle, 
  ClipboardList
} from 'lucide-react';

const Sidebar = ({ collapsed }) => {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;

  return (
    <div className={`h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ${
      collapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Logo */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Link href="/" className="flex items-center">
          {!collapsed && <span className="text-xl font-bold text-gray-800 dark:text-white">Clothes</span>}
          {collapsed && <span className="text-xl font-bold text-gray-800 dark:text-white">C</span>}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Dashboard
            </p>
          )}
          <Link
            href="/dashbord"
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
              isActive('/dashbord')
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <LayoutDashboard className="h-5 w-5 mr-3" />
            {!collapsed && 'Dashboard'}
          </Link>
        </div>

        <div className="mt-8 space-y-1">
          {!collapsed && (
            <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Customers
            </p>
          )}
          <Link
            href="/users"
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
              isActive('/users')
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <Users className="h-5 w-5 mr-3" />
            {!collapsed && 'Customers'}
          </Link>
        </div>

        <div className="mt-8 space-y-1">
          {!collapsed && (
            <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Products
            </p>
          )}
          <Link
            href="/products"
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
              isActive('/products')
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <Package className="h-5 w-5 mr-3" />
            {!collapsed && 'Products'}
          </Link>
          <Link
            href="/addproduct"
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
              isActive('/addproduct')
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <PlusCircle className="h-5 w-5 mr-3" />
            {!collapsed && 'New product'}
          </Link>
          <Link
            href="/inventory"
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
              isActive('/inventory')
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <ClipboardList className="h-5 w-5 mr-3" />
            {!collapsed && 'Inventory'}
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
