import { Socket } from "socket.io";

export interface Member {
    memberId: string;
    socket: Socket;
}