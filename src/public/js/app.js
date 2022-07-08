const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");

const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("서버와 연결되었습니다.");
}); // socket이 connection을 open 했을 때 발생하는 이벤트 등록

socket.addEventListener("message", (message) => {
  console.log("메시지 받음: ", message.data);
}); // 메세지를 받을 때 마다 발생하는 이벤트 등록

socket.addEventListener("close", () => {
  console.log("서버와 연결이 끊어졌습니다.");
}); // 서버가 off 되었을 때 발생하는 이벤트 등록

function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(input.value);
  input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);
