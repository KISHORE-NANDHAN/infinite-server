const express = require('express');
const Post = require('../Schemas/PostSchema'); 
const router = express.Router();

// Fetch posts from the last 30 days
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ time: -1 }); 

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

module.exports = router;
