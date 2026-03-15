import Sale from '../models/Sale.js';
import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';

// Create a new sale
export const createSale = async (req, res) => {
  try {
    const {
      items,
      discount,
      tax,
      paymentMethod,
      amountPaid,
      customer
    } = req.body;

    // Validate items and calculate totals
    let totalAmount = 0;
    const saleItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      // Check stock availability
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${product.quantity}`
        });
      }

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      saleItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        subtotal
      });
    }

    // Calculate grand total
    const discountAmount = (totalAmount * (discount || 0)) / 100;
    const taxAmount = (totalAmount * (tax || 0)) / 100;
    const grandTotal = totalAmount - discountAmount + taxAmount;

    // Check amount paid
    if (amountPaid < grandTotal) {
      return res.status(400).json({
        message: `Insufficient payment. Grand total is ${grandTotal}`
      });
    }

    const change = amountPaid - grandTotal;

    // Create the sale
    const sale = await Sale.create({
      cashier: req.user.id,
      customer: customer || null,
      items: saleItems,
      totalAmount,
      discount: discountAmount,
      tax: taxAmount,
      grandTotal,
      paymentMethod,
      amountPaid,
      change,
      status: 'completed'
    });

    // Deduct stock from products and inventory
    for (const item of saleItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: -item.quantity }
      });
      await Inventory.findOneAndUpdate(
        { product: item.product },
        { $inc: { stockQuantity: -item.quantity } }
      );
    }

    // Populate sale details
    const populatedSale = await Sale.findById(sale._id)
      .populate('cashier', 'name email')
      .populate('customer', 'name phone');

    res.status(201).json({
      message: 'Sale completed successfully',
      sale: populatedSale
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all sales
export const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('cashier', 'name email')
      .populate('customer', 'name phone')
      .sort({ createdAt: -1 });
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single sale
export const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('cashier', 'name email')
      .populate('customer', 'name phone');

    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get sales by cashier
export const getSalesByCashier = async (req, res) => {
  try {
    const sales = await Sale.find({ cashier: req.user.id })
      .populate('cashier', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};