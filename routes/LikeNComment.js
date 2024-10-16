const express = require('express');
const router = express.Router();
const Post = require('../Schemas/PostSchema');
const User = require('../Schemas/UserSchema');
const mongoose = require('mongoose');

// Middleware to check if the ObjectId is valid (optional)
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const  ObjectId = mongoose.Types.ObjectId;

// Like/Unlike Post
router.post('/:postId/like', async (req, res) => {
    const userId  = req.body.currentUserId; 
    const postId = req.params.postId;

    if (!isValidObjectId(postId) || !isValidObjectId(userId)) {
        return res.status(400).json({ message: 'Invalid post ID or user ID' });
    }

    try {
        const post = await Post.findById(new ObjectId(postId));
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user has already liked the post
        const hasLiked = post.likes.includes(new ObjectId(userId));

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
router.post('/:postId/comment', async (req, res) => {
    const { userId, username, text, pfp } = req.body;
    // Validate postId
    if (!isValidObjectId(req.params.postId) || !isValidObjectId(userId)) {
        return res.status(400).json({ message: 'Invalid post ID or user ID' });
    }

    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }c
        const newComment = {
            pfp, 
            user: userId, // Use 'user' key instead of 'userId' for consistency with the schema
            username : username,
            text,
            time: new Date(),
        };

        post.comments.push(newComment);
        await post.save();

        // Return updated comments
        res.json({ comments: post.comments });
        console.log(post.comments);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Failed to add comment' });
    }
});

module.exports = router;
