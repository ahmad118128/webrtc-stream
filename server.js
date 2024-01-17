// npm install express socket.io
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("audio-chunk", (chunk) => {
    console.count("----- #Server Received audio chunk -----");
  });

  socket.on("webcam-chunk", ({ video, audio }) => {
    console.count("----- #Server Received webcam chunk -----");
  });

  socket.on("microphone-stream-stopped", () => {
    console.log("User stopped the microphone stream");
  });

  socket.on("webcam-stream-stopped", () => {
    console.log("User stopped the webcam stream");
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(8000, () => {
  console.log("listening on *:8000");
});
