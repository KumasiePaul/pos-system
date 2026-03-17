import Sale from '../models/Sale.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import User from '../models/User.js';

// Get daily sales report
export const getDailySales = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sales = await Sale.find({
      createdAt: { $gte: today, $lt: tomorrow },
      status: 'completed'
    }).populate('cashier', 'name');

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.grandTotal, 0);
    const totalTransactions = sales.length;
    const totalItemsSold = sales.reduce((sum, sale) =>
      sum + sale.items.reduce((s, item) => s + item.quantity, 0), 0
    );

    res.status(200).json({
      date: today,
      totalRevenue,
      totalTransactions,
      totalItemsSold,
      sales
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get weekly sales report
export const getWeeklySales = async (req, res) => {
  try {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const sales = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: weekAgo, $lte: today },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          totalRevenue: { $sum: '$grandTotal' },
          totalTransactions: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get product performance report
export const getProductPerformance = async (req, res) => {
  try {
    const performance = await Sale.aggregate([
      { $match: { status: 'completed' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          productName: { $first: '$items.name' },
          totalQuantitySold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.subtotal' }
        }
      },
      { $sort: { totalQuantitySold: -1 } }
    ]);

    res.status(200).json(performance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get cashier performance report
export const getCashierPerformance = async (req, res) => {
  try {
    const performance = await Sale.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$cashier',
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: '$grandTotal' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'cashier'
        }
      },
      { $unwind: '$cashier' },
      {
        $project: {
          cashierName: '$cashier.name',
          cashierEmail: '$cashier.email',
          totalSales: 1,
          totalRevenue: 1
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.status(200).json(performance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get overall summary
export const getSummary = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalUsers = await User.countDocuments();

    const salesData = await Sale.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$grandTotal' },
          totalTransactions: { $sum: 1 }
        }
      }
    ]);

    const summary = salesData[0] || { totalRevenue: 0, totalTransactions: 0 };

    res.status(200).json({
      totalProducts,
      totalCustomers,
      totalUsers,
      totalRevenue: summary.totalRevenue,
      totalTransactions: summary.totalTransactions
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};