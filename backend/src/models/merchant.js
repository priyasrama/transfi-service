import mongoose from 'mongoose';

const merchantSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  business_name: {
    type: String,
    required: true,
  },
  api_key: {
    type: String,
    unique: true,
  },
  api_secret: {
    type: String, // encrypted before saving
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
}, { timestamps: true });

export default mongoose.model('Merchant', merchantSchema);
