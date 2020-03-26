import express from "express";
import passport from "passport";
import routes from "../routes"; // .. : 이 디렉토리 밖에서 찾아야 하니까
import { home, search } from "../controllers/videoController";
import { getJoin, postJoin, getLogin, postLogin, logout, githubLogin, postGithubLogin, getMe } from "../controllers/userController";
import { onlyPublic, onlyPrivate } from "../middlewares";

const globalRouter = express.Router();

globalRouter.get(routes.join, onlyPublic, getJoin);
globalRouter.post(routes.join, onlyPublic, postJoin, postLogin); // join화면에서 username과 email을 넣어줬을때 먼저 postJoin에서 가입을 시킬 것이고 postLogin에서 로그인 시킬 것이다.

globalRouter.get(routes.login, onlyPublic, getLogin);
globalRouter.post(routes.login, onlyPublic, postLogin);

globalRouter.get(routes.home, home);
globalRouter.get(routes.search, search);
globalRouter.get(routes.logout, onlyPrivate, logout);

globalRouter.get(routes.github, githubLogin);
globalRouter.get(
    routes.githubCallback, 
    passport.authenticate("github", { failureRedirect: "/login" }),
    postGithubLogin
);

globalRouter.get(routes.me, getMe);


export default globalRouter;