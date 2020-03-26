import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = mongoose.Schema({
    name: String,
    email: String,
    avatarUrl: String, // fileUrl과 똑같이 동작 (서버로부터의 URL, 깃헙이나 페이스북으로부터의 URL이 될수도 있다)
    facebookId: Number,
    githubId: Number,
});

UserSchema.plugin(passportLocalMongoose, {usernameField: "email"});

const model = mongoose.model("User", UserSchema);

export default model;