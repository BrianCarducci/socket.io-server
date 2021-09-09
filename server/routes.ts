import express from 'express';
let app = module.exports = express();

import path from 'path';
import { randomUUID } from 'crypto';
import { roomsState } from './main';


app.get('/', (req, res) => {
    res.clearCookie('roomId');
    res.clearCookie('userId');
    res.sendFile(path.resolve('client/html/start.html'));
});

app.post('/roomSetup', (req, res) => {
    const roomId = randomUUID();
    roomsState.pendingRooms.push({ roomId, roomName: req.body.roomName, hostId: req.body.userId, members: [], messages: [] });
    res.cookie('roomId', roomId);
    res.json({ roomId, hostName: req.body.userId });
});

app.post('/createRoom', (req, res, next) => {
    const pendingRoomIndex = roomsState.pendingRooms.findIndex(room => room.roomId === req.cookies.roomId);
    if (pendingRoomIndex > -1 && req.body.userId) {
        roomsState.rooms.push({
            roomId: req.cookies.roomId,
            roomName: roomsState.pendingRooms[pendingRoomIndex].roomName,
            hostId: req.body.userId,
            members: [],
            messages: [{
                authorId: req.body.userId,
                timestamp: new Date(),
                content: 'This is a test message'
            }]
        });
        roomsState.pendingRooms.splice(pendingRoomIndex, 1);
        res.cookie('userId', req.body.userId);
        res.json({ result: 'Successfully created room' });
    } else {
        next(new Error(`Room ID ${req.cookies.roomId} is invalid. Try creating a new room or joining a different room.`));
    }
});

app.get('/room', (req, res) => {
    res.sendFile(path.resolve('client/html/chat.html'));
});

app.post('/joinRoom', (req, res, next) => {
    if (roomsState.rooms.find(room => room.roomId === req.body.roomId) && req.body.userId) {
        res.cookie('roomId', req.body.roomId);
        res.cookie('userId', req.body.userId);
        res.sendFile(path.resolve('client/html/chat.html'));
    } else {
        next(new Error(`Room ID ${req.cookies.roomId} is invalid. Try creating a new room or joining a different room.`));
    }
});
