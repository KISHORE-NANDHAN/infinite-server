const express = require('express');
const router = express.Router();
const Post = require('../Schemas/PostSchema');
const User = require('../Schemas/UserSchema');
const mongoose = require('mongoose');

// Middleware to check if the ObjectId is valid (optional)
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const ObjectId = mongoose.Types.ObjectId;

// Like/Unlike Post
router.post('/:postId/like', async (req, res) => {
    const userId = req.body.currentUserId; 
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

// Comment on a Post
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
        }

        const newComment = {
            pfp, 
            user: userId, // Use 'user' key instead of 'userId' for consistency with the schema
            username: username,
            text,
            time: new Date(),
        };

        post.comments.push(newComment);
        await post.save();

        // Return updated comments
        res.json({ comments: post.comments });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Failed to add comment' });
    }
});
//user post delete
router.delete('/:postid',async (req,res)=>{

    try{
        const post = await Post.findByIdAndDelete(new mongoose.Types.ObjectId(req.params.postid));
        if(!post){
            return res.status(404).json({message:'Post not found'});
        }
        res.json({message:'Post deleted'});
        }catch(error){
            console.log(error);
             res.status(500).json({message:'Failed to delete post'});
        }
})
// Edit a comment
router.put('/:postId/comment/:commentId', async (req, res) => {
    try {
      const { text, userId } = req.body;
      const post = await Post.findById(req.params.postId);
  
      const comment = post.comments.id(req.params.commentId);
      if (comment.userId.toString() === userId) {
        comment.text = text; // Update the comment text
        await post.save();
        res.status(200).json({ message: 'Comment edited successfully', comments: post.comments });
      } else {
        res.status(403).json({ message: 'You can only edit your own comments' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error editing comment', error });
    }
  });
  
  // Delete a comment
  router.delete('/:postId/comment/:commentId', async (req, res) => {
    try {
      const { userId } = req.body;
      const post = await Post.findById(req.params.postId);
  
      const comment = post.comments.id(req.params.commentId);
      if (comment.userId.toString() === userId) {
        comment.remove(); // Remove the comment
        await post.save();
        res.status(200).json({ message: 'Comment deleted successfully', comments: post.comments });
      } else {
        res.status(403).json({ message: 'You can only delete your own comments' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting comment', error });
    }
  });
module.exports = router;
