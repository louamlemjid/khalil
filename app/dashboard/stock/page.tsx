// src/app/dashboard/(stock)/page.tsx
'use client';

import AuthGuard from '@/components/AuthGuard';
import { Role } from '@/lib/types';
import { useState } from 'react';
import {
  Package, // Replaces FaBoxes
  Search, // Replaces FaSearch
  Plus, // Replaces FaPlus
  AlertTriangle, // Replaces FaExclamationTriangle
  CheckCircle, // Replaces FaCheckCircle
  XCircle, // New icon for 'Out of Stock' if needed
} from 'lucide-react'; // Import Lucide icons

// Define a more detailed Product type for stock management
interface StockProduct {
  id: string; // Unique ID for the product
  name: string;
  quantity: number;
  min_quantity: number; // Minimum quantity to trigger an alert
  unit: string; // e.g., 'kg', 'units', 'liters'
  image?: string; // Optional image URL for the product
}

// Dummy data for demonstration. In a real app, this would come from an API.
const dummyStockProducts: StockProduct[] = [
  { id: 'prod1', name: 'Coffee Beans', quantity: 100, min_quantity: 20, unit: 'kg', image: 'https://via.placeholder.com/60/FFDDC1/800000?text=CB' },
  { id: 'prod2', name: 'Orange Juice', quantity: 15, min_quantity: 20, unit: 'liters', image: 'https://via.placeholder.com/60/FFAD00/FFFFFF?text=OJ' },
  { id: 'prod3', name: 'Pizza Dough', quantity: 5, min_quantity: 10, unit: 'units', image: 'https://via.placeholder.com/60/E0BBE4/FFFFFF?text=PD' },
  { id: 'prod4', name: 'Croissants', quantity: 30, min_quantity: 10, unit: 'units', image: 'https://via.placeholder.com/60/957DAD/FFFFFF?text=CR' },
  { id: 'prod5', name: 'Bread Loaves', quantity: 50, min_quantity: 15, unit: 'units', image: 'https://via.placeholder.com/60/C7F2A4/4CAF50?text=BL' },
  { id: 'prod6', name: 'Bottled Water', quantity: 500, min_quantity: 100, unit: 'bottles', image: 'https://via.placeholder.com/60/ADD8E6/000080?text=BW' },
  { id: 'prod7', name: 'Chicken Breast', quantity: 8, min_quantity: 10, unit: 'kg', image: 'https://via.placeholder.com/60/FFC0CB/800000?text=CH' },
  { id: 'prod8', name: 'Tomatoes', quantity: 25, min_quantity: 10, unit: 'kg', image: 'https://via.placeholder.com/60/F0F8FF/FF0000?text=TO' },
];

export default function StockPageWrapper() {
  const allowedRoles: Role[] = ['manager', 'stock_manager'];

  return (
    <AuthGuard allowedRoles={allowedRoles}>
      <StockPageContent />
    </AuthGuard>
  );
}

function StockPageContent() {
  const [products, setProducts] = useState<StockProduct[]>(dummyStockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<StockProduct | null>(null);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(0);
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'subtract'>('add'); // 'add' or 'subtract'

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateClick = (product: StockProduct) => {
    setSelectedProduct(product);
    setAdjustmentQuantity(0); // Reset quantity input
    setAdjustmentType('add'); // Default to adding
    setShowModal(true);
  };

  const handleAdjustStock = () => {
    if (!selectedProduct) return;

    const newQuantity = adjustmentType === 'add'
      ? selectedProduct.quantity + adjustmentQuantity
      : selectedProduct.quantity - adjustmentQuantity;

    // Prevent negative stock
    if (newQuantity < 0) {
      alert('Cannot reduce stock below zero!');
      return;
    }

    // In a real app, you'd send this update to your backend API
    const updatedProducts = products.map(p =>
      p.id === selectedProduct.id ? { ...p, quantity: newQuantity } : p
    );
    setProducts(updatedProducts);
    setShowModal(false);
  };

  const getStockStatus = (product: StockProduct) => {
    if (product.quantity <= 0) {
      return { text: 'Out of Stock', color: 'text-red-500', icon: <XCircle size={16} className="inline-block mr-1" /> };
    } else if (product.quantity <= product.min_quantity) {
      return { text: 'Low Stock', color: 'text-yellow-500', icon: <AlertTriangle size={16} className="inline-block mr-1" /> };
    } else {
      return { text: 'In Stock', color: 'text-green-500', icon: <CheckCircle size={16} className="inline-block mr-1" /> };
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md h-full flex flex-col">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 flex items-center">
        <Package size={36} className="mr-3 text-brand-orange" /> Stock Management
      </h1>
      <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
        Effortlessly track and manage your product inventory. Update quantities, monitor stock levels, and identify items needing attention.
      </p>

      {/* Action Bar: Search and Add Product */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-2/3">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-brand-orange focus:border-brand-orange"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <button className="w-full bg-dark sm:w-auto flex items-center justify-center px-6 py-2 bg-orange text-white font-semibold rounded-md shadow-md hover:bg-brand-orange-dark transition-colors duration-200"
          onClick={()=>setShowModal(true)}
        >
          <Plus size={20} className="mr-2" /> Add New Product
        </button>
      </div>

      {/* Product List/Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          <p>No products found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex-grow overflow-y-auto pr-2 -mr-2 custom-scrollbar">
          {filteredProducts.map((product) => {
            const status = getStockStatus(product);
            return (
              <div
                key={product.id}
                className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
              >
                {product.image && (
                  <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-full mx-auto mb-4 border-2 border-brand-orange" />
                )}
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">{product.name}</h2>
                <div className="text-center mb-4">
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Current Stock: <span className="font-semibold text-lg">{product.quantity} {product.unit}</span>
                  </p>
                  <p className={`text-sm font-medium ${status.color}`}>
                    {status.icon} {status.text}
                    {status.text === 'Low Stock' && ` (Min: ${product.min_quantity} ${product.unit})`}
                  </p>
                </div>
                <button
                  onClick={() => handleUpdateClick(product)}
                  className="w-full py-2 bg-dark text-white font-semibold rounded-lg hover:bg-brand-orange-dark transition-colors duration-200 mt-auto"
                >
                  Adjust Stock
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md animate-fade-in-up transform-gpu">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Adjust Stock for {selectedProduct.name}</h2>
            <div className="mb-4">
              <p className="text-gray-700 dark:text-gray-300 mb-2">Current Quantity: <span className="font-semibold">{selectedProduct.quantity} {selectedProduct.unit}</span></p>
            </div>
            <div className="mb-4">
              <label htmlFor="adjustmentType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adjustment Type</label>
              <select
                id="adjustmentType"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-brand-orange focus:border-brand-orange"
                value={adjustmentType}
                onChange={(e) => setAdjustmentType(e.target.value as 'add' | 'subtract')}
              >
                <option value="add">Add Stock</option>
                <option value="subtract">Subtract Stock</option>
              </select>
            </div>
            <div className="mb-6">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
              <input
                type="number"
                id="quantity"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-brand-orange focus:border-brand-orange"
                value={adjustmentQuantity}
                onChange={(e) => setAdjustmentQuantity(Math.max(0, parseInt(e.target.value) || 0))} // Ensure non-negative
                min="0"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdjustStock}
                className="px-5 py-2 bg-dark text-white rounded-md hover:bg-brand-orange-dark "
              >
                Confirm Adjustment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles for custom scrollbar (add to your globals.css or component style) */}
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

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in-up {
          animation: fadeInScale 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}