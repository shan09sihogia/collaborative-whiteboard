// Import the necessary modules for our server
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

// Set up the Express application
const app = express();
const server = http.createServer(app);

// Define the port our server will listen on. 3001 is a good choice to avoid conflicts.
const port = process.env.PORT || 3001;

// Configure the Socket.IO server.
// The `cors` option is critical for security and allows our React front-end (on port 5173)
// to connect to this server.
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// A simple Express route. This is just to confirm the server is running.
app.get('/', (req, res) => {
  res.send('<h1>Whiteboard server is running!</h1>');
});

// This is the core of the Socket.IO server logic.
// `io.on('connection', ...)` listens for new clients connecting to the server.
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // `socket.on()` listens for a specific event sent from a client.
  // In this case, we are listening for an event named 'drawing'.
  socket.on('drawing', (data) => {
    // When drawing data is received from one client, we want to send it to all other clients.
    // `socket.broadcast.emit()` sends a message to everyone connected, except for the client who sent it.
    socket.broadcast.emit('drawing', data);
  });

  // `socket.on('disconnect', ...)` listens for a client disconnecting.
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Tell the server to start listening for requests on the specified port.
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});