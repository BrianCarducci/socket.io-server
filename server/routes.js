let path = require('path');
let express = require('express');
let app = module.exports = express();
const { randomUUID } = require('crypto');

let { pendingRooms, rooms } = require('./main');


app.get('/', (req, res) => {
    res.clearCookie('roomId');
    res.clearCookie('userId');
    res.sendFile(path.resolve('client/html/start.html'));
});

app.post('/roomSetup', (req, res) => {
    const roomId = randomUUID();
    pendingRooms.push({ roomId, roomName: req.body.roomName, hostName: req.body.userId });
    res.cookie('roomId', roomId);
    res.json({ roomId, hostName: req.body.userId });
});

app.post('/createRoom', (req, res, next) => {
    if (pendingRooms.find(room => room.roomId === req.cookies.roomId) && req.body.userId) {
        res.cookie('userId', req.body.userId);
        res.json({ result: 'Successfully created room' });
        pendingRooms = pendingRooms.filter(room => room.roomId !== req.cookies.roomId);
        rooms.push({
            roomId: req.cookies.roomId,
            hostName: req.body.userId,
            members: [req.body.userId],
            messages: [{
                author: req.body.userId,
                timeStamp: new Date(),
                content: 'This is a test message'
            }]
        });
    } else {
        next(new Error(`Room ID ${req.cookies.roomId} is invalid. Try creating a new room or joining a different room.`));
    }
});

app.get('/room', (req, res) => {
    res.sendFile(path.resolve('client/html/chat.html'));
});

app.post('/joinRoom', (req, res, next) => {
    if (rooms.find(room => room.roomId === req.body.roomId) && req.body.userId) {
        res.cookie('roomId', req.body.roomId);
        res.cookie('userId', req.body.userId);
        res.sendFile(path.resolve('client/html/chat.html'));
    } else {
        next(new Error(`Room ID ${req.cookies.roomId} is invalid. Try creating a new room or joining a different room.`));
    }
});
