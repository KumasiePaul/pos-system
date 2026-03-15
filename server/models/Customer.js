import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  loyaltyPoints: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model('Customer', customerSchema);