import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  sale: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sale',
    required: true
  },
  method: {
    type: String,
    enum: ['cash', 'mobile_money', 'card'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  change: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['successful', 'failed', 'pending'],
    default: 'successful'
  },
  reference: {
    type: String,
    trim: true
  }
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);