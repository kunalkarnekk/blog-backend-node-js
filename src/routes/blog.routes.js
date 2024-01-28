import {Router} from "express";
import { checkAuth } from "../middlewares/cheakAuthToken.middleware.js";
import { upload } from "../middlewares/multer.middlware.js";
import { allBlogs, blog, deleteBlog, getBlog, updateBlog } from "../controlles/blog.controller.js";

const router = Router();

router.route('/blog').post(
    upload.fields([
        {
            name: "image",
            maxCount: 1
        },
       
    ]),
checkAuth, blog)


router.route('/allblog').get(allBlogs);

router.route('/:id').get(getBlog)

router.route('/:id').put(
    upload.fields([
        {
            name:"image",
            maxCount: 1
        }
    ]),
updateBlog);

router.route('/:id').delete(checkAuth, deleteBlog)



export default router


