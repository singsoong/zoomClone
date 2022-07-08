const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const nickNameForm = document.querySelector("#nickName");

const socket = new WebSocket(`ws://${window.location.host}`);

/* Message를 object로 만들고 stringify 하는 func */
function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

/* socket의 connection을 open했을 때 발생하는 Event 등록 */
socket.addEventListener("open", () => {
  console.log("서버와 연결되었습니다.");
});

/* 메시지를 받았을 때 마다 발생하는 Event 등록 */
socket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
});

/* 서버가 off 되었을 때 발생하는 이벤트 등록 */
socket.addEventListener("close", () => {
  console.log("서버와 연결이 끊어졌습니다.");
});

/* 메시지 폼의 제출버튼을 눌렀을 때 Event */
function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("message", input.value));
  input.value = "";
}

/* 닉네임 폼의 제출버튼을 눌렀을 때 Event */
function handleNickNameSubmit(event) {
  event.preventDefault();
  const input = nickNameForm.querySelector("input");
  socket.send(makeMessage("nickName", input.value));
  input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);
nickNameForm.addEventListener("submit", handleNickNameSubmit);
