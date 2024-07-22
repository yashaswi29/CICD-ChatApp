const express = require('express');
const http = require('http');
<<<<<<< HEAD
const socketIo = require('socket.io'); // Import the socket.io library
const path = require('path'); // Import the path module

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Create a socket.io instance using the server
=======
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const INACTIVITY_TIMEOUT = 300000; // 300,000 milliseconds = 5 minutes
let inactivityTimeout;
>>>>>>> origin/feature

// Store active room connections
const roomConnections = {};

io.on('connection', (socket) => {
<<<<<<< HEAD
=======
  resetInactivityTimeout();

>>>>>>> origin/feature
  socket.on('join-room', (room) => {
    socket.join(room);
    roomConnections[room] = roomConnections[room] || [];
    roomConnections[room].push(socket);
<<<<<<< HEAD
=======
    resetInactivityTimeout();
>>>>>>> origin/feature
  });

  socket.on('message', (data) => {
    const { room, message } = data;
    io.to(room).emit('message', message);
<<<<<<< HEAD
=======
    resetInactivityTimeout();
  });

  socket.on('play-sound', (data) => {
    const { room } = data;
    io.to(room).emit('play-sound');
    resetInactivityTimeout();
>>>>>>> origin/feature
  });

  socket.on('disconnect', () => {
    for (const room in roomConnections) {
      const index = roomConnections[room].indexOf(socket);
      if (index !== -1) {
        roomConnections[room].splice(index, 1);
      }
    }
  });
<<<<<<< HEAD
=======

  socket.on('any-activity', resetInactivityTimeout); // Custom event to reset the timer on any activity
>>>>>>> origin/feature
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

<<<<<<< HEAD
=======
app.use((req, res, next) => {
  resetInactivityTimeout();
  next();
});

>>>>>>> origin/feature
// Handle the root URL with the "index.html" file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 12345;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
<<<<<<< HEAD
  
  // Automatically shut down the server after 60 seconds
  setTimeout(() => {
    console.log('Shutting down server...');
    server.close();
  }, 180000);
});
=======
  resetInactivityTimeout();
});

function resetInactivityTimeout() {
  if (inactivityTimeout) {
    clearTimeout(inactivityTimeout);
  }
  inactivityTimeout = setTimeout(() => {
    console.log('No activity detected. Shutting down server...');
    server.close(() => {
      console.log('Server shut down due to inactivity.');
    });
  }, INACTIVITY_TIMEOUT);
}
>>>>>>> origin/feature
