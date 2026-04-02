import Inventory from '../models/Inventory.js';
import Product from '../models/Product.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

// Get all inventory
export const getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().populate('product', 'name category price barcode');
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get low stock items
export const getLowStockItems = async (req, res) => {
  try {
    const inventory = await Inventory.find().populate('product', 'name category price barcode');
    const lowStock = inventory.filter(item => item.stockQuantity <= item.lowStockThreshold);
    res.status(200).json(lowStock);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create inventory record for a product
export const createInventory = async (req, res) => {
  try {
    const { productId, stockQuantity, lowStockThreshold, supplier } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if inventory already exists for this product
    const existingInventory = await Inventory.findOne({ product: productId });
    if (existingInventory) {
      return res.status(400).json({ message: 'Inventory record already exists for this product' });
    }

    const inventory = await Inventory.create({
      product: productId,
      stockQuantity,
      lowStockThreshold,
      supplier
    });

    res.status(201).json({ message: 'Inventory created successfully', inventory });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update stock quantity
export const updateStock = async (req, res) => {
  try {
    const { stockQuantity, lowStockThreshold, supplier } = req.body;

    const inventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      {
        stockQuantity,
        lowStockThreshold,
        supplier,
        lastRestocked: Date.now()
      },
      { new: true, runValidators: true }
    ).populate('product', 'name category price barcode');

    if (!inventory) {
      return res.status(404).json({ message: 'Inventory record not found' });
    }

    // Also update quantity in Product model
    await Product.findByIdAndUpdate(inventory.product._id, {
      quantity: stockQuantity
    });

    res.status(200).json({ message: 'Stock updated successfully', inventory });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Adjust stock (add or subtract)
export const adjustStock = async (req, res) => {
  try {
    const { adjustment, reason } = req.body;

    const inventory = await Inventory.findById(req.params.id).populate('product', 'name');
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory record not found' });
    }

    const newQuantity = inventory.stockQuantity + adjustment;
    if (newQuantity < 0) {
      return res.status(400).json({ message: 'Stock cannot go below zero' });
    }

    inventory.stockQuantity = newQuantity;
    await inventory.save();

    // Also update quantity in Product model
    await Product.findByIdAndUpdate(inventory.product._id, {
      quantity: newQuantity
    });

    // Send notification to the opposite role
    const adjusterRole = req.user.role;
    const targetRole = adjusterRole === 'admin' ? 'manager' : 'admin';
    const productName = inventory.product?.name || 'Unknown Product';
    const direction = adjustment >= 0 ? `+${adjustment}` : `${adjustment}`;

    const adjusterUser = await User.findById(req.user.id).select('name');
    const adjusterName = adjusterUser?.name || 'Unknown';

    await Notification.create({
      targetRole,
      type: 'stock_adjustment',
      title: 'Stock Adjusted',
      message: `${productName} stock was adjusted by ${direction} units. Reason: ${reason || 'No reason provided'}`,
      adjustedBy: {
        name: adjusterName,
        role: adjusterRole
      },
      productName,
      adjustment,
      reason: reason || 'No reason provided'
    });

    res.status(200).json({ message: 'Stock adjusted successfully', inventory });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};