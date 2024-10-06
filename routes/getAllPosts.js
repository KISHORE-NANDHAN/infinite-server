const express = require('express');
const router = express.Router();
const Post = require('../Schemas/PostSchema'); // Import the Post model

router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); 

    const posts = await Post.find({
      createdAt: { $gte: start, $lte: end }
    }).sort({ createdAt: -1 }); // Sorting by newest first

    // Return the posts
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
