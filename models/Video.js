import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({ // mongoDB에 우리의 파일의 형식을 알려준다.
    fileUrl: {
        type: String,
        required: "File URL is required" // file URL이 없는 비디오를 생성하려 한다면 이  error message를 받는다.
    },
    title: {
        type: String,
        required: "Title is required"
    },
    description: String,
    views: {
        type: Number,
        default: 0 // 처음 비디오가 생성되면 views를 0이 되게 한다.
    },
    createdAt: {
        type: Date,
        default: Date.now // 현재 날짜를 반환하는 function
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

const model = mongoose.model("Video", VideoSchema); // definition을 통해 실제 document를 만드는것
export default model;