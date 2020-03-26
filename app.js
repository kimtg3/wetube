// const express = require("express"); // reqire : node module을 어딘가에서 가져오는것
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport from "passport";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import { localsMiddleware } from "./middlewares"; // default 아니고 그냥 export 했을 때  이렇게 import함 
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import routes from "./routes";
import "./passport";

const app = express(); // const를 선언한 변수 app에 express를 실행해서 담음

const CookieStore = MongoStore(session);

app.use(helmet()); //  보안을 위한 것 
app.set("view engine", "pug"); // view endgine을 pug으로 설정
app.use("/uploads", express.static("uploads")) //  만약 누군가 /uploads로 간다면 express.static() 을 이용해서 uploads라는 directory안으로 들어감
app.use("/static", express.static("static"));
app.use(cookieParser()); // cookie를 파싱
app.use(bodyParser.json()); // body를 파싱, 없으면 사용자가 전달하는 정보를 받을 수 없다.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev")); // 로그 기록을 보여준다
app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: true,
        saveUninitialized: false,
        store: new CookieStore({ mongooseConnection: mongoose.connection }) // 새로운 쿠키저장소 mongoDB와 연결해야함 , 서버 재시작해도 세션정보 보존
    })
);
app.use(passport.initialize()); // 초기화, 스스로 쿠키를 들여다보고 그 쿠키정보에 해당하는 사용자를 찾아준다, 그 후 그 사용자를 요청에 의해 object 즉 req.user로 만들어줌
app.use(passport.session());

// app.use("/user", userRouter); // 누군가 /user의 경로에 접근하면 userRouter의 모든 경로를 쓰겠다.
app.use(localsMiddleware);
app.use(routes.home, globalRouter); // 3개의 router 사용
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);

export default app; // 누군가 내 파일을 불러올 때 (import) app object를 주겠다.


/* 
express를 import 했고, express를 실행한 결과를 app상수로 만들었다.
그리고 middleware들을 추가했다.
cookieParser는 cookie를 전달받아서 사용할 수 있도록 만들어주는 middleware이다. -> 사용자 인증 같은 곳에서 쿠키를 검사할 때 사용한다.
bodyParser는 사용자가 웹사이트로 전달하는 정보들을 검사하는 middelware이다. -> request 정보에서 form이나 json 형태로 된 body를 검사한다.
helmet middleware는 application이 더 안전하도록 만들어줌.
morgan middleware는 application에서 발생하는 모든 일을 logging 한다.
*/