import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';
import * as XLSX from 'xlsx';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create product
export const createProduct = async (req, res) => {
  try {
    const { name, category, price, quantity, barcode, supplier, description } = req.body;

    const product = await Product.create({
      name,
      category,
      price,
      quantity,
      barcode,
      supplier,
      description
    });

    // Automatically create an inventory record for the new product
    await Inventory.create({
      product: product._id,
      stockQuantity: quantity,
      lowStockThreshold: 10,
      supplier: supplier || ''
    });

    const actor = await User.findById(req.user.id).select('name');
    const targetRole = req.user.role === 'admin' ? 'manager' : 'admin';
    await Notification.create({
      targetRole,
      type: 'product_created',
      title: 'New Product Added',
      message: `"${name}" has been added to the product catalog with an initial stock of ${quantity} unit(s).`,
      adjustedBy: { name: actor?.name || req.user.role, role: req.user.role },
      productName: name,
      adjustment: quantity,
      reason: `New product added to catalog`
    });

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Keep inventory quantity in sync if quantity was changed
    if (req.body.quantity !== undefined) {
      await Inventory.findOneAndUpdate(
        { product: product._id },
        { stockQuantity: req.body.quantity }
      );
    }

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Also remove the inventory record for this product
    await Inventory.findOneAndDelete({ product: req.params.id });

    const actor = await User.findById(req.user.id).select('name');
    await Notification.create({
      targetRole: 'manager',
      type: 'product_deleted',
      title: 'Product Removed',
      message: `"${product.name}" has been permanently removed from the product catalog.`,
      adjustedBy: { name: actor?.name || 'Admin', role: req.user.role },
      productName: product.name,
      adjustment: 0,
      reason: `Product deleted from catalog`
    });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Bulk import products from Excel/CSV
export const bulkImportProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    if (rows.length === 0) {
      return res.status(400).json({ message: 'File is empty or has no valid rows' });
    }

    const imported = [];
    const skipped = [];

    for (const row of rows) {
      const name = row['name'] || row['Name'] || row['NAME'];
      const category = row['category'] || row['Category'] || row['CATEGORY'];
      const price = Number(row['price'] || row['Price'] || row['PRICE']);
      const quantity = Number(row['quantity'] || row['Quantity'] || row['QUANTITY'] || 0);
      const barcode = String(row['barcode'] || row['Barcode'] || row['BARCODE'] || '').trim();
      const supplier = row['supplier'] || row['Supplier'] || row['SUPPLIER'] || '';
      const description = row['description'] || row['Description'] || row['DESCRIPTION'] || '';

      if (!name || !category || !price) {
        skipped.push({ row: name || 'Unknown', reason: 'Missing required fields (name, category, price)' });
        continue;
      }

      // Skip duplicate barcode if one is provided
      if (barcode) {
        const existing = await Product.findOne({ barcode });
        if (existing) {
          skipped.push({ row: name, reason: `Barcode "${barcode}" already exists` });
          continue;
        }
      }

      const product = await Product.create({
        name, category, price, quantity,
        barcode: barcode || undefined,
        supplier, description
      });

      await Inventory.create({
        product: product._id,
        stockQuantity: quantity,
        lowStockThreshold: 10,
        supplier: supplier || ''
      });

      imported.push(name);
    }

    if (imported.length > 0) {
      const actor = await User.findById(req.user.id).select('name');
      const targetRole = req.user.role === 'admin' ? 'manager' : 'admin';
      await Notification.create({
        targetRole,
        type: 'product_bulk_import',
        title: 'Bulk Product Import',
        message: `${imported.length} product(s) were imported from a file${skipped.length > 0 ? `, ${skipped.length} skipped` : ''}.`,
        adjustedBy: { name: actor?.name || req.user.role, role: req.user.role },
        productName: `${imported.length} products`,
        adjustment: imported.length,
        reason: `Bulk import from file`
      });
    }

    res.status(200).json({
      message: `Import complete`,
      imported: imported.length,
      skipped: skipped.length,
      skippedDetails: skipped
    });
  } catch (error) {
    res.status(500).json({ message: 'Import failed', error: error.message });
  }
};

// Get product by barcode (exact match)
export const getProductByBarcode = async (req, res) => {
  try {
    const product = await Product.findOne({ barcode: req.params.barcode });
    if (!product) {
      return res.status(404).json({ message: 'No product found with this barcode' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Search products
export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { barcode: { $regex: query, $options: 'i' } }
      ]
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};