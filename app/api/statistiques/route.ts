import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Vente from '@/models/Vente';
import Produit from '@/models/Produit';
import Stock from '@/models/Stock';
import { requireAuth } from '@/lib/auth';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (!auth) return;
    
    await dbConnect();
    
    // Get statistics for the last 30 days
    const todayEnd = endOfDay(new Date());
    const thirtyDaysAgo = startOfDay(subDays(new Date(), 30));
    
    // Total sales
    const totalSales = await Vente.countDocuments({
      statut: 'finalisée',
    });
    
    // Total revenue
    const revenueResult = await Vente.aggregate([
      {
        $match: {
          statut: 'finalisée',
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' },
        },
      },
    ]);
    
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    
    // Recent sales (last 30 days)
    const recentSales = await Vente.find({
      date: { $gte: thirtyDaysAgo, $lte: todayEnd },
      statut: 'finalisée',
    })
      .sort({ date: -1 })
      .limit(10)
      .populate({
        path: 'lignesVente.produit',
        select: 'nom',
      })
      .populate('client', 'nom')
      .populate('utilisateur', 'nom');
    
    // Sales by day (last 30 days)
    const salesByDay = await Vente.aggregate([
      {
        $match: {
          date: { $gte: thirtyDaysAgo, $lte: todayEnd },
          statut: 'finalisée',
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          count: { $sum: 1 },
          revenue: { $sum: '$total' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    
    // Format the results for chart display
    const salesChart = salesByDay.map((day) => ({
      date: day._id,
      count: day.count,
      revenue: day.revenue,
    }));
    
    // Stock alerts
    const stockAlerts = await Stock.find({
      $expr: { $lte: ['$quantite', '$seuilAlerte'] },
    })
      .populate('produit', 'nom prix')
      .sort({ quantite: 1 });
    
    // Top selling products
    const topProducts = await Vente.aggregate([
      {
        $match: {
          statut: 'finalisée',
        },
      },
      { $unwind: '$lignesVente' },
      {
        $group: {
          _id: '$lignesVente.produit',
          totalQuantity: { $sum: '$lignesVente.quantite' },
          totalRevenue: { $sum: '$lignesVente.sousTotal' },
        },
      },
      {
        $sort: { totalQuantity: -1 },
      },
      {
        $limit: 5,
      },
    ]);
    
    // Lookup product details
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (product) => {
        const productDetails = await Produit.findById(product._id);
        return {
          id: product._id,
          nom: productDetails?.nom || 'Unknown',
          quantite: product.totalQuantity,
          revenue: product.totalRevenue,
        };
      })
    );
    
    return NextResponse.json({
      success: true,
      data: {
        totalSales,
        totalRevenue,
        recentSales,
        salesChart,
        stockAlerts,
        topProducts: topProductsWithDetails,
      },
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while fetching statistics' },
      { status: 500 }
    );
  }
}