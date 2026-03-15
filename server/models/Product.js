import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  supplier: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);