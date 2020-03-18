import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config(); // .env 파일 안에 있는 정보를 불러온다.

mongoose.connect(process.env.MONGO_URL, {
    userNewUrlParser: true,
    useFindAndModify: false
});

const db = mongoose.connection;

const handleOpen = () => console.log("Connected to DB!!");
const handleError = (error) => console.log(`Error!! : ${error}`);

db.once("open", handleOpen);
db.on("error", handleError);