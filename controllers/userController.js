import passport from "passport";
import routes from "../routes";
import User from "../models/User";

export const getJoin = (req, res) => {
    res.render("join", { pageTitle: "Join" });
}

export const postJoin = async (req, res, next) => {
    //console.log(req.body);
    const {
        body: { name, email, password, password2 }
    } = req;
    if (password !== password2) {
        res.status(400);
        res.render("join", { pageTitle: "Join" });
    } else {
        try {  // To Do: Register User
        const user = await User({
            name,
            email
        });
        await User.register(user, password);
        next();
    } catch (error) {
        console.log(error);
        res.redirect(routes.home);
    }
        // To Do: Log user in
    }
};

export const getLogin = (req, res) => {
    res.render("login", { pageTitle: "Login" });
}

export const postLogin = passport.authenticate("local", {  // local : 우리가 설치해준 Strategy의 이름
    failureRedirect: routes.login, // 만약 로그인하는 데 실패했다면
    successRedirect: routes.home
}); 

export const githubLogin = passport.authenticate("github");

export const githubLoginCallback = async (_, __, profile, cb) => {
    const { _json: {id, avatar_url: avatarUrl, name, email} } = profile;
    try {
        const user = await User.findOne({email});
        if(user) {
            user.githubId = id;
            user.save();
            return cb(null, user);
        } 
        const newUser = await User.create({
            email,
            name,
            githubId: id,
            avatarUrl
        });
        return cb(null,newUser);
    } catch(error) {
        return cb(error);
    }
};

export const postGithubLogin = (req, res) => {
    res.redirect(routes.home);
};

export const logout = (req, res) => {
    req.logout();
    res.redirect(routes.home);
};

export const getMe = (req, res) => {
    res.render("userDetail", { pageTitle: "UserDetail" , user: req.user}); // req.user : 현재 로그인된 사용자
}

export const userDetail = (req, res) => res.render("userDetail", { pageTitle: "UserDetail" });

export const editProfile = (req, res) => res.render("editProfile", { pageTitle: "EditProfile" });

export const changePassword = (req, res) => res.render("changePassword", { pageTitle: "ChangePassword" });
