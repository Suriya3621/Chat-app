const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const { addUser, removeUser, getUser, getRoomUsers } = require("./entity");

const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: "*" } });

app.get("/", (req, res) => {
  res.json("API is working");
});

io.on("connect", (socket) => {
  // When user joins
  socket.on("join", ({ user, room }, callback) => {
    console.log(`JOIN REQUEST => ${user} | ${room}`);

    const { response, error } = addUser({ id: socket.id, user, room });

    if (error) {
      console.log("Join error:", error);
      callback(error);
      return;
    }

    socket.join(response.room);

    socket.emit("message", {
      user: "admin",
      text: `Welcome ${response.user}!`,
    });

    socket.broadcast.to(response.room).emit("message", {
      user: "admin",
      text: `${response.user} has joined the chat.`,
    });

    io.to(response.room).emit("roomMembers", getRoomUsers(response.room));

    callback(); // success
  });

  // When user sends a message
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: user.user,
        text: message,
      });
    }

    callback();
  });

  // When user disconnects
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.user} has left the chat.`,
      });
      io.to(user.room).emit("roomMembers", getRoomUsers(user.room));
    }

    console.log("User disconnected:", socket.id);
  });
});

server.listen(8000, () => console.log("Server started on port 8000"));