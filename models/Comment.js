import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: "Text is required"
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    /*,
    video: {
        type: mongoose.Schema.Types.ObjectId, // 어떤 object ID가 어디서 온건지를 알려줘야함. 어느 model에서 온건지
        ref: "Video" // Video 라는 모델에서 왔다!!
    }*/
})

const model = mongoose.model("Comment", CommentSchema);
export default model;