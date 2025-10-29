
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    //  Check if Authorization header exists
    if (!authHeader) {
      console.warn(' No Authorization header found');
      return res.status(401).json({ message: 'No token provided' });
    }

    //  Check for Bearer format
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      console.warn(' Invalid Authorization format');
      return res.status(401).json({ message: 'Invalid token format' });
    }

    const token = parts[1];
    if (!token) {
      console.warn(' Token missing after Bearer');
      return res.status(401).json({ message: 'Token missing' });
    }

    // Verify the token
    const secret = process.env.JWT_SECRET || 'default_secret_key';
    const decoded = jwt.verify(token, secret);

    //  Attach user info to request for later use
    req.user = decoded;
    // console.log(' Token verified for user:', decoded);

    next(); // continue to next middleware or route
  } catch (err) {
    // console.error(' Token verification failed:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
