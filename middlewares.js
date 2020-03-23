import routes from "./routes";
import multer from "multer";

const multerVideo = multer({dest: "uploads/videos/"});

export const localsMiddleware = (req, res, next) => {
    //locals 추가 -> 추가되면 이것들을 템플릿, 컨트롤러 어디서든 사용 가능
    res.locals.siteName = "WeTube"; // siteName : 변수명처럼 작동 -> main.pug, footer.pug 등
    res.locals.routes = routes;
    res.locals.user = {
        isAuthenticated: false,
        id: 1
    };
    next(); // 미들웨어가 next에 req를 전달해야함
};

export const uploadVideo = multerVideo.single("videoFile");