const express = require('express');
const User = require('../Schemas/UserSchema'); 
const Post = require('../Schemas/PostSchema');
const mongoose = require('mongoose');
const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;

// Route to get user data by ID
router.get('/user', async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'ID is required' });
  }

  // Check if the id is a valid ObjectId
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    // Fetch the user by ID and exclude the password
    const user = await User.findById(new ObjectId(id)).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user); // Return the user data
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/posts', async (req, res) => {
  const { id } = req.query; // This should match the parameter sent from the frontend

  if (!id) {
    return res.status(400).json({ message: 'ID is required' });
  }

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    // Step 1: Fetch the user by ID to get their username
    const user = await User.findById(new ObjectId(id)).select('username');

    // If user exists, proceed to fetch the posts
    if (user) {
        // Step 2: Use the username to find the user's ID again
        const userByUsername = await User.findOne({ username: user.username });

        if (userByUsername) {
            // Step 3: Fetch posts using the user's ID
            const posts = await Post.find({ user: userByUsername._id }).sort({ createdAt: -1 });
            return res.json(posts);
        } else {
            return res.status(404).json({ message: 'User not found by username' });
        }
    } else {
        return res.status(404).json({ message: 'User not found' });
    }
} catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error' });
}

});



module.exports = router;
