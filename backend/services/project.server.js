import mongoose from "mongoose";
import ProjectModel from "../models/project.model.js";
//mongodb service to create a proj
export const createProject = async ({
    name,
    userId
}) => {
    if(!name){
        throw new Error('Name is required');
    }
    if(!userId){
        throw new Error('Name is required');
    }
    const Project = await ProjectModel.create({
        name,
        users: [userId]
    })
    return Project
}


export const getAllByUserID = async({userId})=>{
    if(!userId){
        throw new Error('User id is required')
    }

    const getAllUserProj =await ProjectModel.find({
        users:userId
    })
    return getAllUserProj
}
export const addUsers = async ({ projectId, users, userId }) => {
  try {
    // Validate projectId
    if (!projectId) throw new Error("Project ID is required");
    if (!mongoose.Types.ObjectId.isValid(projectId)) throw new Error("Invalid Project ID");

    // Validate users array
    if (!users || !Array.isArray(users)) throw new Error("Users array is required and must be an array");
    if (users.some((user) => !mongoose.Types.ObjectId.isValid(user))) {
      throw new Error("Invalid user IDs in users array");
    }

    // Validate userId
    if (!userId) throw new Error("User ID is required");
    if (!mongoose.Types.ObjectId.isValid(userId)) throw new Error("Invalid User ID");

    // Find the project and ensure the requesting user is part of the project
    const project = await ProjectModel.findOne({
      _id: projectId,
      users: userId,
    });

    if (!project) throw new Error("User does not belong to this project");

    // Add users to the project if they are not already present
    const updatedUsers = [...new Set([...project.users.map(String), ...users.map(String)])]; // Ensures unique user IDs
    project.users = updatedUsers;

    // Save the updated project
    await project.save();

   return project
  } catch (error) {
    console.error("Error adding users to the project:", error.message);
    throw new Error(error.message);
  }
};

export const projDetails = async({projectId}) =>{
  if(!projectId) throw new Error("Project ID is required")
  if(!mongoose.Types.ObjectId.isValid(projectId)) throw new Error(" project id is invalid")
  const project = await ProjectModel.findById(projectId).populate('users')
  return project
}

export const deleteProject = async({projectId}) =>{
  if(!projectId) throw new Error("Project ID is required")
  if(!mongoose.Types.ObjectId.isValid(projectId)) throw new Error(" project id is invalid")
  const project = await ProjectModel.deleteOne({_id: projectId})
return project
}