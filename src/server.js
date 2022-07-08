import express from "express";
import http from "http";
import WebSocket from "ws";
const app = express();

app.set("view engine", "pug"); // view engine을 pug로 설정
app.set("views", __dirname + "/views"); // views 디렉토리 설정

app.use("/public", express.static(__dirname + "/public")); // 유저가 /public으로 가게 되면 __dirname + /public 폴더를 보여주게 할 것이다, public 폴더 안의 내용만 볼 수 있다(보안 상 중요, 프론트엔드 부분)

app.get("/", (req, res) => res.render("home")); // 유저가 /에 접속하면(req을 보내면) response로 home.pug를 렌더링한다.
app.get("/*", (req, res) => res.redirect("/")); // 유저가 모든 url에 접속하면 home으로 돌려보낸다. (home만 사용할 것 이다)

const handleListen = () => {
  console.log(`Listening on http://localhost:3000`);
};

const server = http.createServer(app); // express application으로 부터 서버를 만듦. 이 서버에서 webSocket을 만들 수 있음, http 서버를 만든것!

const wss = new WebSocket.Server({ server }); // 서버를 전달해서 웹소켓 서버를 만들어서 http 서버, webSocket서버 둘 다 돌리는 것, webSocket 서버를 만든것! 이렇게 되면 localhost:3000은 http, webSocket 서버 둘다 작동 시킬 수 있게 된다.

function handleConnection(socket) {
  console.log("연결 성공!");
}

wss.on("connection", handleConnection); // connection 이벤트에 대한 handle function을 등록했음

server.listen(3000, handleListen);
