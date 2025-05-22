// src/app/dashboard/(employees)/page.tsx
'use client';

import AuthGuard from '@/components/AuthGuard';
import { Role } from '@/lib/types';
import { UserPlus, Users, Edit, Trash2, Search, Settings,Pen } from 'lucide-react'; // Lucide icons

export default function EmployeesPageWrapper() {
  const allowedRoles: Role[] = ['manager'];
  return (
    <AuthGuard allowedRoles={allowedRoles}>
      <EmployeesPageContent />
    </AuthGuard>
  );
}

function EmployeesPageContent() {
  // Dummy employee data for demonstration
  const dummyEmployees = [
    { id: 'emp1', name: 'Alice Johnson', role: 'manager', email: 'alice@example.com', status: 'Active' },
    { id: 'emp2', name: 'Bob Williams', role: 'caisse', email: 'bob@example.com', status: 'Active' },
    { id: 'emp3', name: 'Charlie Brown', role: 'stock_manager', email: 'charlie@example.com', status: 'Active' },
    { id: 'emp4', name: 'Diana Prince', role: 'caisse', email: 'diana@example.com', status: 'Inactive' },
  ];

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md h-full flex flex-col">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6 flex items-center">
        <Users size={36} className="mr-3 text-brand-orange" /> Employee Management
      </h1>
      <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
        Efficiently manage your team. Add new employees, update details, assign roles, and control access permissions.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
        {/* Add New Employee Card */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
          <UserPlus size={48} className="text-brand-orange mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Register New Employee</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">Create new accounts and set initial roles for your staff members.</p>
          <button className="mt-auto px-6 py-3 bg-brand-orange text-white rounded-lg shadow-md hover:bg-brand-orange-dark transition-colors flex items-center justify-center">
            <UserPlus size={20} className="mr-2" /> Add Employee
          </button>
        </div>

        {/* View & Manage Employees Card */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
          <Users size={48} className="text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">View & Manage All Employees</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">Access the full list of employees, edit their profiles, or deactivate accounts.</p>
          <button className="mt-auto px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center">
            <Users size={20} className="mr-2" /> View Employees
          </button>
        </div>

        {/* Employee Search & Filter (New Card) */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <div className="flex items-center mb-4">
            <Search size={28} className="text-purple-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Find Employee</h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4">Quickly locate employees by name or role.</p>
          <div className="relative mb-4 flex-grow">
            <input
              type="text"
              placeholder="Search employee by name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-brand-orange focus:border-brand-orange"
            />
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          {/* Example of a quick employee list or search results */}
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {dummyEmployees.slice(0, 2).map(emp => (
              <p key={emp.id} className="flex justify-between items-center py-1">
                <span>{emp.name} ({emp.role})</span>
                <span className={`text-xs font-semibold ${emp.status === 'Active' ? 'text-green-500' : 'text-red-500'}`}>{emp.status}</span>
              </p>
            ))}
          </div>
        </div>

         {/* Access Control / Permissions (New Card) */}
         <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
          <Settings size={48} className="text-green-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Manage Permissions</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">Adjust roles and access levels for specific employee accounts.</p>
          <button className="mt-auto px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors flex items-center justify-center">
            <Pen size={20} className="mr-2" /> Update Permissions
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