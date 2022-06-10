const express = require("express");
const app = express();
const socket = require("socket.io");
const color = require("colors");
const cors = require("cors");
const { get_Current_User, user_Disconnect, joinUser, createMessage, findOrCreateUser, findOrCreateRoom, createUsersToRooms, findUser, listRooms } = require("./dummyuser");
const { create } = require("domain");

app.use(express());

const port = 8111;

app.use(cors());

var server = app.listen(
  port,
  console.log(
    `Server is running on the port no: ${(port)} `
      .green
  )
);

const io = socket(server);

//initializing the socket io connection 
io.on("connection", (socket) => {
  //for a new user joining the room
  socket.on("joinRoom", async ({ username, roomname }) => {
    //* create user
    const p_user = joinUser(socket.id, username, roomname);
    let getUser = findOrCreateUser(username, socket.id)
    let getRoom = findOrCreateRoom(roomname, socket.id)
    createUsersToRooms(getRoom.id, getUser.id)
    console.log(socket.id, "=id");
    socket.join(p_user.room);

    //display a welcome message to the user who have joined a room
    let textWelcome = `Welcome ${p_user.username}`
    let getListRooms = listRooms(getUser.id)

    socket.emit("message", {
      userId: p_user.id,
      username: p_user.username,
      text: textWelcome,
      listRooms: getListRooms
    });
    // let messageCreate1 = createMessage(getUser.id, getRoom.id, textWelcome)
    console.log('a')
    //displays a joined room message to all other room users except that particular user
    let textAllRoom = `${p_user.username} has joined the chat`
    // let messageCreate2 = await createMessage(getUser.id, getRoom.id, textAllRoom)
    console.log("🚀 ~ file: server.js ~ line 50 ~ socket.on ~ getListRooms", getListRooms)
    socket.broadcast.to(p_user.room).emit("message", {
      userId: p_user.id,
      username: p_user.username,
      text: textAllRoom,
      listRooms: getListRooms
    });
    console.log('b')
  });

  //user sending message
  socket.on("chat", (text, username, roomname) => {
    //gets the room user and the message sent
    let getUser = findUser(username)
    let getRoom = findOrCreateRoom(roomname)
    let getListRooms = listRooms(getUser.id)

    io.to(roomname).emit("message", {
      userId: getUser.id,
      username: getUser.username,
      text: text,
      listRooms: getListRooms
    });

    createMessage(getUser.id, getRoom.id, text)
  });

  //when the user exits the room
  socket.on("disconnect", () => {
    //the user is deleted from array of users and a left room message displayed
    const p_user = user_Disconnect(socket.id);

    if (p_user) {
      io.to(p_user.room).emit("message", {
        userId: p_user.id,
        username: p_user.username,
        text: `${p_user.username} has left the chat`,
      });
    }
  });
});