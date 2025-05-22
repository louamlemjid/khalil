// src/components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // Import useAuth hook
import {
  Home,         // For Dashboard Home
  ShoppingCart, // For Caisse
  Package,      // For Stock
  BarChart2,    // For Reports
  Users,        // For Clients
  UserCog,      // For Employees
  Settings,     // For Parameters
  LogOut,       // For Logout
} from 'lucide-react'; // Import Lucide icons

interface SidebarLinkProps {
  href: string;
  children: React.ReactNode;
  icon: React.ElementType; // Lucide icon component
  active: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ href, children, icon: Icon, active, onClick }) => (
  <Link
    href={href}
    className={`flex items-center py-2 px-4 rounded-lg transition-colors duration-200 group
      ${active
        ? 'bg-dark text-white shadow-md'
        : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
      }`
    }
    onClick={onClick}
  >
    <Icon size={20} className={`mr-3 ${active ? 'text-white' : 'text-brand-orange group-hover:text-brand-orange-dark dark:text-gray-400'}`} />
    <span className="font-medium">{children}</span>
  </Link>
);

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth(); // Get user and logout from context

  // Helper to check role permissions
  const hasRole = (roles: string[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-4 shadow-xl h-full flex flex-col border-r border-gray-200 dark:border-gray-700">
      <div className="text-2xl font-extrabold mb-8 text-brand-orange flex items-center justify-center">
        <ShoppingCart size={32} className="mr-2" /> POS Dashboard
      </div>

      <nav className="flex-grow space-y-2">
        <SidebarLink href="/dashboard" active={pathname === '/dashboard'} icon={Home}>
          Home
        </SidebarLink>

        {hasRole(['manager', 'caisse']) && (
          <SidebarLink href="/dashboard/caisse" active={pathname.startsWith('/dashboard/caisse')} icon={ShoppingCart}>
            Caisse
          </SidebarLink>
        )}

        {hasRole(['manager', 'stock_manager']) && (
          <SidebarLink href="/dashboard/stock" active={pathname === '/dashboard/stock'} icon={Package}>
            Stock
          </SidebarLink>
        )}

        {hasRole(['manager']) && (
          <SidebarLink href="/dashboard/reports" active={pathname === '/dashboard/reports'} icon={BarChart2}>
            Reports
          </SidebarLink>
        )}

        {hasRole(['manager', 'caisse']) && (
          <SidebarLink href="/dashboard/clients" active={pathname === '/dashboard/clients'} icon={Users}>
            Clients
          </SidebarLink>
        )}

        {hasRole(['manager']) && (
          <SidebarLink href="/dashboard/employees" active={pathname === '/dashboard/employees'} icon={UserCog}>
            Employees
          </SidebarLink>
        )}
      </nav>

      {/* Parameters and Logout */}
      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <SidebarLink href="/dashboard/parametres" active={pathname === '/dashboard/parameters'} icon={Settings}>
          Parameters
        </SidebarLink>
        <button
          onClick={logout} // Use the logout function from context
          className="w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 flex items-center"
        >
          <LogOut size={20} className="mr-3 text-red-500" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;