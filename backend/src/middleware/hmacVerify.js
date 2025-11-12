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

    const secret = decrypt(merchant.api_secret);

    const bodyString = JSON.stringify(req.body);
    const computedSig = crypto
      .createHmac('sha256', secret)
      .update(bodyString)
      .digest('hex');
    

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
    req.merchant = merchant;
    next();
  } catch (err) {
    next(err);
  }
};
