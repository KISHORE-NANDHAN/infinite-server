const express = require('express');
const session = require('express-session');
const cors = require('cors');
const MongoStore = require('connect-mongo');
require('dotenv').config();
const connectDB = require('./DbConnection/db');

const app = express();

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
app.use('/api/posts', require('./routes/Post')); 

app.use('/api/posts', require('./routes/LikeNComment.js')); 

app.use('/api/users', require('./routes/User.js')); // For user details
app.use('/ProfileUpdate', require('./routes/ProfileUpdate'));
app.use('/getData', require('./routes/GetData'));
app.use('/api/getAllPosts', require('./routes/getAllPosts'));
app.use('/getUsers', require('./routes/SearchUser.js'));



// Start server
const port = process.env.PORT || 3500;
app.listen(port, () => console.log(`Server running on port http://localhost:${port}`));
