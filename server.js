const express = require('express');
const session = require('express-session');
const cors = require('cors');
const MongoStore = require('connect-mongo');
require('dotenv').config();
const connectDB = require('./DbConnection/db');
const User = require('./Schemas/UserSchema.js');
const http = require('http'); // Import the http module

const app = express();
connectDB();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
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
app.use('/api/users', require('./routes/User.js'));
app.use('/ProfileUpdate', require('./routes/ProfileUpdate'));
app.use('/getData', require('./routes/GetData'));
app.use('/api/getAllPosts', require('./routes/getAllPosts'));
app.use('/getUsers', require('./routes/SearchUser.js'));
app.use('/api/notifications', require('./routes/Notifications.js'));
app.use('/api/AdminPowers', require('./routes/AdminHandle.js'));

app.post('/fetchUsers', async (req, res) => {
    const { ids } = req.body;
    console.log(req.body);
    if (!ids || ids.length === 0) {
        return res.status(400).json({ message: 'No IDs provided' });
    }

    try {
        const users = await User.find({ _id: { $in: ids } })
            .select('username profilePicture')
            .lean();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Create an HTTP server using the app
const server = http.createServer(app);

// Initialize Socket.IO with the HTTP server
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000', // Update with your frontend address if different
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join a specific room based on the chat ID
    socket.on('join room', ({ roomId, username }) => {
        socket.join(roomId);
        console.log(`${username} joined room: ${roomId}`);
    });

    // Handle leaving the room
    socket.on('leave room', (roomId) => {
        socket.leave(roomId);
        console.log(`User left room: ${roomId}`);
    });

    // Listen for chat messages and broadcast them to the specific room
    socket.on('chat message', ({ roomId, name, message }) => {
        io.to(roomId).emit('receive message', { name, message });
        console.log(`Message from ${name} in room ${roomId}: ${message}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start the server
const port = process.env.PORT || 3500;
server.listen(port, () => console.log(`Server running on port http://localhost:${port}`));
