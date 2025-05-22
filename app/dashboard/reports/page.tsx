// src/app/dashboard/(reports)/page.tsx
'use client';

import AuthGuard from '@/components/AuthGuard';
import { Role } from '@/lib/types';
import { LineChart, BarChart, TrendingUp, DollarSign, Users, Package, Clock } from 'lucide-react'; // Lucide icons

export default function ReportsPageWrapper() {
  const allowedRoles: Role[] = ['manager'];
  return (
    <AuthGuard allowedRoles={allowedRoles}>
      <ReportsPageContent />
    </AuthGuard>
  );
}

function ReportsPageContent() {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md h-full flex flex-col">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6 flex items-center">
        <BarChart size={36} className="mr-3 text-brand-orange" /> Sales Reports & Analytics
      </h1>
      <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
        Gain valuable insights into your sales performance, inventory trends, and customer behavior with comprehensive reports.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow overflow-y-auto pr-2 -mr-2 custom-scrollbar">
        {/* Daily Sales Overview */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <div className="flex items-center mb-4">
            <LineChart size={28} className="text-blue-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Daily Sales Trend</h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">Visualize revenue changes over the last 30 days.</p>
          <div className="h-48 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm italic">
            [Interactive Line Chart Placeholder]
          </div>
          <button className="mt-6 px-5 py-2 bg-brand-orange text-white rounded-lg hover:bg-brand-orange-dark transition-colors">
            View Detailed Daily Report
          </button>
        </div>

        {/* Top Selling Products */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <div className="flex items-center mb-4">
            <TrendingUp size={28} className="text-green-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Top Products</h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">Discover which products are driving the most sales.</p>
          <div className="h-48 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm italic">
            [Product Bar Chart / List Placeholder]
          </div>
          <button className="mt-6 px-5 py-2 bg-brand-orange text-white rounded-lg hover:bg-brand-orange-dark transition-colors">
            Analyze Product Performance
          </button>
        </div>

        {/* Revenue by Category */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <div className="flex items-center mb-4">
            <DollarSign size={28} className="text-purple-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Revenue by Category</h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">Breakdown of sales by product category.</p>
          <div className="h-48 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm italic">
            [Pie Chart / Bar Chart Placeholder]
          </div>
          <button className="mt-6 px-5 py-2 bg-brand-orange text-white rounded-lg hover:bg-brand-orange-dark transition-colors">
            Explore Category Insights
          </button>
        </div>

        {/* Customer Traffic / Transactions */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <div className="flex items-center mb-4">
            <Users size={28} className="text-yellow-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Customer Activity</h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">Monitor transaction count and customer frequency.</p>
          <div className="h-48 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm italic">
            [Traffic / Transaction Chart Placeholder]
          </div>
          <button className="mt-6 px-5 py-2 bg-brand-orange text-white rounded-lg hover:bg-brand-orange-dark transition-colors">
            View Customer Metrics
          </button>
        </div>

        {/* Inventory Value & Turn over */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <div className="flex items-center mb-4">
            <Package size={28} className="text-red-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Inventory Snapshot</h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">Current inventory value and stock turnover rate.</p>
          <div className="h-48 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm italic">
            [Inventory Metrics Placeholder]
          </div>
          <button className="mt-6 px-5 py-2 bg-brand-orange text-white rounded-lg hover:bg-brand-orange-dark transition-colors">
            Manage Inventory Reports
          </button>
        </div>

        {/* Employee Performance (Optional, if tracked) */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <div className="flex items-center mb-4">
            <Clock size={28} className="text-indigo-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Employee Performance</h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">Track sales generated by individual employees.</p>
          <div className="h-48 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm italic">
            [Employee Sales Data Placeholder]
          </div>
          <button className="mt-6 px-5 py-2 bg-brand-orange text-white rounded-lg hover:bg-brand-orange-dark transition-colors">
            View Staff Metrics
          </button>
        </div>
      </div>

      {/* Custom Scrollbar Styles (re-used) */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        /* Dark mode scrollbar */
        .dark .custom-scrollbar::-webkit-scrollbar-track {
          background: #333;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #666;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #888;
        }
      `}</style>
    </div>
  );
}