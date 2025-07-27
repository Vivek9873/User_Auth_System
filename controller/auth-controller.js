
const User = require("../models/auth-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const registerUser = async(req,res)=>{
    try{
        const {username,email,password,role} = req.body;
        
        //check if the user is already exists in our database
        const checkExistingUser = await User.findOne({
        $or: [{ username }, { email }],
        });
        if (checkExistingUser) {
        return res.status(400).json({
            success: false,
            message:
            "User is already exists either with same username or same email. Please try with a different username or email",
        });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt);

        const newUser = await User.create({
            username,email,
            password:hashPassword,
            role:role || "user",
        })

        if(newUser){
            res.status(200).json({
                success:true,
                message:"New User Created!",
                data:newUser,
            })
        }
        else{
            res.status(400).json({
                success:false,
                message: "Unable to register user! please try again.",
            })
        }

    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            messgae:"Something went wrong!",
        })
    }
}


const loginUser = async(req,res)=>{
    try{
        const {username,password} = req.body;
        // Check whether username and password exists in database or not
        const name = await User.findOne({username});
        if(!name){
            return res.status(403).json({
                success:false,
                message:"User doesn't exist! Please register yourself",

            })
        }
        const ispasswordMatch = await bcrypt.compare(password,name.password);
        if(!ispasswordMatch){
            return res.status(403).json({
                success:false,
                message:"Invalid Password",

            })
        }

        // create user token
        const accessToken = jwt.sign({
            userId:name._id,
            username:name.username,
            role:name.role,
        },process.env.JWT_SECURITY_KEY,{
            expiresIn:"30m", // THis will tell the lifetime of the access token 
        })

        res.status(200).json({
            success: true,
            message: "Logged in successful",
            accessToken,
        });

    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            messgae:"Something went wrong!",
        })
    }
}

const changePassword = async(req,res)=>{
    
    try{
        const userId = req.userInfo.userId;
    
        // Check this user present in database?
        const user = await User.findById(userId);
        if(!user){
            return res.status(403).json({
                success:false,
                message:"This user doesn't exist",
            })
        }
        
        const {oldPassword,newPassword} = req.body;
        // check oldPassword correct or not
    
        const ispasswordMatch = await bcrypt.compare(oldPassword,user.password);
        if(!ispasswordMatch){
            return res.status(403).json({
                success:false,
                message:"Invalid Old Password! Please try again",
            })
        }

        // new Hash password
        const salt = await bcrypt.genSalt(10);
        const newHashPassword = await bcrypt.hash(newPassword,salt);
        user.password = newHashPassword;
        await user.save();
        res.status(200).json({
            success:true,
            message:"Password changed successfully",
        })
        
    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:"Something went wrong!",
        })
    }
}

module.exports = {registerUser,loginUser,changePassword};