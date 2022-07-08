import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public")); // 유저가 /public으로 가게 되면 __dirname + /public 폴더를 보여주게 할 것이다

app.get("/", (req, res) => res.render("home")); // /에 접속하면 home.pug를 렌더링한다.

const handleListen = () => {
  console.log(`Listening on http://localhost:3000`);
};
app.listen(3000, handleListen); // 3000번 포트를 listen하고 handleListen func를 실행한다.
