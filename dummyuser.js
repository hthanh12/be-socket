const c_users = [];
let messages = []
const users = []
const users_to_rooms = []
const rooms = []
const moment = require('moment')

function listRooms(user_id) {
    let roommm = users_to_rooms.filter((users_to_room) => users_to_room && users_to_room.user_id && users_to_room.user_id == user_id);
    let roomsa = []
    if (roommm.length > 0) {
        console.log('rooms', rooms)
        for (let room of roommm) {
            console.log('aaa', room.id)
            let roomAdd = {
                room_id: room.id,
                roomname: null,
            }
            let find = rooms.find(element => element && element.id && element.id == room.id);
            roomAdd.roomname = find.roomname
            console.log('bbbb', find.roomname)

            roomsa.push(roomAdd)
        }
    }
    // console.log("🚀 ~ file: dummyuser.js ~ line 10 ~ listRooms ~ roommm", roommm)
    return roomsa
}
function findOrCreateUser(username, socket_id) {
    let found = users.findIndex((item) => item.username === username)

    if (found === -1) {
        let id = 1
        if (users.length > 0) {
            id = users.length++
        }
        found = { id: id, username: username, created_at: moment().format('YYYY-MM-DD HH:mm:ss'), socket_id: socket_id }
        users.push(found)
    } else {
        users[found].socket_id = socket_id
    }
    return found
}

function findUser(username) {
    let found = users.find((item) => item && item.username && item.username == username)
    if (!found) {
        return false
    }
    return found
}

function findOrCreateRoom(roomname, room_id) {
    let found = rooms.find((item) => item.roomname === roomname)

    if (!found) {
        let id = 1
        if (rooms.length > 0) {
            id = users.length++
        }
        found = { id: id, roomname: roomname, created_at: moment().format('YYYY-MM-DD HH:mm:ss') }
        rooms.push(found)
    }
    console.log('rooms', rooms)
    return found
}

function createUsersToRooms(room_id, user_id) {
    let id = 1
    if (users_to_rooms.length > 0) {
        id = users_to_rooms.length++
    }
    let userToRoomsCreate = {
        id: id,
        room_id: room_id,
        user_id: user_id,
        status: 1,
        created_at: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    users_to_rooms.push(userToRoomsCreate)
    // console.log('users_to_rooms', users_to_rooms)
}
// joins the user to the specific chatroom
function joinUser(id, username, room) {
    const p_user = { id, username, room };

    c_users.push(p_user);
    // console.log(c_users, "users");

    return p_user;
}

// console.log("user out", c_users);

// Gets a particular user id to return the current user
function get_Current_User(id) {
    return c_users.find((p_user) => p_user.id === id);
}

// called when the user leaves the chat and its user object deleted from array
function user_Disconnect(id) {
    const index = c_users.findIndex((p_user) => p_user.id === id);

    if (index !== -1) {
        return c_users.splice(index, 1)[0];
    }
}

async function createMessage(id_send, room_receiver, message) {
    let id = 1
    console.log("🚀92  messages.length", messages.length)
    if (messages.length > 0) {
        id = messages.length++
    }
    let messageCreate = {
        id: id,
        creator_id: id_send,
        room_id: room_receiver,
        message: message,
        created_at: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    // console.log('beforeMessages', messages)

    // console.log('beforeMessages 1', messages)

    messages = [...messages, messageCreate]
    // console.log('afterMessages', messages)

    return messageCreate
}
module.exports = {
    joinUser,
    get_Current_User,
    user_Disconnect,
    createMessage,
    findOrCreateUser,
    findOrCreateRoom,
    createUsersToRooms,
    findUser,
    listRooms
};
