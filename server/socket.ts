import http from 'http';
import { Server } from 'socket.io';
import { roomsState } from './main';

export function socketSetup(httpServer: http.Server) {
    const io = new Server(httpServer);
    io.on('connection', (socket) => {
        socket.on('join room', (payload) => {
            console.log('join room')
            const roomIndex = roomsState.rooms.findIndex(room => room.roomId === payload.roomId);
            if (roomIndex > -1 && payload.userId) {
                roomsState.rooms[roomIndex].memberIds.push(payload.userId);
                socket.join(roomsState.rooms[roomIndex].roomId);
                socket.emit('join room success', roomsState.rooms[roomIndex].messages);
            } else {
                socket.emit('join room error', 'Failed to join room');
            }
        });

        socket.on('chat message', (message) => {
            const roomIndex = roomsState.rooms.findIndex(room => room.roomId === message.roomId);
            if (roomIndex > -1) {
                const newMessage = {
                    authorId: message.authorId,
                    timestamp: new Date(),
                    content: message.content
                }
                roomsState.rooms[roomIndex].messages.push(newMessage);
                io.to(message.roomId).emit('chat message', newMessage);
            } else {
                socket.emit('chat message error');
            }
        });

        socket.on('disconnect', () => {

        });
    });
}
