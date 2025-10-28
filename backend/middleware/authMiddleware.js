// import jwt from 'jsonwebtoken';

// export const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).json({ message: 'No token provided' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid or expired token' });
//   }
// };


// backend/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    // 1️⃣ Check if Authorization header exists
    if (!authHeader) {
      console.warn('🚫 No Authorization header found');
      return res.status(401).json({ message: 'No token provided' });
    }

    // 2️⃣ Check for Bearer format
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      console.warn('🚫 Invalid Authorization format');
      return res.status(401).json({ message: 'Invalid token format' });
    }

    const token = parts[1];
    if (!token) {
      console.warn('🚫 Token missing after Bearer');
      return res.status(401).json({ message: 'Token missing' });
    }

    // 3️⃣ Verify the token
    const secret = process.env.JWT_SECRET || 'default_secret_key';
    const decoded = jwt.verify(token, secret);

    // 4️⃣ Attach user info to request for later use
    req.user = decoded;
    console.log('✅ Token verified for user:', decoded);

    next(); // continue to next middleware or route
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
