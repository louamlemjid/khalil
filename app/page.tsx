"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart2, Users, ShoppingCart, Package, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/db';

export default function Home() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setLoading(false);
          return;
        }

        // Fetch total sales count
        const { count: salesCount } = await supabase
          .from('sales')
          .select('*', { count: 'exact' });

        // Fetch total revenue
        const { data: revenueData } = await supabase
          .from('sales')
          .select('amount')
          .throwOnError();
        
        const totalRevenue = revenueData?.reduce((sum, sale) => sum + (sale.amount || 0), 0) || 0;

        // Fetch products count
        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact' });

        // Fetch low stock alerts
        const { data: stockAlerts } = await supabase
          .from('stock')
          .select(`
            *,
            products (
              name
            )
          `)
          .lt('quantity', 'alert_threshold');

        // Fetch sales chart data (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { data: salesChart } = await supabase
          .from('sales')
          .select('created_at, amount')
          .gte('created_at', thirtyDaysAgo.toISOString())
          .order('created_at');

        // Process sales chart data
        const chartData = salesChart?.reduce((acc: any[], sale: any) => {
          const date = new Date(sale.created_at).toLocaleDateString();
          const existingDay = acc.find(d => d.date === date);
          
          if (existingDay) {
            existingDay.revenue += sale.amount;
            existingDay.count += 1;
          } else {
            acc.push({ date, revenue: sale.amount, count: 1 });
          }
          
          return acc;
        }, []) || [];

        // Fetch top products
        const { data: topProducts } = await supabase
          .from('products')
          .select(`
            name,
            sales_count
          `)
          .order('sales_count', { ascending: false })
          .limit(5);

        setStats({
          totalSales: salesCount || 0,
          totalRevenue,
          productsCount: productsCount || 0,
          stockAlerts: stockAlerts || [],
          salesChart: chartData,
          topProducts: topProducts || []
        });
      } catch (err) {
        setError('Error loading dashboard data. Please try again later.');
        console.error('Error fetching statistics:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // If user is not authenticated, show login message
  if (!stats && !loading) {
    return (
      <div className="container mt-5">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to RetailPro</h2>
          <p className="mb-4">Please log in to access the dashboard and manage your retail operations.</p>
          <a href="/auth/login" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            Login
          </a>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-4 animate-in slide-in-from-bottom-2">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">Dashboard</h1>
      
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <ShoppingCart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
              <h3 className="text-2xl font-bold">{stats?.totalSales}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-100 rounded-full">
              <BarChart2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Revenue</p>
              <h3 className="text-2xl font-bold">${stats?.totalRevenue?.toFixed(2)}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Products</p>
              <h3 className="text-2xl font-bold">{stats?.productsCount}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-yellow-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Low Stock Alerts</p>
              <h3 className="text-2xl font-bold">{stats?.stockAlerts?.length}</h3>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-7 mb-4">
        <Card className="col-span-4 p-4">
          <h3 className="text-lg font-semibold mb-4">Sales Trend (Last 30 Days)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={stats?.salesChart}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#22c55e" name="Revenue ($)" />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" name="Number of Sales" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card className="col-span-3 p-4">
          <h3 className="text-lg font-semibold mb-4">Top Products</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats?.topProducts}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales_count" fill="#22c55e" name="Units Sold" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      {/* Stock Alerts */}
      <Card>
        <div className="bg-yellow-50 p-4 rounded-t-lg border-b">
          <h3 className="text-lg font-semibold flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Low Stock Alerts
          </h3>
        </div>
        <div className="p-4">
          {stats?.stockAlerts?.length > 0 ? (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Product</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Current Stock</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Alert Threshold</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.stockAlerts.map((item: any) => (
                    <tr key={item.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td className="p-4 align-middle">{item.products.name}</td>
                      <td className="p-4 align-middle">{item.quantity}</td>
                      <td className="p-4 align-middle">{item.alert_threshold}</td>
                      <td className="p-4 align-middle">
                        {item.quantity === 0 ? (
                          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                            Out of Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/10">
                            Low Stock
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground">No stock alerts at this time.</p>
          )}
        </div>
      </Card>
    </div>
  );
}