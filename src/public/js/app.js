const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");
const nick = document.getElementById("nick");

room.hidden = true;

let roomName;

/* 메시지를 추가하는 함수 */
function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

/* 메시지 전송을 눌렀을 때의 Event */
function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

/* 방 이름을 입력했을 때 Event */
function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const form = room.querySelector("form");
  form.addEventListener("submit", handleMessageSubmit);
}

/* 방 이름을 누르고 입장하기를 눌렀을 때 Event */
const handleRoomSubmit = (event) => {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
};
form.addEventListener("submit", handleRoomSubmit);

const handleNickSubmit = (event) => {
  event.preventDefault();
  const input = nick.querySelector("input");
  socket.emit("nick", input.value);
  input.value = "";
};
nick.addEventListener("submit", handleNickSubmit);

socket.on("welcome", (nick) => {
  addMessage(`${nick}님이 방에 들어왔습니다!`);
});

socket.on("bye", (nick) => {
  addMessage(`${nick}님이 방을 나갔습니다!`);
});

socket.on("new_message", (msg) => {
  addMessage(msg);
});

socket.on("room_change", (rooms) => {
  const roomLists = welcome.querySelector("ul");
  roomLists.innerHTML = "";
  if (rooms.length === 0) {
    roomLists.innerHTML = "";
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = rooms;
    roomLists.appendChild(li);
  });
});
