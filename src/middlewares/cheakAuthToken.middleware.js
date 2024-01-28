import jwt from "jsonwebtoken"

function checkAuth(req,resp,next){
    //1.get auth and refresh token from cookies , if they dont exist return error
    //2.check expiry of authtoken, if auth token is not expired then all is well exit function.
    //3.check expiry of refresh token, if refresh token is expired then ask for re login.
    //4.if refresh token is not expired but auth token is expired then regenrate both token.

    const authToken = req.cookies.authToken;
    const refreshToken = req.cookies.refreshToken;

    console.log("authToken" , authToken , "refreshtiken" , refreshToken);
    if(!authToken || !refreshToken){
        return resp.status(401).json({
            message:'Authentication failed: No authToken or refreshToken provided'
        });

    }

    jwt.verify(authToken , process.env.ACCESS_TOKEN_SECRET, (err,decoded)=>{
        //expired
        if(err){
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (refreshErr, refreshDecoded)=>{
                //refresh token is expired & access token is expired
                if(refreshErr){
                    return resp.status(401).json({
                        message:"Authentication failed: Both tokens are invalid"
                    })
                }
                //refresh token not expired & acess token is expired
                else{
                    const newAuthToken = jwt.sign({userId: refreshDecoded.userId}, process.env.ACCESS_TOKEN_SECRET , {expiresIn:process.env.ACCESS_TOKEN_EXPIRY});
                    const newRefreshToken = jwt.sign({userId:refreshDecoded.userId}, process.env.JWT_REFRESH_SECRET_KEY, {expiresIn:process.env.REFRESH_TOKEN_EXPIRY});

                    resp.cookie('authtoken', newAuthToken, {httpOnly:true});
                    resp.cookie('refreshtoken', newRefreshToken , {httpOnly:true});
                    next()
                }
            })
        }

        //not expired
        else{
            req.userId = decoded.userId;
            next();
        }
    })
}

export {checkAuth}