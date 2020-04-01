import passport from "passport";
import routes from "../routes";
import User from "../models/User";

// 회원가입
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


// 로그인
export const getLogin = (req, res) => {
    res.render("login", { pageTitle: "Login" });
}

export const postLogin = passport.authenticate("local", {  // local : 우리가 설치해준 Strategy의 이름
    failureRedirect: routes.login, // 만약 로그인하는 데 실패했다면
    successRedirect: routes.home
}); 


// 깃허브 로그인 (인증)
export const githubLogin = passport.authenticate("github");

export const githubLoginCallback = async (_, __, profile, cb) => {
    const { _json: {id, avatar_url: avatarUrl, name, email} } = profile;
    try {
        const user = await User.findOne({email});
        if(user) {
            user.githubId = id;
            user.avatarUrl = avatarUrl;
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


// 페이스북 로그인(인증)
export const facebookLogin = passport.authenticate("facebook");

export const facebookLoginCallback =  (accessToken, refreshToken, profile, cb) => {
    console.log(accessToken, refreshToken, profile, cb);
}

export const postFacebookLogin = (req, res) => {
    res.redirect(routes.home);
}


// 로그아웃
export const logout = (req, res) => {
    req.logout();
    res.redirect(routes.home);
};



// 유저정보
export const getMe = (req, res) => {
    res.render("userDetail", { pageTitle: "UserDetail" , user: req.user}); // req.user : 현재 로그인된 사용자
}

export const userDetail = async (req, res) => {
    const { params: { id } } = req;
    try {
        const user = await User.findById(id);
        res.render("userDetail", { pageTitle: "UserDetail", user });
    } catch(error) {
        res.redirect(routes.home);
    }
}


// 정보수정
export const editProfile = (req, res) => res.render("editProfile", { pageTitle: "EditProfile" });

export const changePassword = (req, res) => res.render("changePassword", { pageTitle: "ChangePassword" });
