const express = require('express');
const router = express.Router();
const Post = require('../Schemas/PostSchema');
const mongoose = require('mongoose');

// Middleware to check if the ObjectId is valid (optional)
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Like/Unlike Post
router.post('/:postId/like', async (req, res) => {
    const { userId } = req.body; // userId from the request body
    const postId = req.params.postId;

    // Validate postId
    if (!isValidObjectId(postId) || !isValidObjectId(userId)) {
        return res.status(400).json({ message: 'Invalid post ID or user ID' });
    }

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user has already liked the post
        const hasLiked = post.likes.includes(userId);

        if (hasLiked) {
            // If user has already liked the post, unlike it
            post.likes = post.likes.filter(id => id.toString() !== userId);
        } else {
            // Otherwise, like the post
            post.likes.push(userId);
        }

        await post.save();

        res.json({ likes: post.likes, message: hasLiked ? 'Post unliked' : 'Post liked' });
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ message: 'Failed to like/unlike post' });
    }
});

module.exports = router;
