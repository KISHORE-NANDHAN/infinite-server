const express = require('express'); 
const User = require('../Schemas/UserSchema'); 
const Post = require('../Schemas/PostSchema');

const router = express.Router();

router.post('/', async (req, res) => {

    try {
        const { username, caption, imageUrl } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username' });
        }

        const newPost = new Post({
            username,
            ProfilePicture: user.profilePicture, 
            image: imageUrl, 
            caption,
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        console.error('Error during post creation:', error);
        res.status(500).json({ message: 'Error creating post', error });
    }
});

module.exports = router;