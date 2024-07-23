// Establish a connection to the server
const socket = io();

// Get references to HTML elements
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const playSoundButton = document.getElementById('playSoundButton'); // Reference to the Play Sound button

// Get reference to the notification sound element
const notificationSound = document.getElementById('notificationSound');

// Function to send a chat message
function sendMessage() {
  const message = messageInput.value.trim();
  if (message !== '') {
    socket.emit('message', {
      room: 'room1', // Room identifier
      message: message,
    });
    messageInput.value = '';
  }
}

// Function to handle sending a message on "Enter" key press
function handleKeyPress(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

// Listen for send button click event
sendButton.addEventListener('click', sendMessage);

// Listen for "Enter" key press in the input field
messageInput.addEventListener('keydown', handleKeyPress);

// Listen for incoming messages from the server
socket.on('message', (message) => {
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Check if the chat is not currently active (i.e., not in focus)
  if (document.hidden) {
    // Play the notification sound
    notificationSound.play();

    // Display a notification
    new Notification('New Message', {
      body: message,
    });
  }
});

// Listen for play-sound event from the server
socket.on('play-sound', () => {
  notificationSound.play();
});

// Join the chat room when connected to the server
socket.on('connect', () => {
  socket.emit('join-room', 'room1'); // Room identifier
});

// Emit play-sound event to the server when the Play Sound button is clicked
playSoundButton.addEventListener('click', () => {
  socket.emit('play-sound', { room: 'room1' }); // Include room information (optional)
});
