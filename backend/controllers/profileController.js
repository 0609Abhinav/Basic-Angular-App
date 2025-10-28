// import User from '../models/userModel.js';

// // 🧩 Get Profile
// export const getProfile = (req, res) => {
//   const username = req.user.username;

//   User.findByUsername(username, (err, result) => {
//     if (err) return res.status(500).json({ message: 'Database error' });
//     if (result.length === 0) return res.status(404).json({ message: 'User not found' });

//     const user = result[0];
//     delete user.password;
//     res.json(user);
//   });
// };

// // 🧩 Update Profile
// export const updateProfile = (req, res) => {
//   const username = req.user.username;
//   const updatedData = req.body;

//   User.updateProfile(username, updatedData, (err, result) => {
//     if (err) return res.status(500).json({ message: 'Error updating profile' });
//     res.json({ message: 'Profile updated successfully' });
//   });
// };


import User from '../models/userModel.js';

// 🟩 GET PROFILE
export const getProfile = (req, res) => {
  try {
    const username = req.user.username; // ✅ Comes from verified JWT

    if (!username) {
      return res.status(401).json({ message: 'Unauthorized: No username found in token' });
    }

    User.findByUsername(username, (err, result) => {
      if (err) {
        console.error('❌ Database error:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = result[0];
      delete user.password; // ✅ Hide sensitive info

      console.log(`📤 Sending profile for ${username}`);
      res.status(200).json(user);
    });
  } catch (error) {
    console.error('❌ Server error in getProfile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 🟩 UPDATE PROFILE
export const updateProfile = (req, res) => {
  try {
    const username = req.user.username; // ✅ Comes from JWT
    const { name, email, phone, address } = req.body;

    if (!username) {
      return res.status(401).json({ message: 'Unauthorized: Missing username' });
    }

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const updatedData = {
      name,
      email,
      phone: phone || '',
      address: address || ''
    };

    console.log('📥 Updating profile for:', username, updatedData);

    User.updateProfile(username, updatedData, (err, result) => {
      if (err) {
        console.error('❌ Error updating profile:', err);
        return res.status(500).json({ message: 'Error updating profile' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      console.log(`✅ Profile updated successfully for ${username}`);
      res.status(200).json({ message: 'Profile updated successfully' });
    });
  } catch (error) {
    console.error('❌ Server error in updateProfile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
