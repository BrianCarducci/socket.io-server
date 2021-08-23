const errorEl = document.createElement('p');
errorEl.textContent('An Error Occurred');
errorEl.style.color = 'red';
errorEl.id = 'errorEl';


async function roomSetup() {
    document.removeChild(errorEl);
    const hostName = document.getElementById('hostNameInput').value;
    const roomName = document.getElementById('roomNameInput').value;

    const res = await fetch('/roomSetup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            hostName,
            roomName
        })
    });

    let resBody = await res.json();


    const content = document.getElementById('mainContent');
    if (resBody.roomId) {
        while (content.firstChild) {
            content.removeChild(content.firstChild);
        }

        const roomReadyHeaderEl = document.createElement('h1');
        roomReadyHeaderEl.textContent = `Your room is ready. Room ID: ${resBody.roomId}`;

        const shareWithFriendsEl = document.createElement('p');
        shareWithFriendsEl.textContent('Share this room ID with your friends so they can join you')

        const createRoomButton = document.createElement('button');
        createRoomButton.textContent = 'Create Room';
        createRoomButton.onclick = () => {
            fetch('/createRoom', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
        }

        content.appendChild(roomReadyHeaderEl);
        content.appendChild(shareWithFriendsEl);
        content.appendChild(createRoomButton);
    } else {
        content.appendChild(errorEl);
    }
}


async function joinRoom() {
    const userName = document.getElementById('userNameInputJoin').value;
    const roomId = document.getElementById('roomIdInputJoin').value;

    const res = await fetch('/joinRoom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userName,
            roomId
        })
    });
    if (!res.ok) {
        document.append(errorEl);
    }
}

