const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

console.log({username, room})

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}
//Random avatar images
var imageArray=[
  "https://d2pas86kykpvmq.cloudfront.net/images/humans-3.0/ava-1.png",
  "https://img.freepik.com/premium-psd/3d-cartoon-character-avatar-isolated-3d-rendering_235528-548.jpg",
  "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg",
  "https://img.freepik.com/premium-vector/happy-smiling-young-man-avatar-3d-portrait-man-cartoon-character-people-vector-illustration_653240-187.jpg",
  "https://png.pngtree.com/png-clipart/20230102/original/pngtree-3d-boy-head-portrait-png-image_8855190.png"
]
// Add users to DOM
function outputUsers(users) {
 console.log({users})
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    const randomImg = imageArray[Math.floor(Math.random() * imageArray.length)];
    li.innerText = user.username;
    li.innerHTML = `<img style="width: 40px; border-radius: 30px; background: white; height: 40px" src=${randomImg} />` + " " +user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});