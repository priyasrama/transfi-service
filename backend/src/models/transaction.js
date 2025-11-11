import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  merchant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Merchant',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending',
  },
  customer_email: {
    type: String,
    required: true,
  },
  metadata: {
    type: Object,
    default: {},
  },
  signature: {
    type: String,
  },
}, { timestamps: true });

transactionSchema.index({ merchant_id: 1, createdAt: -1 }); // useful for analytics

export default mongoose.model('Transaction', transactionSchema);
