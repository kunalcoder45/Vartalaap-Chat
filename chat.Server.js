// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const {
    addOnlineUser,
    removeOnlineUser,
    getOnlineUsers,
    isUserOnline
} = require('./utils/connectedUsers');

const app = express();

// CORS for REST APIs
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

const server = http.createServer(app);

// CORS for socket.io
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
    }
});


// REST route
app.get('/api/online-users', (req, res) => {
    res.json(getOnlineUsers());
});

app.get('/', (req, res) => {
    res.send('Chat Server is running');
});

// SOCKET.IO
io.on('connection', (socket) => {


    const userId = socket.handshake.auth?.userId;
    socket.on('typing', (data) => {
        socket.broadcast.emit('typingForUI', data);
    });
    if (userId) {
        console.log(`✅ ${userId} connected with socket ${socket.id}`);
        addOnlineUser(userId, socket.id);
        io.emit('user-online', userId);
    }

    socket.on('disconnect', () => {
        console.log(`❌ Socket ${socket.id} disconnected`);
        removeOnlineUser(socket.id);
        if (userId) {
            io.emit('user-offline', userId);
            // Also notify typing stopped on disconnect to clean UI
            socket.broadcast.emit('user-typing', { userId, isTyping: false });
        }
    });
});

const PORT = process.env.CHATPORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
