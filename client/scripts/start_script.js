async function roomSetup() {
    const hostName = document.getElementById('hostNameInput').value;
    const roomName = document.getElementById('roomNameInput').value;

    const res = await fetch('/createroom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            hostName,
            roomName
        })
    });
    let resBody = await res.json();

    if (resBody.roomId) {
        const content = document.getElementById('mainContent');
        while (content.firstChild) {
            content.removeChild(content.firstChild);
        }

        const roomIdElement = document.createElement('p');
        roomIdElement.textContent = `Room is ready. ID: ${resBody.roomId}`;

        const createRoomButton = document.createElement('button');
        createRoomButton.textContent = 'Create Room';
        createRoomButton.onclick = () => {

        }

        content.appendChild(roomIdElement);
        content.appendChild(createRoomButton);
    } else {

    }
}

