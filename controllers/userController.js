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

export const facebookLoginCallback =  async (_, __, profile, cb) => {
    const { _json: {id, name, email}} = profile; // profile 안에 있는 _json 안에서
    try {
        const user = await User.findOne({email});
        if(user) {
            user.githubId = id;
            user.avatarUrl = `https://graph.facebook.com/${id}/picture?type=large`;
            user.save();
            return cb(null, user);
        } 
        const newUser = await User.create({
            email,
            name,
            facebookId: id,
            avatarUrl : `https://graph.facebook.com/${id}/picture?type=large`
        });
        return cb(null,newUser);
    } catch(error) {
        return cb(error);
    }
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
export const getMe = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).populate("videos"); // req.user : 현재로그인된 사용자
      res.render("userDetail", { pageTitle: "User Detail", user });
    } catch (error) {
      res.redirect(routes.home);
    }
  };

export const userDetail = async (req, res) => {
    const { params: { id } } = req;
    try {
        const user = await User.findById(id).populate("videos");
        console.log(user);
        res.render("userDetail", { pageTitle: "User Detail", user });
    } catch(error) {
        res.redirect(routes.home);
    }
};


// 정보수정
export const getEditProfile = (req, res) => {
    res.render("editProfile", { pageTitle: "Edit Profile" });
}

export const postEditProfile = async (req, res) => {
    const {
        body: {name, email},
        file,
    } = req;
    try {
        await User.findByIdAndUpdate(req.user._id, {
            name,
            email,
            avatarUrl: file ? file.path : req.user.avatarUrl // 파일이 있으면 그 파일, 없으면 원래의 아바타url
        });
        res.redirect(routes.me);
    } catch(error) {
        res.redirect(routes.editProfile);
    }
};

export const getChangePassword = (req, res) => {
    res.render("changePassword", { pageTitle: "Change Password" });
}

export const postChangePassword = async (req, res) => {
    const {
        body: { oldPassword, newPassword, newPassword1 },
    } = req;
    try {
        if(newPassword !== newPassword1){
            res.status(400); // 매번 구글은 패스워드라고 불리는 필드를 찾아낸다
            res.redirect(`/users${routes.changePassword}`);
            return;
        } 
        await req.user.changePassword(oldPassword, newPassword);
        res.redirect(routes.me);
    } catch(error) {
        res.status(400);
        res.redirect(`/users${routes.changePassword}`);
    }
}

