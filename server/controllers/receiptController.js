import Sale from '../models/Sale.js';
import Payment from '../models/Payment.js';

// Get receipt by sale ID
export const getReceipt = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.saleId)
      .populate('cashier', 'name email')
      .populate('customer', 'name phone');

    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    // Get payment record for this sale
    const payment = await Payment.findOne({ sale: req.params.saleId });

    res.status(200).json({
      receipt: {
        transactionId: sale._id,
        date: sale.createdAt,
        cashier: sale.cashier,
        customer: sale.customer,
        items: sale.items,
        totalAmount: sale.totalAmount,
        discount: sale.discount,
        tax: sale.tax,
        grandTotal: sale.grandTotal,
        paymentMethod: sale.paymentMethod,
        amountPaid: sale.amountPaid,
        change: sale.change,
        status: sale.status,
        payment: payment || null
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all receipts
export const getAllReceipts = async (req, res) => {
  try {
    const sales = await Sale.find({ status: 'completed' })
      .populate('cashier', 'name email')
      .populate('customer', 'name phone')
      .sort({ createdAt: -1 });

    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};