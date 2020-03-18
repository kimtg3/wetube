// 이 파일을 바꾸면 모든 파일에 적용할 수 있게 하기위해 여기서 관리

import e from "express";

// Global

const HOME = "/";
const JOIN = "/join";
const LOGIN = "/login";
const LOGOUT = "/logout";
const SEARCH = "/search";

// Users

const USERS = "/users";
const USER_DETAIL = "/:id";
const EDIT_PROFILE = "/edit-profile";
const CHANGE_PASSWORD = "/change-password";

// Videos

const VIDEOS = "/videos";
const UPLOAD = "/upload";
const VIDEO_DETAIL = "/:id"; // 만약 controller에서 어떤 data를 가지고 있다는 것을 표현하고 싶다면 더블콜론(:)과 이름을 넣으면 된다
const EDIT_VIDEO = "/:id/edit";
const DELETE_VIDEO = "/:id/delete"; // :를 붙이면 변하는 값이라는 것을 의미

const routes = { // 객체를 만듬
    home: HOME,
    join: JOIN,
    login: LOGIN,
    logout: LOGOUT,
    search: SEARCH,
    users: USERS,
    userDetail: id => {
        if(id) {
            return `/users/${id}`;
        } else {
            return USER_DETAIL;
        }
    },
    editProfile: EDIT_PROFILE,
    changePassword: CHANGE_PASSWORD,
    videos: VIDEOS,
    upload: UPLOAD,
    videoDetail: id => {
        if(id) {
            return `/videos/${id}`;
        } else {
            return VIDEO_DETAIL;
        }
    },
    editVideo: id => {
        if(id) {
            return `/videos/${id}/edit`;
        } else {
            return EDIT_VIDEO;
        }
    },
    deleteVideo: id => {
        if(id) {
            return `/videos/${id}/delete`;
        } else {
            return DELETE_VIDEO
        }
    }
};

export default routes;