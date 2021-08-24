const errorEl = document.createElement('p');
errorEl.textContent = 'An Error Occurred. Try creating/joining a new room.';
errorEl.style.color = 'red';
errorEl.id = 'errorEl';


async function roomSetup() {
    try {
        document.getElementById('mainContent').removeChild(errorEl);
    } catch { }

    const userId = document.getElementById('userIdInputCreate').value;
    const roomName = document.getElementById('roomNameInputCreate').value;

    const setupRoomResponse = await fetch('/roomSetup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId,
            roomName
        })
    });
    const setupRoomResponseBody = await setupRoomResponse.json();

    const content = document.getElementById('mainContent');
    if (setupRoomResponseBody.roomId) {
        while (content.firstChild) {
            content.removeChild(content.firstChild);
        }

        const roomReadyHeaderEl = document.createElement('h1');
        roomReadyHeaderEl.textContent = 'Your room is ready.';

        const roomIdEl = document.createElement('h3');
        roomIdEl.textContent = `Room ID: ${setupRoomResponseBody.roomId}`;

        const shareWithFriendsEl = document.createElement('p');
        shareWithFriendsEl.textContent = 'Share this room ID with your friends so they can join you';

        const createRoomButton = document.createElement('button');
        createRoomButton.textContent = 'Create Room';
        createRoomButton.onclick = async () => {
            const createRoomResponse = await fetch('/createRoom', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    roomId: setupRoomResponseBody.roomId
                })
            });
            if (createRoomResponse.ok) {
                window.location.replace(`${window.location.href}room`);
            } else {
                content.appendChild(errorEl);
            }
        }

        content.appendChild(roomReadyHeaderEl);
        content.appendChild(roomIdEl);
        content.appendChild(shareWithFriendsEl);
        content.appendChild(createRoomButton);
    } else {
        content.appendChild(errorEl);
    }
}


async function joinRoom() {
    try {
        document.getElementById('mainContent').removeChild(errorEl);
    } catch { }

    const userId = document.getElementById('userIdInputJoin').value;
    const roomId = document.getElementById('roomIdInputJoin').value;

    const res = await fetch('/joinRoom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId,
            roomId
        })
    });

    if (!res.ok) {
        document.getElementById('mainContent').append(errorEl)
    }
}

