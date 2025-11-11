import express from 'express';
import {
  createCheckout,
  processPayment,
  getHistory,
  webhook,
} from '../controllers/transactionController.js';
import { verifyHMAC } from '../middleware/hmacVerify.js';

const router = express.Router();

// Test endpoint to verify HMAC (development only)
if (process.env.NODE_ENV !== 'production') {
  router.post('/test-hmac', (req, res) => {
    const { apiKey, body, signature } = req.body;
    // This is just for testing - in real flow, use verifyHMAC middleware
    res.json({
      message: 'Test endpoint - check backend logs for HMAC verification details',
      received: { apiKey, body, signature }
    });
  });
}

// All merchant API calls are signed and verified
router.post('/checkout-session', verifyHMAC, createCheckout);
router.post('/process', verifyHMAC, processPayment);
router.get('/history', verifyHMAC, getHistory);
router.post('/webhook', webhook);

export default router;
