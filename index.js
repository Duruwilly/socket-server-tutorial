// import { Server } from "socket.io";

// const io = new Server({
//   cors: {
//     origin: "http://localhost:3004",
//   },
// });

// // if we already have this user in this array, we are not going to add it, if a user is loggedin as "john", it won't create another user because, we already in the array.
// let onlineUsers = [];

// const addNewUsers = (username, socketId) => {
//   // if online user doesn't have any user, add a unique user
//   !onlineUsers.some((user) => user.username === username) &&
//     onlineUsers.push({ username, socketId });
// };

// const removeUser = (socketId) => {
//   onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
// };

// const getUser = (username) => {
//   return onlineUsers.find((user) => user.username === username);
// };

// io.on("connection", (socket) => {
//   socket.on("newUser", (username) => {
//     addNewUsers(username, socket.id);
//   });

//   socket.on("sendNotification", ({ senderName, receiverName, type }) => {
//     const receiver = getUser(receiverName);
//     io.to(receiver.socketId).emit("getNotification", {
//       senderName,
//       type,
//     });
//   });

//   socket.on("disconnect", () => {
//     removeUser(socket.id);
//   });
// });

// io.listen(8200);

import { Server } from "socket.io";

const io = new Server({
  cors: {
    // so we can only reach this server from local host 3001
    origin: "http://localhost:3001",
  },
});

let onlineUsers = [];

// const addNewUsers = (userName, socketId) => {
//   !onlineUsers.some((user) => {
//     user.userName === userName && onlineUsers.push({ userName, socketId });
//   });
// };

// add the user to onlineUsers array when a new user connect or login from the frontend
const addNewUsers = (userName, socketId) => {
  if (!onlineUsers.some((user) => user.userName === userName)) {
    onlineUsers.push({ userName, socketId });
  }
};

// remove the user from the array when the user disconnect or logout from the frontend
const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

// this get a particular user and return that user
const getUser = (userName) => {
  return onlineUsers.find((user) => user.userName === userName);
};

// 
io.on("connection", (socket) => {
  // this takes event from the client when users connect or login
  socket.on("newUser", (userName) => {
    // add the userName and the socketId to the onlineUsers array
    addNewUsers(userName, socket.id);
  });

  // this takes event from the client when user send notifications from the frontend
  socket.on("sendNotification", ({ senderName, receiverName, type }) => {
    // get the user to receive the event from the client side
    const receiver = getUser(receiverName);

    // send the notification to a particular client
    io.to(receiver?.socketId).emit("getNotification", {
      senderName,
      type,
    });
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

io.listen(8200);
