const socket = io();

const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const playSoundButton = document.getElementById('playSoundButton');
const notificationSound = document.getElementById('notificationSound');

function sendMessage() {
  const message = messageInput.value.trim();
  if (message !== '') {
    socket.emit('message', {
      room: 'room1',
      message: message,
    });
    messageInput.value = '';
  }
}

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', handleKeyPress);

socket.on('message', (message) => {
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  if (document.hidden) {
    notificationSound.play();

    new Notification('New Message', {
      body: message,
    });
  }
});

socket.on('play-sound', () => {
  notificationSound.play();
});

socket.on('connect', () => {
  socket.emit('join-room', 'room1');
});

playSoundButton.addEventListener('click', () => {
  socket.emit('play-sound', { room: 'room1' }); // Include room information (optional)
});

if (Notification.permission !== "granted") {
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
    }
  });
}
