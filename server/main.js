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
        const room = rooms.find(room => room.roomId === payload.roomId);
        if (room && payload.userId) {
            rooms = rooms.map(room => {
                if (room.roomId === payload.roomId) {
                    room.members.push(payload.userId);
                }
            });
            socket.emit('join room success', room.messages);
        } else {
            socket.emit('error', 'Failed to join room');
        }
    });

    socket.on('chat message', (msg) => {
        messages.push(msg);
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


httpServer.listen(3000, () => console.log('listening on *:3000'));

