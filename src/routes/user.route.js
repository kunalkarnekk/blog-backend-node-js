import { Router } from "express";
import {loginUser, registerUser} from "../controlles/user.controller.js"
const router = Router()


router.route("/register").post(registerUser)

router.post('/register', (req,res)=>{
    res.send('hello worlffffffffffffd')
})

router.route('/login').post(loginUser)

export default router;
