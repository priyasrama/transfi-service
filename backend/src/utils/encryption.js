import CryptoJS from 'crypto-js';


const getEncryptionKey = () => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY is not configured. Please ensure .env file is loaded and contains ENCRYPTION_KEY');
  }
  return key;
};

export const encrypt = (text) => {
  const ENC_KEY = getEncryptionKey();
  return CryptoJS.AES.encrypt(text, ENC_KEY).toString();
};

export const decrypt = (ciphertext) => {
  const ENC_KEY = getEncryptionKey();
  const bytes = CryptoJS.AES.decrypt(ciphertext, ENC_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
