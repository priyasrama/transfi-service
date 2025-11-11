export const verifyHMAC = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const signature = req.headers['x-signature'];
  const merchant = await merchant.findOne({ api_key: apiKey });
  if (!merchant) return res.status(401).json({ message: 'Invalid key' });

  const body = JSON.stringify(req.body);
  const computed = crypto.createHmac('sha256', merchant.api_secret).update(body).digest('hex');

  if (computed !== signature) return res.status(403).json({ message: 'Invalid signature' });
  req.merchant = merchant;
  next();
};