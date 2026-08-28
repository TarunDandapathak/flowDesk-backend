//create server using express
import express from "express";
// create server instand
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.routes.js";
import taskRoute from "./routes/task.routes.js";
import cors from "cors";



const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api", taskRoute);
app.use("/api/auth", authRoute);




export default app;

