const express = require('express');
const User = require('../Schemas/UserSchema'); 
const Post = require('../Schemas/PostSchema');
const mongoose = require('mongoose');
const router = express.Router();

// Updated search endpoint
router.get('/', async (req, res) => {
  try {
    const searchQuery = req.query.q || ''; // Get search query from request query parameters
    if (searchQuery.length < 4) {
      return res.status(400).json({ message: 'Please enter at least 4 characters for search.' });
    }

    // Fetch only the _id, username, and profilePicture fields
    const users = await User.find({
      username: { $regex: searchQuery, $options: 'i' } // Case-insensitive search
    })
    .select('_id username bio profilePicture followers following') // Only return these fields
    .limit(10); // Fetch top 10 matching users

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/posts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const posts = await Post.find({ user: new mongoose.Types.ObjectId(id)}) // Assuming 'user' is a reference to User in PostSchema
      .populate('user', 'username profilePicture') // Populate user info in posts
      .select('image caption createdAt'); // Select the fields you want to return

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
module.exports = router;
