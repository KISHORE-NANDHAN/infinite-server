const express = require('express');
const User = require('../Schemas/ProfileSchema');
const authenticate = require('../middlewares/auth');

const router = express.Router();

router.get('/details', authenticate, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.session.user.email });
        if (user) {
            res.status(200).json({
                dp: user.dp,
                username: user.username,
                email: user.email,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
