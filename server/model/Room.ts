import { Message } from './Message';

interface Room {
    roomId: string;
    roomName: string;
    hostId: string;
    memberIds: string[];
    messages: Message[];
}

export class RoomsState {
    pendingRooms: Room[];
    rooms: Room[];

    constructor() {
        this.pendingRooms = [];
        this.rooms = [];
    }
}