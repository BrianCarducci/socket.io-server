const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const { Server } = require("socket.io");

const routes = require('./routes');

app.use(routes);
app.use(express.static('client'));

const io = new Server(httpServer);

let messages = [];


io.on('connection', (socket) => {

    socket.emit('populate existing messages', messages);

    socket.on('chat message', (msg) => {
        messages.push(msg);
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

});


httpServer.listen(3000, () => console.log('listening on *:3000'));
