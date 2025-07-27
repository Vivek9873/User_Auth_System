


const adminMiddleware = (req,res,next)=>{
    if(req.userInfo.role!=='admin'){
        return res.status(403).json({
            success:false,
            message:"Access denied! Admin rights required",
        })

    }
    next();

}

module.exports = adminMiddleware;