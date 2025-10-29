import User from "../models/userModel.js";

export const getProfile = (req, res) => {
  try {
    const username = req.user?.username;

    if (!username) {
      return res.status(401).json({ message: "Unauthorized: No username found in token" });
    }

    User.findByUsername(username, (err, result) => {
      if (err) {
        console.error(" Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (!result || result.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = result[0];
      delete user.password;

      // // LOG RAW VALUE FIRST
      // console.log(" Raw phone from DB:", user.phone);

      //  Handle MySQL JSON, string, or null safely
      if (user.phone === null || user.phone === undefined) {
        user.phone = [];
      } else if (typeof user.phone === "object" && Array.isArray(user.phone)) {
        // Already parsed JSON (MySQL JSON column)
        user.phone = user.phone;
      } else if (typeof user.phone === "string") {
        try {
          const parsed = JSON.parse(user.phone);
          user.phone = Array.isArray(parsed) ? parsed : [parsed];
        } catch (err) {
          console.warn(" Invalid JSON format in DB:", err.message);
          user.phone = [user.phone];
        }
      } else {
        user.phone = [];
      }

      // console.log(` Final phone for ${username}:`, user.phone);

      res.status(200).json(user);
    });
  } catch (error) {
    console.error(" Server error in getProfile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
//  UPDATE PROFILE
export const updateProfile = (req, res) => {
  try {
    const username = req.user?.username;
    if (!username) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { name, email, address, phoneNumbers } = req.body;

    // Ensure proper keys are used
    const updatedData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(address && { address }),
    };

    //  Convert phoneNumbers array → JSON string
    if (Array.isArray(phoneNumbers)) {
      updatedData.phone = JSON.stringify(phoneNumbers);
    }

    // console.log(' Updating profile for:', username, updatedData);

    User.updateProfile(username, updatedData, (err, result) => {
      if (err) {
        console.error(' Error updating profile:', err);
        return res.status(500).json({ message: 'Database update failed' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      // console.log(` Profile updated for ${username}`);
      res.status(200).json({ message: 'Profile updated successfully' });
    });
  } catch (error) {
    console.error(' updateProfile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
