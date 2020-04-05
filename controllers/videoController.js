import routes from "../routes"
import Video from "../models/Video";
import multer from "multer";

export const home = async (req, res) => {
    try {
        const videos = await Video.find({}).sort({ _id: -1 }); // Database에 있는 모든 Video를 가져옴, await 부분이 끝나기전에는 아래의 render를 실행하지 않을 것!!, id순서로 정렬
        res.render("home", { pageTitle: "Home", videos }); // 파일명이 home이고 확장자가 pug인 템플릿 파일을 찾은 후 보여줌
    } catch (error) {
        console.log(error);
        res.render("home", { pageTitle: "Home", videos: [] }); 
    }
}


export const search = async (req, res) => {
    // const searchingBy = req.query.term;
    const {
        query: { term: searchingBy }
    } = req; // 위와 같은 표현
    let videos = [];
    try {
        videos = await Video.find({ title: { $regex: searchingBy, $options: "i" } }); // searchingBy를 포함한 모든 것을 검색, 대소문자를 구분하지 않음
    } catch(error) {
        console.log(error);
    }
    res.render("search", { pageTitle: "Search", searchingBy, videos });
}


export const getUpload = (req, res) => res.render("upload", { pageTitle: "Upload" });


export const postUpload = async (req, res) => { 
    // 할 일 : 비디오 업로드 및 저장
    const {
        body: { title, description },
        file: { path }
    } = req;

    const newVideo = await Video.create({
        fileUrl: path,
        title,
        description,
        creator: req.user.id
    });
    req.user.videos.push(newVideo.id);
    req.user.save();
    res.redirect(routes.videoDetail(newVideo.id));
};
    

export const videoDetail = async (req, res) => {
   // console.log(req.params.id);
    const {
        params: {id}
    } = req;

    try {
        const video = await Video.findById(id).populate("creator"); // id로 찾기, populated : 객체를 데려오는 함수
        console.log(video);
        res.render("videoDetail", { pageTitle: video.title, video }); // video변수를 템플릿에 전달
    } catch(error) { // 존재하지 않는 video ID URL로 가게되면 home으로 redirect시켜줌
        res.redirect(routes.home);
    }
}


export const getEditVideo = async (req, res) => { // 템플릿을 렌더링
    const {
        params: {id}
    } = req;

    try {
        const video = await Video.findById(id);
        if (String(video.creator) !== String(req.user.id)) {
            throw Error();
        } else {
            res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
        }
    } catch(error) {
        res.redirect(routes.home);
    }
}

export const postEditVideo = async (req, res) => { // Video를 업데이트
    const {
        params: {id},
        body: {title, description}
    } = req;

    try {
        await Video.findOneAndUpdate({ _id : id },{ title, description });
        res.redirect(routes.videoDetail(id));
        res.render("editVideo", { pageTitle: "Edit Video", video });
    } catch(error) {
        res.redirect(routes.home);
    }
}

export const deleteVideo = async (req, res) => {
    const {
        params: {id}
    } = req;

    try {
        const video = await Video.findById(id);
        if (String(video.creator) !== String(req.user.id)) {
            throw Error();
        } else {
            await Video.findOneAndRemove({ _id : id });
        }
    } catch (error) {
        console.log(error);
    }
    res.redirect(routes.home);
}