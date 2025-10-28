// backend/config/db.js
import mysql from 'mysql2';

export const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',          // 🔧 change if your MySQL username is different
  password: '123456789',          // 🔧 enter your password if any
  database: 'angular_app' // 🔧 replace with your actual database name
});

db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Connected to MySQL database');
  }
});
