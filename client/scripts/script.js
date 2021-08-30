//setup
const socket = io();
const messagesEl = document.getElementById('messages');
const { roomId, userId } = checkCookies();
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (chatInput.value) {
        socket.emit('chat message', {
            roomId,
            author: userId,
            content: chatInput.value
        });
        chatInput.value = '';
    }
});


//socket recieving events
socket.on('join room success', messages =>
    messages.forEach(message => appendMessage(message))
);
socket.on('chat message', message =>
    appendMessage(message)
);
socket.on('disconnect', () => {
    window.location.replace(window.location.href);
});


// function definitions
function checkCookies() {
    try {
        const roomId = document.cookie.split('; ').find(row => row.startsWith('roomId=')).split('=')[1];
        const userId = document.cookie.split('; ').find(row => row.startsWith('userId=')).split('=')[1];

        if (roomId && userId) {
            socket.emit('join room', { roomId, userId });
            return { roomId, userId };
        } else {
            throw new Error();
        }
    } catch {
        window.location.replace(window.location.href.split('/room')[0]);
    }
}

function appendMessage(message) {
    const messageListItem = document.createElement('li');

    const authorEl = document.createElement('b');
    authorEl.textContent = `${message.author} (${message.timestamp}): `;

    const messageContentEl = document.createElement('p');
    messageContentEl.textContent = message.content;

    messageListItem.appendChild(authorEl);
    messageListItem.appendChild(messageContentEl);

    messagesEl.appendChild(messageListItem);
    window.scrollTo(0, document.body.scrollHeight);
}
