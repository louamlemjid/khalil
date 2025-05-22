// src/app/dashboard/(clients)/page.tsx
'use client';

import AuthGuard from '@/components/AuthGuard';
import { Role } from '@/lib/types';
import { UserPlus, Users, Search, DollarSign, Award } from 'lucide-react'; // Lucide icons

export default function ClientsPageWrapper() {
  const allowedRoles: Role[] = ['manager', 'caisse'];
  return (
    <AuthGuard allowedRoles={allowedRoles}>
      <ClientsPageContent />
    </AuthGuard>
  );
}

function ClientsPageContent() {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md h-full flex flex-col">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6 flex items-center">
        <Users size={36} className="mr-3 text-brand-orange" /> Client Management
      </h1>
      <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
        Manage your customer database. View client details, add new customers, and track loyalty programs.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow">
        {/* View All Clients Card */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
          <Users size={48} className="text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">View All Clients</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">Access the complete list of your registered clients and their details.</p>
          <button className="mt-auto px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center">
            <Users size={20} className="mr-2" /> View Clients List
          </button>
        </div>

        {/* Add New Client Card */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
          <UserPlus size={48} className="text-brand-orange mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Register New Client</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">Add new customers to your database with their contact information.</p>
          <button className="mt-auto px-6 py-3 bg-brand-orange text-white rounded-lg shadow-md hover:bg-brand-orange-dark transition-colors flex items-center justify-center">
            <UserPlus size={20} className="mr-2" /> Add New Client
          </button>
        </div>

        {/* Client Search & Quick Access Card */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <div className="flex items-center mb-4">
            <Search size={28} className="text-purple-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Find Client</h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4">Quickly search for clients by name, email, or phone number.</p>
          <div className="relative mb-4 flex-grow">
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-brand-orange focus:border-brand-orange"
            />
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button className="mt-auto px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex items-center justify-center">
            <Search size={20} className="mr-2" /> Perform Search
          </button>
        </div>

        {/* Loyalty Program Card (New) */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
          <Award size={48} className="text-green-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Loyalty Program</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">Manage customer loyalty points, rewards, and exclusive offers.</p>
          <button className="mt-auto px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors flex items-center justify-center">
            <Award size={20} className="mr-2" /> Manage Loyalty
          </button>
        </div>

        {/* Purchase History Card (New) */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
          <DollarSign size={48} className="text-indigo-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Purchase History</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">Review individual client purchase history and spending patterns.</p>
          <button className="mt-auto px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center justify-center">
            <DollarSign size={20} className="mr-2" /> View History
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