const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { exec } = require("child_process");
const app = express();
const server = http.createServer(app);
const fs = require("fs");
const FILE_PATH = `./recorded_audio.webm`;
const io = socketIo(server);
app.use(express.static("public")); // Assuming your client files are in the 'public' folder
app.use(
  "/socket.io",
  express.static(__dirname + "/node_modules/socket.io-client/dist")
);

let ffmpegProcess;
let fileWriter;

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("audio", func3);

  function func1(data) {
    const bufferData = Buffer.from(data);
    fs.appendFile(FILE_PATH, bufferData, (err) => {
      if (err) {
        console.error("Error writing audio data to file:", err);
      } else {
        console.log("Audio data appended to file successfully");
      }
    });

    if (!ffmpegProcess) {
      const command = `ffmpeg -re -i ${FILE_PATH} recorded_audio.mp3`;

      ffmpegProcess = exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });
    }
  }

  function func2(data) {
    saveAudio(data);
  }

  function func3(data) {
    if (!ffmpegProcess) {
      startFFmpegProcess();
    }

    ffmpegProcess.stdin.write(data);
  }

  socket.on("stop", (data) => {
    if (ffmpegProcess) {
      ffmpegProcess.kill("SIGTERM"); // Terminate the ffmpeg process
      ffmpegProcess = null; // Reset the ffmpeg process variable
    }
  });

  socket.on("prepare", (data) => {
    console.log("prepare");
  });

  function saveAudio(data) {
    if (!fileWriter) {
      fileWriter = fs.createWriteStream(FILE_PATH);
    }
    fileWriter.write(data);
  }

  function startFFmpegProcess() {
    const command = `ffmpeg -i pipe:0 -c:a libopus -b:a 128k -ar 48000 -f webm ${FILE_PATH}`;

    ffmpegProcess = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });
  }

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
