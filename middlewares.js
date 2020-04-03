import routes from "./routes";
import multer from "multer";

const multerVideo = multer({dest: "uploads/videos/"});
const multerAvatar = multer({dest: "uploads/avatars/"});

export const localsMiddleware = (req, res, next) => {
    //locals 추가 -> 추가되면 이것들을 템플릿, 컨트롤러 어디서든 사용 가능
    res.locals.siteName = "WeTube"; // siteName : 변수명처럼 작동 -> main.pug, footer.pug 등
    res.locals.routes = routes;
    res.locals.loggedUser = req.user || null;
    console.log(req.user);
    next(); // 미들웨어가 next에 req를 전달해야함
};

export const onlyPublic = (req, res, next) => { // 오직 로그아웃된 사용자에게망 join, login 화면 접속가능
    if(req.user) {
        res.redirect(routes.home);
    } else {
        next();
    }
}

export const onlyPrivate = (req, res, next) => { // 오직 로그인된 사용자만 이용가능하게하는 미들웨어
    if(req.user) {
        next();
    } else {
        res.redirect(routes.home);
    }
}

export const uploadVideo = multerVideo.single("videoFile");

export const uploadAvatar = multerAvatar.single("avatar");