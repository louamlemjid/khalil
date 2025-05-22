// src/app/dashboard/(parameters)/page.tsx
'use client';

import { useState } from 'react';
import { Key, Mail, CreditCard, Settings, UserCircle, AlertCircle, CheckCircle } from 'lucide-react'; // Import Lucide icons

export default function ParametersPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('Active'); // Example status

  const [passwordChangeMessage, setPasswordChangeMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [emailChangeMessage, setEmailChangeMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordChangeMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }
    if (newPassword.length < 6) { // Basic validation
      setPasswordChangeMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    // Simulate API call
    console.log('Attempting to change password:', { currentPassword, newPassword });
    try {
      // await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      // const response = await fetch('/api/change-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ currentPassword, newPassword }),
      // });
      // if (response.ok) {
      //   setPasswordChangeMessage({ type: 'success', text: 'Password updated successfully!' });
      //   setCurrentPassword('');
      //   setNewPassword('');
      //   setConfirmPassword('');
      // } else {
      //   const errorData = await response.json();
      //   setPasswordChangeMessage({ type: 'error', text: errorData.message || 'Failed to update password.' });
      // }
      setPasswordChangeMessage({ type: 'success', text: 'Password updated successfully!' }); // Dummy success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (error) {
      setPasswordChangeMessage({ type: 'error', text: 'Network error or server unavailable.' });
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailChangeMessage(null);

    // Basic email validation
    if (!newEmail.includes('@') || !newEmail.includes('.')) {
      setEmailChangeMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    // Simulate API call
    console.log('Attempting to change email to:', newEmail);
    try {
      // await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      // const response = await fetch('/api/change-email', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ newEmail }),
      // });
      // if (response.ok) {
      //   setEmailChangeMessage({ type: 'success', text: 'Email updated successfully!' });
      //   setNewEmail('');
      // } else {
      //   const errorData = await response.json();
      //   setEmailChangeMessage({ type: 'error', text: errorData.message || 'Failed to update email.' });
      // }
      setEmailChangeMessage({ type: 'success', text: 'Email updated successfully!' }); // Dummy success
      setNewEmail('');

    } catch (error) {
      setEmailChangeMessage({ type: 'error', text: 'Network error or server unavailable.' });
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl h-full flex flex-col">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 flex items-center">
        <Settings size={36} className="mr-3 text-brand-orange" /> Account Settings
      </h1>
      <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
        Manage your account preferences, security settings, and subscription details here.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow overflow-y-auto pr-2 -mr-2 custom-scrollbar">
        {/* Change Password Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-lg flex flex-col">
          <div className="flex items-center mb-4">
            <Key size={28} className="text-blue-500 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Change Password</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Secure your account by updating your password regularly.</p>
          <form onSubmit={handleChangePassword} className="flex-grow flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  id="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-brand-orange focus:border-brand-orange shadow-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-brand-orange focus:border-brand-orange shadow-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-brand-orange focus:border-brand-orange shadow-sm"
                  required
                />
              </div>
            </div>
            {passwordChangeMessage && (
              <div className={`mt-4 flex items-center p-2 text-sm rounded-md ${passwordChangeMessage.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'}`}>
                {passwordChangeMessage.type === 'success' ? <CheckCircle size={18} className="mr-2" /> : <AlertCircle size={18} className="mr-2" />}
                {passwordChangeMessage.text}
              </div>
            )}
            <button
              type="submit"
              className="mt-6 w-full bg-brand-orange text-white py-3 px-6 rounded-lg hover:bg-brand-orange-dark transition-colors duration-200 font-semibold shadow-md"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* Change Email Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-lg flex flex-col">
          <div className="flex items-center mb-4">
            <Mail size={28} className="text-green-500 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Change Email Address</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Update the email address associated with your account.</p>
          <form onSubmit={handleChangeEmail} className="flex-grow flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <label htmlFor="new-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Email Address
                </label>
                <input
                  type="email"
                  id="new-email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-brand-orange focus:border-brand-orange shadow-sm"
                  required
                />
              </div>
            </div>
            {emailChangeMessage && (
              <div className={`mt-4 flex items-center p-2 text-sm rounded-md ${emailChangeMessage.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'}`}>
                {emailChangeMessage.type === 'success' ? <CheckCircle size={18} className="mr-2" /> : <AlertCircle size={18} className="mr-2" />}
                {emailChangeMessage.text}
              </div>
            )}
            <button
              type="submit"
              className="mt-6 w-full bg-brand-orange text-white py-3 px-6 rounded-lg hover:bg-brand-orange-dark transition-colors duration-200 font-semibold shadow-md"
            >
              Update Email
            </button>
          </form>
        </div>

        {/* Subscription Status Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-lg flex flex-col">
          <div className="flex items-center mb-4">
            <CreditCard size={28} className="text-purple-500 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Subscription & Billing</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
            View your current plan details and manage your subscription.
          </p>
          <div className="text-lg text-gray-700 dark:text-gray-300 mb-4 mt-auto">
            Your current status: <span className="font-bold text-brand-orange">{subscriptionStatus}</span>
          </div>
          <button
            onClick={() => alert('Redirecting to subscription management portal...')}
            className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 font-semibold shadow-md flex items-center justify-center"
          >
            <CreditCard size={20} className="mr-2" /> Manage Subscription
          </button>
        </div>

        {/* User Profile Info (New Section) */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-lg flex flex-col">
          <div className="flex items-center mb-4">
            <UserCircle size={28} className="text-indigo-500 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Profile Information</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
            Review and update your basic profile details.
          </p>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p><strong>Name:</strong> John Doe (Example)</p>
            <p><strong>Role:</strong> Manager (Example)</p>
            <p><strong>Joined:</strong> 2023-01-15 (Example)</p>
          </div>
          <button
            onClick={() => alert('Edit profile functionality')}
            className="mt-6 w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 font-semibold shadow-md flex items-center justify-center"
          >
            <UserCircle size={20} className="mr-2" /> Edit Profile
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