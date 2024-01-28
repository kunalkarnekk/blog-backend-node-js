import mongoose, { mongo } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        toLowerCase:true,
        trim:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        
    },
    blogs:{
        type:Array,
        default:[]
    }
},{
    timestamps:true
})


UserSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password , 8)
    next()
})

// UserSchema.methods.isPasswordCorrect =  async function(password){
//     return await bcrypt.compare(password, this.password)
// }

// UserSchema.methods.GenerateAccessToken = function () {
//     jwt.sign({
//         id:this._id,
//         email: this.email,
//         name: this.name
//     },
//         process.env.ACCESS_TOKEN_SECRET , {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
//     )
// }

// UserSchema.methods.GenerateRefToken = function (){
//     jwt.sign({
//         id: this._id
//     },
//         process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
//     )
// }

export const User = mongoose.model("User", UserSchema);