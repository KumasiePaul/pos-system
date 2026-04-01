import Payment from '../models/Payment.js';
import Sale from '../models/Sale.js';

const PAYSTACK_BASE = 'https://api.paystack.co';
const paystackHeaders = () => ({
  Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
  'Content-Type': 'application/json',
});

// Initiate a Paystack mobile money charge
export const initiateMobileMoney = async (req, res) => {
  try {
    const { phone, network, amount } = req.body;

    if (!phone || !network || !amount) {
      return res.status(400).json({ message: 'phone, network and amount are required' });
    }

    const providerMap = { mtn: 'mtn', vod: 'vod', tgo: 'tgo' };
    if (!providerMap[network]) {
      return res.status(400).json({ message: 'Invalid network. Use mtn, vod, or tgo' });
    }

    const amountInPesewas = Math.round(Number(amount) * 100);

    // Convert local format (0XXXXXXXXX) to international format (233XXXXXXXXX)
    const internationalPhone = phone.startsWith('0')
      ? `233${phone.slice(1)}`
      : phone;

    const response = await fetch(`${PAYSTACK_BASE}/charge`, {
      method: 'POST',
      headers: paystackHeaders(),
      body: JSON.stringify({
        email: `${internationalPhone}@momo.salesync.com`,
        amount: amountInPesewas,
        mobile_money: { phone: internationalPhone, provider: network },
      }),
    });

    const data = await response.json();

    // "Charge attempted" = USSD prompt sent, charge is in progress — not an error
    if (data.data?.reference) {
      return res.status(200).json({
        reference: data.data.reference,
        status: data.data.status || 'pay_offline',
      });
    }

    return res.status(400).json({ message: data.message || 'Paystack charge failed' });
  } catch (error) {
    res.status(500).json({ message: 'Payment initiation failed', error: error.message });
  }
};

// Submit OTP to Paystack to complete the charge
export const submitOtp = async (req, res) => {
  try {
    const { otp, reference } = req.body;
    if (!otp || !reference) {
      return res.status(400).json({ message: 'otp and reference are required' });
    }

    const response = await fetch(`${PAYSTACK_BASE}/charge/submit_otp`, {
      method: 'POST',
      headers: paystackHeaders(),
      body: JSON.stringify({ otp, reference }),
    });

    const data = await response.json();

    if (data.data?.reference) {
      return res.status(200).json({ status: data.data.status });
    }

    return res.status(400).json({ message: data.message || 'OTP submission failed' });
  } catch (error) {
    res.status(500).json({ message: 'OTP submission failed', error: error.message });
  }
};

// Verify a Paystack transaction by reference
export const verifyMobileMoney = async (req, res) => {
  try {
    const { reference } = req.params;

    const response = await fetch(`${PAYSTACK_BASE}/transaction/verify/${reference}`, {
      headers: paystackHeaders(),
    });

    const data = await response.json();

    // If transaction is still pending (not yet approved by customer)
    if (!data.status || !data.data) {
      return res.status(200).json({ status: 'pending' });
    }

    res.status(200).json({ status: data.data.status });
  } catch (error) {
    res.status(500).json({ message: 'Verification failed', error: error.message });
  }
};

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