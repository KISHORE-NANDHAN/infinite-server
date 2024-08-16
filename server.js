const express = require('express');
const app = express();
const port = 3500;
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

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
        console.error(error);
        res.status(500).json({ message: 'Error registering user', error });
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
