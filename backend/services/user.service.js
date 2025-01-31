import mongoose from "mongoose";
import User from "../models/user.model.js";
import userModel from "../models/user.model.js";


export const createUser = async ({
    email,password
})=> {
    if(!email || !password){
        throw new Error("Email and Password are required");
    }
    const hashPassword = await userModel.hashPassword(password);
    const user = userModel.create({
        email,
        password:hashPassword,
    })
    return user;
}
// export const getAllUsers = async({userId})=>{
//     const users = await User.find({ _id: { $ne: userId } })
    
//     console.log(users)
//     return users
// }
// Modified userService.getAllUsers:
export const getAllUsers = async ({ excludedUserIds }) => {
    // Handle the case where excludedUserIds might be null or undefined
    const query = excludedUserIds && excludedUserIds.length > 0 ? { _id: { $nin: excludedUserIds } } : {};
  const users = await User.find(query);
  return users;
};