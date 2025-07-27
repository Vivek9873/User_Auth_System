
const jwt = require("jsonwebtoken");

const authMiddleware = (req,res,next)=>{
    // console.log("Auth middleware is called");
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    const token = authHeader && authHeader.split(" ")[1];
    // console.log(token);

    if(!token){
        return res.status(403).json({
            success:false,
            message:"Acess denied. No token provided. Please login to continue",
        })
    }
    
    // decode this token
    try{
        const decodeToken = jwt.verify(token,process.env.JWT_SECURITY_KEY);
        console.log(decodeToken);

        req.userInfo = decodeToken;
        next();
    }
    catch(e){
        console.log(e);
        return res.status(500).json({
            success:false,
            message:"Something went wrong!",
        })
    }
    

    
}


module.exports = authMiddleware;