// npm install express socket.io
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// This endpoint serves the static files from the public directory (e.g., index.html)
app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("audio-chunk", (chunk) => {
    // Here we simply log the chunk, but you could process or save it as needed
    console.log("Received audio chunk", chunk);
  });

  socket.on("stream-stopped", () => {
    console.log("User stopped the stream");
    // Handle the stop event, you might want to clean or reset certain data.
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
