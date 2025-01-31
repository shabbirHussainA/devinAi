
import express from "express";
import morgan from "morgan"
import connect from "./db/db.js";
import userRoute from "./routes/user.routes.js";
import cookieParser from 'cookie-parser'
import cors from "cors"
import projectRoute from './routes/project.routes.js'
connect();
const app = express()
app.use(cors())
app.use(morgan('dev')); // to get the consoles on every api interacrtions
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser()); // to get data from cookies
app.use('/user',userRoute) // all the user routes
app.use('/project', projectRoute)
app.get('/',(req,res) => {
    res.send("Hello world");
})
export default app;