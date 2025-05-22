// src/app/dashboard/(caisse)/page.tsx
'use client';

import AuthGuard from '@/components/AuthGuard';
import { Role, ProductCategory } from '@/lib/types'; // Import ProductCategory
import Link from 'next/link';
import { useState, useEffect,useRef } from 'react';
import { ShoppingBag, LayoutGrid, Coffee, Milk, Pizza, Croissant, Sandwich, Cake, Salad, Soup, Utensils, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';

export default function CaissePageWrapper() {
  const allowedRoles: Role[] = ['manager', 'caisse'];

  return (
    <AuthGuard allowedRoles={allowedRoles}>
      <CaissePageContent />
    </AuthGuard>
  );
}

// Separate component for the actual page content
function CaissePageContent() {
  // Example categories with icons and dummy images
  const categories = [
    { name: 'Coffee', slug: 'coffee', icon: Coffee, image: 'https://via.placeholder.com/150/FFDDC1/800000?text=Coffee' },
    { name: 'Jus', slug: 'jus', icon: Milk, image: 'https://via.placeholder.com/150/FFAD00/FFFFFF?text=Juice' },
    { name: 'Pizzas', slug: 'pizzas', icon: Pizza, image: 'https://via.placeholder.com/150/E0BBE4/FFFFFF?text=Pizza' },
    { name: 'Pastries', slug: 'pastries', icon: Croissant, image: 'https://via.placeholder.com/150/957DAD/FFFFFF?text=Pastry' },
    { name: 'Sandwiches', slug: 'sandwiches', icon: Sandwich, image: 'https://via.placeholder.com/150/C7F2A4/4CAF50?text=Sandwich' },
    { name: 'Desserts', slug: 'desserts', icon: Cake, image: 'https://via.placeholder.com/150/F0F8FF/FF0000?text=Dessert' },
    { name: 'Salads', slug: 'salads', icon: Salad, image: 'https://via.placeholder.com/150/ADD8E6/000080?text=Salad' },
    { name: 'Soups', slug: 'soups', icon: Soup, image: 'https://via.placeholder.com/150/FFC0CB/800000?text=Soup' },
    { name: 'Meals', slug: 'meals', icon: Utensils, image: 'https://via.placeholder.com/150/DDA0DD/FFFFFF?text=Meal' },
    { name: 'Drinks', slug: 'drinks', icon: Milk, image: 'https://via.placeholder.com/150/B0E0E6/000080?text=Drinks' }, // Placeholder for generic drinks
    { name: 'Snacks', slug: 'snacks', icon: LayoutGrid, image: 'https://via.placeholder.com/150/FFFACD/FFD700?text=Snacks' }, // Placeholder for generic snacks
  ];

  // State to manage scrolling for the category navbar
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200; // Adjust scroll amount as needed
      if (direction === 'left') {
        scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-full flex flex-col">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6 flex items-center">
        <ShoppingBag size={36} className="mr-3 text-brand-orange" /> Point of Sale
      </h1>

      {/* Category Navigation Bar */}
      <div className="relative mb-6">
        <div
          ref={scrollContainerRef}
          className="flex flex-nowrap overflow-x-auto custom-scrollbar-horizontal py-2 gap-4 snap-x snap-mandatory scroll-p-4"
        >
          {categories.map((category) => (
            <Link
              href={`/dashboard/caisse/${category.slug}`}
              key={category.slug}
              className="flex-none w-36 h-28 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center justify-center p-3 text-center cursor-pointer transform hover:scale-105 active:scale-95 transition-transform ease-in-out snap-center"
            >
              {category.icon && <category.icon size={32} className="text-brand-orange mb-2" />}
              <h2 className="text-md font-semibold text-gray-900 dark:text-white line-clamp-1">{category.name}</h2>
              {/* Optional: Add a small category image here */}
              {/* <img src={category.image} alt={category.name} className="w-12 h-12 rounded-full object-cover mb-2" /> */}
            </Link>
          ))}
        </div>
        {/* Scroll Buttons for Desktop */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-100 dark:bg-gray-700 p-2 rounded-full shadow-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange hidden md:block"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-100 dark:bg-gray-700 p-2 rounded-full shadow-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-orange hidden md:block"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Main Content Area - Could be for "New Sale", "Current Sale Summary", etc. */}
      <div className="flex-grow flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 p-8 rounded-lg text-center text-gray-700 dark:text-gray-300">
        <ShoppingCart size={80} className="text-brand-orange mb-6" />
        <h2 className="text-2xl font-semibold mb-3">Ready to make a sale?</h2>
        <p className="max-w-md">
          Select a product category from the navigation bar above to start adding items to the current order.
        </p>
        <button className="mt-8 px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200 flex items-center">
          <ShoppingBag size={20} className="mr-2" /> View Current Sale
        </button>
      </div>

      {/* Footer / Quick Actions (Optional) */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
        {/* Potentially add buttons for 'Hold Sale', 'Refund', 'End of Day Report' here */}
      </div>

      {/* Custom Scrollbar Styles for Horizontal Navbar */}
      <style jsx>{`
        .custom-scrollbar-horizontal::-webkit-scrollbar {
          height: 8px; /* height of horizontal scrollbar */
        }
        .custom-scrollbar-horizontal::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar-horizontal::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar-horizontal::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        /* Dark mode scrollbar */
        .dark .custom-scrollbar-horizontal::-webkit-scrollbar-track {
          background: #333;
        }
        .dark .custom-scrollbar-horizontal::-webkit-scrollbar-thumb {
          background: #666;
        }
        .dark .custom-scrollbar-horizontal::-webkit-scrollbar-thumb:hover {
          background: #888;
        }
      `}</style>
    </div>
  );
}