import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    unique: true
  },
  stockQuantity: {
    type: Number,
    required: true,
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  lastRestocked: {
    type: Date,
    default: Date.now
  },
  supplier: {
    type: String,
    trim: true
  }
}, { timestamps: true });

export default mongoose.model('Inventory', inventorySchema);