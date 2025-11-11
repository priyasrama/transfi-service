import crypto from 'crypto';
import mongoose from 'mongoose';
import Merchant from '../models/merchant.js';
import Transaction from '../models/transaction.js';
import { encrypt, decrypt } from '../utils/encryption.js';

export const createMerchant = async (req, res, next) => {
  try {
    const { business_name } = req.body;
    if (!business_name) {
      return res.status(400).json({ message: 'Business name required' });
    }

    const api_key = crypto.randomBytes(16).toString('hex');
    const api_secret = crypto.randomBytes(32).toString('hex');

    const encryptedSecret = encrypt(api_secret);

    const merchant = await Merchant.create({
      user_id: new mongoose.Types.ObjectId(req.user.id),
      business_name,
      api_key,
      api_secret: encryptedSecret,
    });

    res.status(201).json({
      message: 'Merchant account created',
      merchant_id: merchant._id,
      api_key,
      api_secret,
    });
  } catch (err) {
    next(err);
  }
};

export const getMerchantKeys = async (req, res, next) => {
  try {
    const merchant = await Merchant.findOne({ user_id: new mongoose.Types.ObjectId(req.user.id) });
    if (!merchant) return res.status(404).json({ message: 'Merchant not found' });

    res.json({
      business_name: merchant.business_name,
      api_key: merchant.api_key,
      status: merchant.status,
      created_at: merchant.createdAt,
    });
  } catch (err) {
    next(err);
  }
};

export const rotateKeys = async (req, res, next) => {
  try {
    const merchant = await Merchant.findOne({ user_id: new mongoose.Types.ObjectId(req.user.id) });
    if (!merchant) return res.status(404).json({ message: 'Merchant not found' });

    const newKey = crypto.randomBytes(16).toString('hex');
    const newSecret = crypto.randomBytes(32).toString('hex');
    const encrypted = encrypt(newSecret);

    merchant.api_key = newKey;
    merchant.api_secret = encrypted;
    await merchant.save();

    res.json({
      message: 'API keys rotated successfully',
      new_api_key: newKey,
      new_api_secret: newSecret,
    });
  } catch (err) {
    next(err);
  }
};

export const getMerchantStats = async (req, res, next) => {
  try {
    const merchant = await Merchant.findOne({ user_id: new mongoose.Types.ObjectId(req.user.id) });
    if (!merchant) return res.status(404).json({ message: 'Merchant not found' });

    const stats = await Transaction.aggregate([
      { $match: { merchant_id: merchant._id } },
      {
        $group: {
          _id: '$status',
          total: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    res.json(stats);
  } catch (err) {
    next(err);
  }
};

export const getMerchantTransactions = async (req, res, next) => {
  try {
    const merchant = await Merchant.findOne({ user_id: new mongoose.Types.ObjectId(req.user.id) });
    if (!merchant) return res.status(404).json({ message: 'Merchant not found' });

    const transactions = await Transaction.find({ merchant_id: merchant._id })
      .sort({ createdAt: -1 })
      .limit(100); // Limit to recent 100 transactions

    res.json({
      total: transactions.length,
      transactions,
    });
  } catch (err) {
    next(err);
  }
};
