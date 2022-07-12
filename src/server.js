import { count } from "console";
import express from "express";
import http from "http";
import SocketIO from "socket.io";
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
const httpServer = http.createServer(app);

/* socket.io 서버 생성 */
const ioServer = SocketIO(httpServer);

/* room list print */
function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = ioServer;
  const publicRooms = [];
  rooms.forEach((value, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

/* user count */
function countRoom(roomName) {
  return ioServer.sockets.adapter.rooms.get(roomName)?.size;
}

ioServer.on("connection", (socket) => {
  socket["nickName"] = "익명";

  socket.onAny((event) => {
    console.log(ioServer.sockets.adapter);
    console.log(`Socket Event: ${event}`);
  });
  /* 방 입장시 Event */
  socket.on("room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome", socket.nickName, countRoom(roomName));
    ioServer.sockets.emit("room_change", publicRooms());
  });
  /* 방 퇴장시 Event */
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickName, countRoom(room) - 1)
    );
  });
  /* 방 퇴장 후 Event */
  socket.on("disconnect", () => {
    ioServer.sockets.emit("room_change", publicRooms());
  });
  /* 메시지 전송 Event */
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket["nickName"]}: ${msg}`);
    done();
  });
  /* 닉네임 받는 Event */
  socket.on("nick", (nick) => {
    socket["nickName"] = nick;
  });
});

const handleListen = () => {
  console.log(`Listening on http://localhost:3000`);
};
httpServer.listen(3000, handleListen);
