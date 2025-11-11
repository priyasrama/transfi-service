import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access token missing' });

  try {
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attaches user info to req object
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Token expired', code: 'TOKEN_EXPIRED' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Invalid token', code: 'INVALID_TOKEN' });
    }
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
