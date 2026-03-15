import Payment from '../models/Payment.js';
import Sale from '../models/Sale.js';

// Create a payment record
export const createPayment = async (req, res) => {
  try {
    const { saleId, method, amount, reference } = req.body;

    // Check if sale exists
    const sale = await Sale.findById(saleId);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    // Check if payment already exists for this sale
    const existingPayment = await Payment.findOne({ sale: saleId });
    if (existingPayment) {
      return res.status(400).json({ message: 'Payment already recorded for this sale' });
    }

    const change = amount - sale.grandTotal;

    // Create payment record
    const payment = await Payment.create({
      sale: saleId,
      method,
      amount,
      change: change > 0 ? change : 0,
      status: 'successful',
      reference
    });

    res.status(201).json({
      message: 'Payment recorded successfully',
      payment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all payments
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('sale', 'grandTotal status createdAt')
      .sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get payment by sale ID
export const getPaymentBySale = async (req, res) => {
  try {
    const payment = await Payment.findOne({ sale: req.params.saleId })
      .populate('sale', 'grandTotal status createdAt items');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found for this sale' });
    }

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get payment summary by method
export const getPaymentSummary = async (req, res) => {
  try {
    const summary = await Payment.aggregate([
      { $match: { status: 'successful' } },
      {
        $group: {
          _id: '$method',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};