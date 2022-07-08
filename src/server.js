import express from "express";
import http from "http";
import WebSocket from "ws";
const app = express();

/* view engine을 pug로 설정 */
app.set("view engine", "pug");
/* views 디렉토리 설정 */
app.set("views", __dirname + "/views");

/* user가 public으로 가게 되면 __dirname + /public 폴더를 보여주게 할 것이다, public 폴더 안의 내용만 볼 수 있다(보안 상 중요, 프론트엔드 부분) */
app.use("/public", express.static(__dirname + "/public")); 

/* 유저가 /에 접속하면 (req을 보내면) response로 home.pug를 렌더링한다. */
app.get("/", (req, res) => res.render("home")); 
/* 유저가 모든 url에 접속하면 home으로 돌려보낸다. (home만 사용할 것이다.) */
app.get("/*", (req, res) => res.redirect("/"));


/* express application으로 부터 서버를 만듦. 이 서버에서 webSocket을 만들 수 있음, http 서버를 만든것! */
const server = http.createServer(app);

/* 서버를 전달해서 웹소켓 서버를 만들어서 http 서버, webSocket서버 둘 다 돌리는 것, webSocket 서버를 만든것! 이렇게 되면 localhost:3000은 http, webSocket 서버 둘다 작동 시킬 수 있게 된다. */
const wss = new WebSocket.Server({ server });

/* fake database, 누군가 connection을 연결하면 여기에 넣어줄 것 */
const sockets = [];

/* 웹소켓이 연결되었을 때의 Event 등록 */
wss.on("connection", (socket) => {
  sockets.push(socket); // 각 브라우저에서 연결이 되면 socket을 푸쉬, 브라우저마다의 소켓을 수집해서 브라우저끼리 연결할 수 있게 함.
  socket["nickName"] = "익명";
  console.log("브라우저와 연결 성공!");
  socket.on("close", () => {
    console.log("브라우저와 연결이 끊겼습니다.");
  }); // 브라우저가 disconnect 되었을 때
  socket.on("message", (message) => {
    const parseMessage = JSON.parse(message); // 프론트에서 받은 object를 parsing해서
    switch (parseMessage.type.toString()) {
      case "message": // 타입이 message이면,
        sockets.forEach((aSocket) => {
          aSocket.send(
            `${socket.nickName}: ${parseMessage.payload.toString()}`
          );
        });
        break;
      case "nickName": // 타입이 nickName이면,
        socket["nickName"] = parseMessage.payload.toString();
        break;
    }
  }); // 프론트에서 보낸 메시지를 출력
}); 

const handleListen = () => {
  console.log(`Listening on http://localhost:3000`);
};
server.listen(3000, handleListen);
