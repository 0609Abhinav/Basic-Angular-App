import { db } from '../config/db.js';

const User = {
  // 🟢 Find a user by username
  findByUsername: (username, callback) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
      if (err) {
        console.error('❌ Error finding user:', err);
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  // 🟢 Update user profile safely
  updateProfile: (username, data, callback) => {
    console.log('🛠 Updating profile for:', username);
    console.log('📦 Incoming data:', data);

    // Build dynamic update query based on provided fields
    const fields = [];
    const values = [];

    if (data.name) {
      fields.push('name = ?');
      values.push(data.name);
    }
    if (data.email) {
      fields.push('email = ?');
      values.push(data.email);
    }
    if (data.phone) {
      fields.push('phone = ?');
      values.push(data.phone);
    }
    if (data.address) {
      fields.push('address = ?');
      values.push(data.address);
    }

    // If no valid fields to update
    if (fields.length === 0) {
      console.warn('⚠️ No valid fields to update for user:', username);
      return callback(new Error('No valid fields to update'), null);
    }

    const query = `UPDATE users SET ${fields.join(', ')} WHERE username = ?`;
    values.push(username);

    console.log('🧩 Final Query:', query);
    console.log('🧩 Values:', values);

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('❌ Error updating profile:', err);
        return callback(err, null);
      }

      if (result.affectedRows === 0) {
        console.warn('⚠️ No user found to update:', username);
        return callback(null, { message: 'User not found' });
      }

      console.log('✅ Profile updated successfully for:', username);
      callback(null, result);
    });
  },
};

export default User;
