import passport from "passport";
import GithubStrategy from "passport-github";
import User from "./models/User";
import { githubLoginCallback } from "./controllers/userController";
import routes from "./routes";

passport.use(User.createStrategy()); // passport야, strategy(로그인 하는 방식)를 하나 사용해라

passport.use(new GithubStrategy({
        clientID: process.env.GH_ID,
        clientSecret: process.env.GH_SECRET,
        callbackURL: `http://localhost:4000${routes.githubCallback}`
    },
    githubLoginCallback
));

passport.serializeUser(User.serializeUser()); // 쿠키를 user.id에 담고
passport.deserializeUser(User.deserializeUser()); // 그 id로 사용자를 식별한다!