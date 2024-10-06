// routes/Comment.js
const express = require('express');
const Post = require('../Schemas/PostSchema'); // Adjust the path to your Post model
const router = express.Router();

// Comment on a post
router.post('/:postId/comment', async (req, res) => {
    try {
        const { userId, username, text } = req.body;
        const post = await Post.findById(req.params.postId);

        const newComment = {
            userId,
            username,
            text,
            time: new Date(),
        };

        post.comments.push(newComment);
        await post.save();

        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

// Export the router
module.exports = router;
