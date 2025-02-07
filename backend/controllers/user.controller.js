import * as userService from "../services/user.service.js"
import { validationResult } from "express-validator"
import User from "../models/user.model.js";
import redisClient from "../services/redis.server.js";
import Project from "../models/project.model.js";

export const createUserController = async( req, res) =>{
    // checking if their is any error found using express validator
    const error = validationResult(req);

    if(!error.isEmpty()){
        return res.status(400).json({error: error.array()})
    }
    try {
        const user = await userService.createUser(req.body);
        const token = await user.generateJWT(user._id)
        delete user._doc.password;
        res.status(200).json({user, token})
    } catch (error) {
        res.status(400).send(error.message);
    }
}
export const userLoginController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } =await req.body;
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(404).json({ message: "Please enter a valid email address. User couldn't be found." });
        }

        const isMatch = await user.isValidPassword(password); // Pass the password from request body

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = await user.generateJWT(user._id); 
        delete user._doc.password;
        return res.status(200).json({ user, token });
    } catch (error) {
        res.status(400).send(error.message);
    }
};
// to get profile controller
export const getProfileController = async(req, res) =>{
    
    console.log(req.user)
    res.status(200).json({
        user: req.user
    })
}
//user logout controller
export const logoutUserController = async(req,res) =>{
    try {
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];
        redisClient.set(token,'logout','EX',60*60*24); //expires the token after 24h
        res.status(200).json({
            message: "logout successfully"
        })
        
    } catch (error) {
        console.log(error)
        res.status(400).send(error.message);
    }
}
// export const getAllUsers = async(req,res)=>{
//     const error = validationResult(req);

//     if(!error.isEmpty()){
//         return res.status(400).json({error: error.array()})
//     }
//     try {
//        const project = await Project.findById(req.body.projectId)
//         const users =await userService.getAllUsers({userId: project.users})
//         return res.status(200).json({users})
//     } catch (error) {
//         console.log(error)
//         res.status(400).send(error.message);
//     }
// }
export const getAllUsers = async (req, res) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Consistent naming: errors
    }
  
    try {
      const { projectId } = req.body; // Get projectId from req.body
  
      if (!projectId) {
        return res.status(400).json({ error: "Project ID is required" }); // Handle missing projectId
      }
  
      const project = await Project.findById(projectId);
  
      if (!project) {
        return res.status(404).json({ error: "Project not found" }); // Handle project not found
      }
  
      const projectUsers = project.users || []; // Handle cases where project.users might be null/undefined
  
      // Important Change: Use $nin to exclude users in the project
      const users = await userService.getAllUsers({ excludedUserIds: projectUsers });
  
      return res.status(200).json({ users });
    } catch (error) {
      console.error(error); // Use console.error
      res.status(500).json({ error: "Internal server error" }); // Consistent 500 error
    }
  };
  