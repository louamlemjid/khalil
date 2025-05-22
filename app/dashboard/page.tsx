// src/app/dashboard/page.tsx
'use client'; // This component will be rendered inside a client layout

// No AuthGuard directly needed here because dashboard/layout.tsx already handles
// general authentication check. Specific page content within the dashboard
// can use useAuth() for conditional rendering or AuthGuard for redirection.
export default function DashboardHomePage() {
  // You can use useAuth() here if you need to display user-specific info
  // const { user } = useAuth();
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Welcome to your Dashboard!</h1>
      <p className="text-gray-700 dark:text-gray-300">
        Select a section from the sidebar to get started.
      </p>
    </div>
  );
}