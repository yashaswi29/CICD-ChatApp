const express = require('express');
const http = require('http');
const socketIo = require('socket.io'); // Import the socket.io library
const path = require('path'); // Import the path module

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Create a socket.io instance using the server

// Store active room connections
const roomConnections = {};

io.on('connection', (socket) => {
  socket.on('join-room', (room) => {
    socket.join(room);
    roomConnections[room] = roomConnections[room] || [];
    roomConnections[room].push(socket);
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

const PORT = process.env.PORT || 12345;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Automatically shut down the server after 60 seconds
  setTimeout(() => {
    console.log('Shutting down server...');
    server.close();
  }, 60000);
});
