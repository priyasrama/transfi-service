import crypto from 'crypto';
import Merchant from '../models/merchant.js';
import { decrypt } from '../utils/encryption.js';

export const verifyHMAC = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    const signature = req.headers['x-signature'];

    if (!apiKey || !signature) {
      return res.status(401).json({ message: 'Missing API key or signature' });
    }

    const merchant = await Merchant.findOne({ api_key: apiKey });
    if (!merchant) {
      return res.status(401).json({ message: 'Invalid API key' });
    }

    // Decrypt stored secret
    const secret = decrypt(merchant.api_secret);

    // Compute HMAC of request body
    // Use JSON.stringify with no spaces to match frontend
    const bodyString = JSON.stringify(req.body);
    const computedSig = crypto
      .createHmac('sha256', secret)
      .update(bodyString)
      .digest('hex');

    // Debug logging (always show in development)
    console.log('\n=== HMAC Verification ===');
    console.log('API Key:', apiKey);
    console.log('Body received:', JSON.stringify(req.body, null, 2));
    console.log('Body string (for HMAC):', bodyString);
    console.log('Secret length:', secret.length);
    console.log('Secret preview (first 8 + last 8):', secret.substring(0, 8) + '...' + secret.substring(secret.length - 8));
    console.log('Expected signature:', computedSig);
    console.log('Received signature:', signature);
    console.log('Match:', computedSig === signature);
    if (computedSig !== signature) {
      console.log('❌ SIGNATURE MISMATCH - The API Secret being used is incorrect!');
      console.log('   Make sure you are using the exact secret returned when creating the merchant account.');
      console.log('   If you lost the secret, create a new merchant account.');
    }
    console.log('========================\n');

    if (computedSig !== signature) {
      return res.status(403).json({ 
        message: 'Invalid HMAC signature',
        details: process.env.NODE_ENV !== 'production' ? {
          expected: computedSig,
          received: signature,
          body: bodyString
        } : undefined
      });
    }

    // Attach merchant info for downstream use
    req.merchant = merchant;
    next();
  } catch (err) {
    next(err);
  }
};
