import CryptoJS from 'crypto-js';

/**
 * Generate HMAC SHA256 signature for API requests
 * Matches backend's signature generation exactly
 * @param {string} secret - Merchant API secret (must be the decrypted secret)
 * @param {object} body - Request body object
 * @returns {string} - HMAC signature in hex format
 */
export const generateHMACSignature = (secret, body) => {
  // Ensure consistent JSON stringification (no spaces, sorted keys)
  // This matches what Express body-parser sends to the middleware
  const bodyString = JSON.stringify(body);
  
  // Generate HMAC SHA256 signature
  const hash = CryptoJS.HmacSHA256(bodyString, secret);
  
  // Return as hex string (lowercase, matching Node.js crypto output)
  return hash.toString(CryptoJS.enc.Hex).toLowerCase();
};

