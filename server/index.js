const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const server = http.createServer(app);

// Configure CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}));

app.use(express.json());

// Register API Routes
app.use('/api', apiRoutes);

// Real-Time Socket.io Live Chat
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  // Join specific conversation room
  socket.on('join_conversation', (conversationId) => {
    socket.join(conversationId);
  });

  // Broadcast new message to conversation room
  socket.on('send_message', (data) => {
    // data: { conversationId, message }
    io.to(data.conversationId).emit('receive_message', data.message);
    // Broadcast notification to admin dashboard
    io.emit('new_inquiry_notification', {
      conversationId: data.conversationId,
      message: data.message
    });
  });

  // Typing indicator
  socket.on('typing', (data) => {
    socket.to(data.conversationId).emit('user_typing', data);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚗 DriveHub API Server running on port ${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`⚡ WebSocket Real-Time Chat Ready`);
  console.log(`=========================================`);
});
