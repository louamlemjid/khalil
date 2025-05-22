// src/app/dashboard/(caisse)/[category]/page.tsx
'use client';

import AuthGuard from '@/components/AuthGuard';
import { Role, Product, ProductCategory } from '@/lib/types';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, // For "Back to Categories"
  ShoppingCart, // For current sale/cart
  PlusCircle, // For adding to cart
  MinusCircle, // For removing from cart (if implementing cart logic here)
  Search, // For product search
  Info, // For empty state
  Loader2, // For loading state
  XCircle, // For error state
  DollarSign // For checkout button
} from 'lucide-react'; // Import Lucide icons

// Extend Product type for cart functionality (optional but good for local state)
interface CartItem extends Product {
  quantity: number;
}

// Dummy product data for demonstration. In a real app, this would come from an API.
const dummyProducts: Record<ProductCategory, Product[]> = {
  coffee: [
    { id: 'c1', nom: 'Espresso', description: 'Strong black coffee', prix: 2.50, categorie: 'coffee', image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&q=80', date_creation: new Date().toISOString() },
    { id: 'c2', nom: 'Latte', description: 'Espresso with steamed milk', prix: 3.50, categorie: 'coffee', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80', date_creation: new Date().toISOString() },
    { id: 'c3', nom: 'Cappuccino', description: 'Espresso, steamed milk, and foam', prix: 3.20, categorie: 'coffee', image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80', date_creation: new Date().toISOString() },
    { id: 'c4', nom: 'Americano', description: 'Espresso diluted with hot water', prix: 2.80, categorie: 'coffee', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80', date_creation: new Date().toISOString() },
    { id: 'c5', nom: 'Mocha', description: 'Espresso, chocolate, and steamed milk', prix: 4.00, categorie: 'coffee', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80', date_creation: new Date().toISOString() },
  ],
  jus: [
    { id: 'j1', nom: 'Orange Juice', description: 'Freshly squeezed orange juice', prix: 4.00, categorie: 'jus', image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80', date_creation: new Date().toISOString() },
    { id: 'j2', nom: 'Apple Juice', description: 'Natural apple juice', prix: 3.80, categorie: 'jus', image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80', date_creation: new Date().toISOString() },
    { id: 'j3', nom: 'Mango Smoothie', description: 'Blended mango with yogurt', prix: 5.50, categorie: 'jus', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80', date_creation: new Date().toISOString() },
  ],
  pizzas: [
    { id: 'p1', nom: 'Margherita Pizza', description: 'Classic tomato and mozzarella', prix: 12.00, categorie: 'pizzas', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80', date_creation: new Date().toISOString() },
    { id: 'p2', nom: 'Pepperoni Pizza', description: 'Spicy pepperoni and cheese', prix: 14.50, categorie: 'pizzas', image: 'https://images.unsplash.com/photo-1548365328-9b2b2b2b2b2b?auto=format&fit=crop&w=400&q=80', date_creation: new Date().toISOString() },
    { id: 'p3', nom: 'Veggie Supreme', description: 'Loaded with fresh vegetables', prix: 13.00, categorie: 'pizzas', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80', date_creation: new Date().toISOString() },
  ],
  pastries: [
    { id: 'pa1', nom: 'Croissant', description: 'Flaky butter croissant', prix: 2.00, categorie: 'pastries', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80', date_creation: new Date().toISOString() },
    { id: 'pa2', nom: 'Chocolate Donut', description: 'Sweet donut with chocolate glaze', prix: 2.50, categorie: 'pastries', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80', date_creation: new Date().toISOString() },
    { id: 'pa3', nom: 'Muffin', description: 'Blueberry muffin', prix: 2.20, categorie: 'pastries', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80', date_creation: new Date().toISOString() },
  ],
  sandwiches: [
    { id: 's1', nom: 'Club Sandwich', description: 'Triple-decker with chicken and bacon', prix: 7.50, categorie: 'sandwiches', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80', date_creation: new Date().toISOString() },
    { id: 's2', nom: 'Veggie Wrap', description: 'Fresh vegetables in a whole wheat wrap', prix: 6.00, categorie: 'sandwiches', image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80', date_creation: new Date().toISOString() },
    { id: 's3', nom: 'Tuna Melt', description: 'Toasted sandwich with tuna and cheese', prix: 6.80, categorie: 'sandwiches', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80', date_creation: new Date().toISOString() },
  ],
  desserts: [
    { id: 'd1', nom: 'Chocolate Cake', description: 'Rich chocolate fudge cake slice', prix: 5.00, categorie: 'desserts', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80', date_creation: new Date().toISOString() },
    { id: 'd2', nom: 'Cheesecake', description: 'Creamy New York style cheesecake', prix: 4.80, categorie: 'desserts', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80', date_creation: new Date().toISOString() },
  ],
  drinks: [
    { id: 'dr1', nom: 'Coca-Cola', description: 'Classic fizzy drink', prix: 2.00, categorie: 'drinks', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80', date_creation: new Date().toISOString() },
    { id: 'dr2', nom: 'Sparkling Water', description: 'Refreshing sparkling water', prix: 1.50, categorie: 'drinks', image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80', date_creation: new Date().toISOString() },
  ],
  snacks: [
    { id: 'sn1', nom: 'Potato Chips', description: 'Crispy salted potato chips', prix: 1.80, categorie: 'snacks', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80', date_creation: new Date().toISOString() },
    { id: 'sn2', nom: 'Granola Bar', description: 'Healthy oat and nut bar', prix: 2.20, categorie: 'snacks', image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80', date_creation: new Date().toISOString() },
  ],
};


export default function CategoryProductsPageWrapper() {
  const allowedRoles: Role[] = ['manager', 'caisse'];

  return (
    <AuthGuard allowedRoles={allowedRoles}>
      <CategoryProductsPageContent />
    </AuthGuard>
  );
}

function CategoryProductsPageContent() {
  const params = useParams();
  const router = useRouter();
  const categorySlug = params.category as ProductCategory;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    if (categorySlug) {
      setLoading(true);
      setError(null);
      setSearchTerm(''); // Reset search term when category changes

      // Simulate API fetch
      const productsForCategory = dummyProducts[categorySlug];
      if (productsForCategory) {
        setProducts(productsForCategory);
      } else {
        setError(`Category "${categorySlug}" not found or has no products.`);
        setProducts([]);
      }
      setLoading(false);
    }
  }, [categorySlug]);

  const filteredProducts = products.filter(product =>
    product.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const updateCartItemQuantity = (productId: string, delta: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + delta } : item
      ).filter(item => item.quantity > 0); // Remove if quantity goes to 0 or less
      return updatedCart;
    });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.prix * item.quantity, 0).toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <Loader2 size={48} className="animate-spin text-brand-orange mb-4" />
        <p className="text-xl text-gray-700 dark:text-gray-300">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 bg-red-100 dark:bg-red-900 rounded-lg shadow-md">
        <XCircle size={48} className="text-red-500 mb-4" />
        <p className="text-xl text-red-700 dark:text-red-300 mb-6">{error}</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-brand-orange text-white rounded-lg hover:bg-brand-orange-dark transition-colors flex items-center"
        >
          <ArrowLeft size={20} className="mr-2" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {/* Product List Section */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard/caisse" className="flex items-center text-brand-orange hover:underline hover:text-brand-orange-dark transition-colors">
            <ArrowLeft size={20} className="mr-2" /> Back to Categories
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)} Products
          </h1>
          <div className-="w-10"></div> {/* Spacer for alignment */}
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder={`Search ${categorySlug} products...`}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-brand-orange focus:border-brand-orange"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {filteredProducts.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 py-10">
            <Info size={48} className="mb-4" />
            <p className="text-lg">No products found in this category or matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 flex-grow overflow-y-auto pr-2 -mr-2 custom-scrollbar">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer flex flex-col items-center text-center group"
                onClick={() => addToCart(product)} // Add product to cart on click
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.nom}
                    className="w-full h-32 object-cover rounded-lg mb-3 transform group-hover:scale-105 transition-transform duration-200"
                  />
                )}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                  {product.nom}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                  {product.description}
                </p>
                <p className="text-2xl font-bold text-brand-orange mt-auto">
                  ${product.prix.toFixed(2)}
                </p>
                <button className="mt-3 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors opacity-0 group-hover:opacity-100 group-hover:block transition-opacity duration-200 hidden-if-not-hover">
                  <PlusCircle size={20} className="inline-block mr-2" /> Add
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart/Order Summary Section */}
      <div className="w-full lg:w-96 flex flex-col bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md p-6 lg:ml-6 flex-shrink-0">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <ShoppingCart size={24} className="mr-2 text-brand-orange" /> Current Order
        </h2>

        {cart.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <Info size={40} className="mb-4" />
            <p>Your cart is empty. Click on products to add them!</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto pr-2 -mr-2 mb-4 custom-scrollbar">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm mb-2"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">{item.nom}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">${item.prix.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateCartItemQuantity(item.id, -1)}
                    className="p-1 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <MinusCircle size={20} />
                  </button>
                  <span className="font-bold text-gray-900 dark:text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateCartItemQuantity(item.id, 1)}
                    className="p-1 rounded-full text-green-500 hover:bg-green-100 dark:hover:bg-green-900 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <PlusCircle size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-auto">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold text-gray-900 dark:text-white">Total:</span>
            <span className="text-2xl font-extrabold text-brand-orange">${calculateTotal()}</span>
          </div>
          <button
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors flex items-center justify-center"
            disabled={cart.length === 0}
            onClick={() => alert(`Proceeding to checkout with total: $${calculateTotal()}`)} // Replace with actual checkout logic
          >
            <DollarSign size={24} className="mr-2" /> Proceed to Checkout
          </button>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
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