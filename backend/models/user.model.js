import mongoose from "mongoose";
import bcrypt, { compare } from "bcrypt"
import jwt from "jsonwebtoken"
const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength:[6,"Email must be atleast 6 character long"],
        maxLength:[50,"email must not be longer than 50 characters"]
    },
    password:{
        type: String,
        select: false,

    }
})
//crating functions for models
userSchema.statics.hashPassword = async function (password){
    return await bcrypt.hash(password,10)
}
userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};
userSchema.methods.generateJWT = async function (userId ){ // jwt will be expired in 24 hours
    // token will contain user email
    return await jwt.sign({email: this.email,userId:userId}, process.env.JWT_PASS,{expiresIn: '24h'})
}
const User = mongoose.model('user',userSchema);

export default User;