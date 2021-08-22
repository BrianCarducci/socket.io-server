let path = require('path');
let express = require('express');
let app = module.exports = express();
const { randomUUID } = require('crypto');

let { pendingRooms } = require('./main');


app.get('/', (req, res) => {
    res.clearCookie('roomId');
    res.sendFile(path.resolve('client/html/start.html'));
});

app.post('/setupRoom', (req, res) => {
    const roomId = randomUUID();
    pendingRooms.push({ roomId, roomName: req.body.roomName, hostName: req.body.hostName });
    res.cookie('roomId', roomId);
    res.json({ roomId });
});

app.post('/createRoom', (req, res, next) => {
    if (pendingRooms.find(room => room.roomId === req.cookies.roomId)) {
        res.sendFile(path.resolve('client/html/chat.html'));
        pendingRooms = pendingRooms.filter(room => room.roomId !== req.cookies.roomId);
    } else {
        next(new Error(`Room ID ${req.cookies.roomId} is invalid. Try creating a new room or joining a different room.`));
    }
});
