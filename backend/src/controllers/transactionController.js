import crypto from 'crypto';
import axios from 'axios';
import Transaction from '../models/transaction.js';

export const createCheckout = async (req, res, next) => {
  try {
    const { amount, currency, customer_email, metadata } = req.body;

    if (!amount || !customer_email) {
      return res.status(400).json({ message: 'Amount and customer email are required' });
    }

    const transaction = await Transaction.create({
      merchant_id: req.merchant._id,
      amount,
      currency,
      customer_email,
      metadata,
      status: 'pending',
    });

    // Create signature for transaction confirmation
    const signaturePayload = `${transaction._id}|${amount}`;
    const signature = crypto
      .createHmac('sha256', process.env.HMAC_SECRET || 'dummy')
      .update(signaturePayload)
      .digest('hex');

    transaction.signature = signature;
    await transaction.save();

    res.status(201).json({
      message: 'Checkout session created',
      transaction_id: transaction._id,
      signature,
      status: transaction.status,
    });
  } catch (err) {
    next(err);
  }
};

export const processPayment = async (req, res, next) => {
  try {
    const { transaction_id } = req.body;

    const transaction = await Transaction.findById(transaction_id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    // Simulate random payment result
    const success = Math.random() > 0.2; // 80% success rate
    transaction.status = success ? 'success' : 'failed';
    await transaction.save();

    // Notify merchant via webhook (mock)
    if (process.env.WEBHOOK_URL) {
      await axios.post(process.env.WEBHOOK_URL, {
        transaction_id: transaction._id,
        status: transaction.status,
        amount: transaction.amount,
      });
    }

    res.json({
      message: 'Payment processed',
      transaction_id: transaction._id,
      status: transaction.status,
    });
  } catch (err) {
    next(err);
  }
};


export const getHistory = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ merchant_id: req.merchant._id })
      .sort({ createdAt: -1 });

    res.json({
      total: transactions.length,
      transactions,
    });
  } catch (err) {
    next(err);
  }
};

export const webhook = async (req, res, next) => {
  try {
    console.log('Webhook received:', req.body);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

