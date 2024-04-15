const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let timer;

// Store active room connections
const roomConnections = {};

io.on('connection', (socket) => {
  socket.on('join-room', (room) => {
    socket.join(room);
    roomConnections[room] = roomConnections[room] || [];
    roomConnections[room].push(socket);

    // Reset the idle timer when a client joins the room
    clearTimeout(timer);
    timer = setTimeout(shutdownServer, 60000); // 1 minute idle timeout
  });

  socket.on('message', (data) => {
    const { room, message } = data;
    io.to(room).emit('message', message);
  });

  socket.on('disconnect', () => {
    for (const room in roomConnections) {
      const index = roomConnections[room].indexOf(socket);
      if (index !== -1) {
        roomConnections[room].splice(index, 1);
      }
    }
  });
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle the root URL with the "index.html" file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 1234;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function shutdownServer() {
  console.log('Server is shutting down due to inactivity.');
  server.close(() => {
    console.log('Server has been shut down.');
  });
}
