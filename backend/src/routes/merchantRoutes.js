import express from 'express';
import {
  createMerchant,
  getMerchantKeys,
  rotateKeys,
  getMerchantTransactions,
  getMerchantStats,
} from '../controllers/merchantController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/create', authenticate, createMerchant);
router.get('/keys', authenticate, getMerchantKeys);
router.post('/rotate', authenticate, rotateKeys);
router.get('/transactions', authenticate, getMerchantTransactions);
router.get('/stats', authenticate, getMerchantStats);

export default router;
