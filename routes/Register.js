const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../Schemas/UserSchema');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, email, dob, gender, mobile, password, country } = req.body;

        const existingUser = await User.findOne({
            $or: [{ email }, { username }, { mobile }],
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(409).json({ message: 'Email already exists' });
            } else if (existingUser.username === username) {
                return res.status(409).json({ message: 'Username already exists' });
            } else if (existingUser.mobile === mobile) {
                return res.status(409).json({ message: 'Mobile number already exists' });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            dob,
            gender,
            mobile,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Error registering user', error });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        req.session.user = {
            Id : user._id
        };

        res.status(200).json({ message: 'Login successful', user: req.session.user });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Error logging in', error });
    }
});

module.exports = router;
