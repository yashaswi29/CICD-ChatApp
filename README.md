# ChatApp
ChatApp, which lets you chat over the same IP Address

Dependencies:
The application requires the following dependencies:
Express: A web application framework for Node.js.
http: Node.js built-in module for creating HTTP servers.
socket.io: A library for real-time, bidirectional communication between web clients and servers.
path: A Node.js built-in module for working with file paths.
Setting Up the Server:
The application creates an Express server and an HTTP server using the http.createServer() method, passing the Express app instance as an argument.
Socket.IO Integration:
Socket.IO is integrated with the HTTP server by passing the server instance to the socketIo() function. This creates a Socket.IO server that listens for WebSocket connections on the same port as the HTTP server.
Handling Socket Connections:
When a client connects to the server (io.on('connection')), a WebSocket connection is established.
The server listens for the join-room event, which is emitted by clients when they join a chat room. Upon receiving this event, the server adds the socket to the specified room and stores the room connections in the roomConnections object.
When a client sends a message (socket.on('message')), the server emits the message to all clients in the same room using io.to(room).emit('message', message).
When a client disconnects from the server (socket.on('disconnect')), the server removes the socket from all rooms it was connected to.
Static File Serving:
The application serves static files (HTML, CSS, JS) from the public directory using express.static() middleware.
The root URL (/) serves the index.html file from the public directory.
Server Configuration:
The server listens on the specified port (PORT) or defaults to port 12345.
An automatic shutdown mechanism is implemented using setTimeout() to close the server after 60 seconds.
Overall, this chat application allows multiple users to connect to the server, join different chat rooms, send messages in real-time, and disconnect gracefully. It's a basic implementation that can be extended with additional features such as user authentication, private messaging, and message persistence.





