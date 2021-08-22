const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const { Server } = require("socket.io");


app.use(express.json());
app.use(require('./routes'));
app.use(express.static('client'));

const io = new Server(httpServer);

let rooms = [
    {
        room: {
            id: '',
            host: '',
            members: ['', ''],
            messages: [
                {
                    author: '',
                    message: '',
                    timeStamp: ''
                }
            ]
        }
    }
];
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

console.log(app)

httpServer.listen(3000, () => console.log('listening on *:3000'));
