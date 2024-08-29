const express = require('express');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Post = require('../Schemas/PostSchema');
const User = require('../Schemas/ProfileSchema');
const authenticate = require('../middlewares/auth');

const router = express.Router();

const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: (req, file) => ({
        filename: file.originalname,
        bucketName: 'uploads',
    }),
});

const upload = multer({ storage });

router.post('/', authenticate, upload.single('image'), async (req, res) => {
    try {
        const { username, caption } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username' });
        }

        const newPost = new Post({
            username,
            image: req.file.filename,
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
