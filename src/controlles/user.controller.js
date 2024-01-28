import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (
        [name, email, password].some((field) => {
            field?.trim() === " "
        })
    ) {
        throw new ApiError(500, "All fields are required");
    }
    const existedUser = await User.findOne({
        $or: [{ email }]
    });

    if (existedUser) {
        throw new ApiError(409, 'Email and name already exist');
    }


    const user = await User.create({
        name,
        email,
        password
    })

    const createUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    


    return res.status(200).json(
        new ApiResponse(200, user, "User register successfully")
    )

})


const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        
        if (!user) {
            throw new ApiError(409, "Invalid credintials")
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new ApiError(500, "Invalid credintials")
        }


        const authToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });

        const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
        console.log('auth and refresh', authToken , refreshToken);
        res.cookie('authToken', authToken, { httpOnly: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true });

        return res.status(200).json(
            new ApiResponse(201, user , "User login successfully")
        )
    } catch (error) {
        console.log("Error", error);
    }
})

export { registerUser, loginUser }
