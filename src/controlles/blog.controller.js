import { asyncHandler } from "../utils/asyncHandler.js";
import { Blog } from "../models/blog.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const blog = asyncHandler(async (req, res) => {

    try {
        const { title, description, category } = req.body;

        const imageFilePath = await req.files?.image?.[0]?.path;
        console.log(imageFilePath);
        if (!imageFilePath) {
            throw new ApiError(500, "imageFilePath is required");
        }

        
        const image = await uploadOnCloudinary(imageFilePath);
        
        if (!image) {
            throw new ApiError(409, "image is required");
        }

        const blog = new Blog({
            title,
            description,
            image: image.url,
            category,
            owner: req.userId
        })

        await blog.save()
        console.log(blog);

        const user = await User.findById(req.userId)

        user.blogs.push(blog._id);
        await user.save()


        res.status(200).json(
            new ApiResponse(200, blog, "Blog post created successfully")
        )
    } catch (error) {
        console.log(error);
    }

})

const allBlogs = asyncHandler (async (req,res)=>{
    try {

        const blog = await Blog.find();
        res.status(200).json(
            new ApiResponse(200 , blog , "All blogs fetched")
        )
    } catch (error) {
        throw new ApiError(500, error)
    }
})







const getBlog = asyncHandler(async (req, res) => {
    try {

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            throw new ApiError(500, "Blog post is not found");
        }

        res.status(200).json(
            new ApiResponse(200, blog , "Blog fetched successfully")
        )

    } catch (error) {
        throw new ApiError(500, error)
    }
})

const updateBlog = asyncHandler(async (req, res) => {
    try {
        const { title, description, category } = req.body;

        const imageFilePath = req.files?.image?.[0]?.path;

        if (!imageFilePath) {
            throw new ApiError(500, "imageFilePath is required");
        }

        const image = await uploadOnCloudinary(imageFilePath);

        if (!image) {
            throw new ApiError(409, "image is required");
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            { title, description, category, image: image.url },
            { new: true }
        )

        if (!updatedBlog) {
            throw new ApiError(500, "updated blog is not found");
        }

        res.status(200).json(
            new ApiResponse(200, blog, "Blog is updated successfully")
        )

    } catch (error) {
        throw new ApiError(409, error)
    }
})

const deleteBlog = asyncHandler(async (req, res) => {
    try {
        const deleteblog = await Blog.findByIdAndDelete(req.params.id);

        if (!deleteblog) {
            throw new ApiError(500, "blog post is not found");
        }

        const user = await User.findById(req.userId);
        console.log(user);
        if (!user) {
            throw new ApiError(500, "User not found");
        }
        
        const blogIndex = user.blogs.indexOf(req.params.id);
        if (blogIndex !== -1) {
            user.blogs.splice(blogIndex, 1);
            await user.save();
        }

        res.status(200).json(
            new ApiResponse(201, "blog deleted successfully")
        )


    } catch (error) {
        throw new ApiError(500, error)
    }
})

export { blog, getBlog, updateBlog, deleteBlog, allBlogs }


