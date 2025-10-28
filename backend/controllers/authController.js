// // backend/controllers/authController.js
// import bcrypt from 'bcryptjs';
// import { db } from '../config/db.js';

// // 🟩 REGISTER USER
// export const register = (req, res) => {
//   console.log('📥 Incoming register data:', req.body);
//   const { name, email, username, password } = req.body;

//   if (!name || !email || !username || !password) {
//     return res.status(400).json({ message: 'All fields are required' });
//   }

//   const checkQuery = 'SELECT * FROM users WHERE email = ? OR username = ?';
//   db.query(checkQuery, [email, username], async (err, result) => {
//     if (err) {
//       console.error('❌ DB check error:', err);
//       return res.status(500).json({ message: 'Database error' });
//     }

//     if (result.length > 0) {
//       return res.status(400).json({ message: 'Email or username already exists' });
//     }

//     try {
//       const hashedPassword = await bcrypt.hash(password, 10);

//       const insertQuery = `
//         INSERT INTO users (name, email, username, password, phone, address)
//         VALUES (?, ?, ?, ?, '', '')
//       `;

//       db.query(insertQuery, [name, email, username, hashedPassword], (err2) => {
//         if (err2) {
//           console.error('❌ Insert error:', err2);
//           return res.status(500).json({ message: 'Error saving user' });
//         }

//         console.log(`✅ User ${username} registered successfully!`);
//         return res.status(201).json({ message: '✅ User registered successfully!' });
//       });
//     } catch (error) {
//       console.error('❌ Hashing error:', error);
//       return res.status(500).json({ message: 'Server error' });
//     }
//   });
// };

// // 🟩 LOGIN USER
// export const login = (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: 'All fields are required' });
//   }

//   const query = 'SELECT * FROM users WHERE username = ?';
//   db.query(query, [username], async (err, results) => {
//     if (err) {
//       console.error('❌ DB error:', err);
//       return res.status(500).json({ message: 'Database error' });
//     }

//     if (results.length === 0) {
//       return res.status(400).json({ message: 'Invalid username or password' });
//     }

//     const user = results[0];
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid username or password' });
//     }

//     res.status(200).json({
//       message: '✅ Login successful!',
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         username: user.username
//       }
//     });
//   });
// };
// backend/controllers/authController.js


import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';

// 🔐 Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    process.env.JWT_SECRET || 'default_secret_key',
    { expiresIn: '1h' } // token valid for 1 hour
  );
};

// 🟩 REGISTER USER
export const register = (req, res) => {
  console.log('📥 Incoming register data:', req.body);
  const { name, email, username, password } = req.body;

  if (!name || !email || !username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const checkQuery = 'SELECT * FROM users WHERE email = ? OR username = ?';
  db.query(checkQuery, [email, username], async (err, result) => {
    if (err) {
      console.error('❌ DB check error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const insertQuery = `
        INSERT INTO users (name, email, username, password, phone, address)
        VALUES (?, ?, ?, ?, '', '')
      `;

      db.query(insertQuery, [name, email, username, hashedPassword], (err2, result2) => {
        if (err2) {
          console.error('❌ Insert error:', err2);
          return res.status(500).json({ message: 'Error saving user' });
        }

        const newUser = {
          id: result2.insertId,
          name,
          email,
          username,
          phone: '',
          address: ''
        };

        // ✅ Generate token after registration
        const token = generateToken(newUser);

        console.log(`✅ User ${username} registered successfully!`);
        return res.status(201).json({
          message: '✅ User registered successfully!',
          token,
          user: newUser
        });
      });
    } catch (error) {
      console.error('❌ Hashing error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
};

// 🟩 LOGIN USER
export const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error('❌ DB error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // ✅ Generate token
    const token = generateToken(user);

    console.log(`✅ User ${username} logged in successfully!`);

    // ✅ Send all user fields including phone & address
    res.status(200).json({
      message: '✅ Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        phone: user.phone || '',
        address: user.address || ''
      }
    });
  });
};
