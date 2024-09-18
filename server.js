const express = require('express');
const session = require('express-session');
const cors = require('cors');
const MongoStore = require('connect-mongo');
require('dotenv').config();
const connectDB = require('./DbConnection/db');

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions',
    }),
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
}));

// Routes
app.use('/auth', require('./routes/Register'));
app.use('/posts', require('./routes/Post'));
app.use('/users', require('./routes/Users'));

// Start server
const port = process.env.PORT;
app.listen(port, () => console.log(`Server running on port ${port}`));
