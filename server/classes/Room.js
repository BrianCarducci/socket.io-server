class Room {
    constructor(id, hostId, members = [], messages = []) {
        this.id = id;
        this.hostId = hostId;
        this.members = members;
        this.messages = messages;
    }
}