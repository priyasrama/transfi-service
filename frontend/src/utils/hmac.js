import CryptoJS from 'crypto-js';

export const generateHMACSignature = (secret, body) => {
  const bodyString = JSON.stringify(body);
    const hash = CryptoJS.HmacSHA256(bodyString, secret);
  
  return hash.toString(CryptoJS.enc.Hex).toLowerCase();
};

