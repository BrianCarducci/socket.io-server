const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const { Server } = require("socket.io");
const cookieParser = require('cookie-parser');


let pendingRooms = [];
let rooms = [];
module.exports = {
    pendingRooms,
    rooms
};

app.use(express.json());
app.use(cookieParser());
app.use(require('./routes'));
app.use(express.static('client'));


const io = new Server(httpServer);
io.on('connection', (socket) => {

    socket.on('join room', (payload) => {
        const roomIndex = rooms.findIndex(room => room.roomId === payload.roomId);
        if (roomIndex > -1 && payload.userId) {
            rooms[roomIndex].members.push(payload.userId);
            socket.join(rooms[roomIndex].roomId);
            socket.emit('join room success', rooms[roomIndex].messages);
        } else {
            socket.emit('error', 'Failed to join room');
        }
    });

    socket.on('chat message', (message) => {
        const roomIndex = rooms.findIndex(room => room.roomId === message.roomId);
        if (roomIndex > -1) {
            console.log('room found')
            rooms[roomIndex].messages.push({
                author: message.author,
                timestamp: new Date(),
                content: message.content
            });
            io.to(message.roomId).emit('chat message', message);
        } else {
            socket.emit('disconnect');
        }
    });

    socket.on('disconnect', () => {

    });
});


httpServer.listen(3000, () => console.log('listening on *:3000'));
