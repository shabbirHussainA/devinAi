import http from "http"
import app from "./app.js"
import 'dotenv/config.js'
import {Server} from 'socket.io'
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import Project from "./models/project.model.js";
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin: '*'
    }
})
io.use(async(socket,next) =>{
try {
    const token = socket.handshake.auth?.token || socket.handshake.headers.authorization.split(' ')[1]
    const project = socket.handshake.query.projectId //getting the projectid
    if(!mongoose.Types.ObjectId.isValid(project)){
        return next(new Error('project id is invalid'))
    }
    socket.project = await Project.findById(project) //setting projectid into the socket
    if(!token) return next(new Error('Authentication Error'))
    const decoded = jwt.verify(token,process.env.JWT_PASS)
    if(!decoded) return next(new Error("Authentication Error"))
    socket.user = decoded;
    next();
} catch (error) {
    next(error)
}
})
io.on('connection', socket => {
    console.log('socket connected successfully')
    socket.roomId = socket.project._id.toString()
    //connecting the socketio client user to the desired project on connection of the socketio
    socket.join( socket.roomId)
    socket.on('project-message',data =>{
        console.log('data', data)
        socket.broadcast.to(socket.roomId).emit('project-message', data);
    })
    socket.on('event', data => { /* … */ });
    socket.on('disconnect', () => { 
        console.log('disconnect')
        socket.leave(socket.roomId)
     });
});


server.listen(PORT,() =>{
    console.log(`server is running on port ${PORT}`)
})