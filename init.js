// application을 호출하는 js
import "./db";
import app from "./app"; // default 로 export 했을 때 이런식으로 import 가능
import dotenv from "dotenv";
import "./models/Video"; // DB에 연결은 되있지만 model이 있는 것을 모르니까 import해줌
import "./models/Comment";

dotenv.config();

const PORT = process.env.PORT || 4000;

const handleListening = () => console.log(`Listening on: http://localhost:${PORT}`);

app.listen(PORT, handleListening);