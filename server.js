const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public")); // Assuming your client files are in the 'public' folder
app.use(
  "/socket.io",
  express.static(__dirname + "/node_modules/socket.io-client/dist")
);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("audioData", (data) => {
    console.log("Received audio data:", data);

    // Decode audio data into a playable format
    // const decodedAudio = decodeAudioData(data);
    console.log({ data });

    // Play the decoded audio
    // Use a web audio context to play the decoded audio buffer
  });

  // Handle audio data from the client
  socket.on("audio", (data) => {
    // Process the audio data here
    console.log("Received audio data:", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
