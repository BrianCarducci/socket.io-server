var socket = io();

var messagesEl = document.getElementById('messages');

try {
    const roomId = document.cookie.split('; ').find(row => row.startsWith('roomId=')).split('=')[1];
    const userId = document.cookie.split('; ').find(row => row.startsWith('userId=')).split('=')[1];

    if (roomId && userId) {
        socket.emit('join room', { roomId, userId });
    } else {
        throw new Error();
    }
} catch {
    window.location.replace(window.location.href);
}

socket.on('join room success', (messages) => {
    messages.forEach(message => {
        const messageListItem = document.createElement('li');

        const authorEl = document.createElement('b');
        authorEl.textContent = `${message.author} (${message.timeStamp}): `;

        const messageContentEl = document.createElement('p');
        messageContentEl.textContent = message.content;

        messageListItem.appendChild(authorEl);
        messageListItem.appendChild(messageContentEl);

        messagesEl.appendChild(messageListItem);
        window.scrollTo(0, document.body.scrollHeight);
    });
});


var form = document.getElementById('form');
var input = document.getElementById('input');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

socket.on('chat message', (msg) => {
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('populate existing messages', (msgs) => {
    msgs.forEach((msg) => {
        var item = document.createElement('li');
        item.textContent = msg;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    })
});

socket.on('disconnect', () => {
    window.location.replace(window.location.href);
})