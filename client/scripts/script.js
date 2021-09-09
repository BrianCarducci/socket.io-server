// setup
const { roomId, userId } = getCookies();

const socket = io();
socket.emit('join room', { roomId, userId });

const messagesEl = document.getElementById('messages');

const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (chatInput.value) {
        socket.emit('chat message', {
            roomId,
            authorId: userId,
            content: chatInput.value
        });
        chatInput.value = '';
    }
});


// socket recieving events
socket.on('join room success', messages =>
    messages.forEach(message => appendMessage(message))
);
socket.on('join room error', err =>
    window.location.replace(window.location.href.split('/room')[0])
);
socket.on('chat message', message =>
    appendMessage(message)
);
socket.on('chat message error', message =>
    window.location.replace(window.location.href.split('/room')[0])
);
socket.on('disconnect', () => {
    window.location.replace(window.location.href);
});


// function definitions
function getCookies() {
    const roomId = document.cookie.split('; ').find(row => row.startsWith('roomId=')).split('=')[1];
    const userId = document.cookie.split('; ').find(row => row.startsWith('userId=')).split('=')[1];

    if (roomId && userId) {
        return { roomId, userId };
    } else {
        window.location.replace(window.location.href.split('/room')[0]);
    }
}

function appendMessage(message) {
    console.log(message)
    const messageListItem = document.createElement('li');

    const authorEl = document.createElement('b');
    authorEl.textContent = `${message.authorId} (${message.timestamp}): `;

    const messageContentEl = document.createElement('p');
    messageContentEl.textContent = message.content;

    messageListItem.appendChild(authorEl);
    messageListItem.appendChild(messageContentEl);

    messagesEl.appendChild(messageListItem);
    window.scrollTo(0, document.body.scrollHeight);
}
