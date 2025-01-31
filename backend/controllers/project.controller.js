import { validationResult } from "express-validator"
import * as projectService from "../services/project.server.js"
import UserModel from "../models/user.model.js"
import User from "../models/user.model.js"
export const createProject = async (req, res) => {
    const error = validationResult(req)
    //print all the errors
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()})
    }
    try {
        //getting name from the body
        const {name} = req.body;
        const userId = req.user.userId;
        const newProject = await projectService.createProject({name,userId});
    
        res.status(201).json({newProject})
    } catch (error) {
        console.log(error)
        res.status(400).json({message: error.message})
        
    }
}

export const getAllProject = async(req,res) =>{
try {
    const alluserProj = await projectService.getAllByUserID({
        userId: req.user.userId
    })
    return res.status(200).json({
        projects:alluserProj
    })
} catch (error) {
    console.log(error)
    res.status(400).message({error:error.message})
    
}    
}

export const addUserInProj = async (req,res) =>{
    const error = validationResult(req)
    //print all the errors
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()})
    }
    try {
        const {projectId, users} = req.body;
        const project = await projectService.addUsers({
            projectId,
            users,
            userId: req.user.userId,
        })
        return res.status(200).json({
            project
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({error: error.message})
    }
}

export const getProjectDetails = async (req,res) =>{
    try {
        const {projectId} = req.params;
        const project = await projectService.projDetails({projectId})
        return res.status(200).json({project})
    } catch (error) {
        console.log(error)
        return res.status(400).json({error: error.message})
    }
}

export const deleteProject = async (req,res) => {
    try {
        const {projectId} = req.params;
        const project = await projectService.deleteProject({projectId})
        if (project.deletedCount && project.deletedCount > 0) { // Check if something was actually deleted
            return res.status(200).json({ message: "Project deleted successfully" }); // More descriptive message
          } else if (project.deletedCount === 0) {
            return res.status(404).json({ error: "Project not found" }); // 404 for not found
          }
          else {
            return res.status(200).json({project}) // If project service returns the project
          }
    } catch (error) {
        console.log(error)
        return res.status(400).json({error: error.message})
  }
}