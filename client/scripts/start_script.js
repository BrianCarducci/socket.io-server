async function createRoom() {
    const userName = document.getElementById('userNameInput').value;
    const roomName = document.getElementById('roomNameInput').value;
    let res = await fetch('/createroom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userName,
            roomName
        })
    });
    let response = res;
    console.log(data)
}