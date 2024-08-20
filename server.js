const express = require('express');
const app = express();
const port = 3500;
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcrypt');

// Import the User model from your schema
const User = require('./Schemas/SignupSchema');

// MongoDB connection URL
const mongo_url = 'mongodb+srv://KishoreNandhan:manager@socia-media.rze53kg.mongodb.net/?retryWrites=true&w=majority&appName=socia-media';

// Middleware to parse JSON bodies
app.use(express.json());

// CORS configuration
const whitelist = ['http://localhost:3000', 'https://domain.com'];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions));

// Route to handle user registration
app.post('/register', async (req, res) => {
    try {
        const { username, email, dob, gender, mobile, password } = req.body;

        // Check if email, username, or mobile already exists
        const existingUser = await User.findOne({
            $or: [
                { email: email },
                { username: username },
                { mobile: mobile }
            ]
        });

        if (existingUser) {
            // Check what field already exists
            if (existingUser.email === email) {
                return res.status(409).json({ message: 'Email already exists' });
            } else if (existingUser.username === username) {
                return res.status(409).json({ message: 'Username already exists' });
            } else if (existingUser.mobile === mobile) {
                return res.status(409).json({ message: 'Mobile number already exists' });
            }
        }

        // Create a new user
        const newUser = new User({
            username,
            email,
            dob,
            gender,
            mobile,
            password,
        });

        // Save the user to the database
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// Route to handle user login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare the password using bcrypt directly
        const isValidPassword = user.password === password;
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // If valid, respond with a success message
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Error logging in', error });
    }
});

// Connect to MongoDB and start the server
mongoose.connect(process.env.mongo_uri || mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB database');
    app.listen(port, () => console.log(`Server is live at ${port}`));
})
.catch(err => console.error('MongoDB connection error:', err));
