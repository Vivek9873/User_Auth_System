
const Image = require("../models/image-model");
const cloudinary = require("../config/cloudinary")
const imageHelper = require("../helper/imageHelper")

const uploadImageController = async(req,res)=>{
    const file = req.file;
    console.log("Request ki file",req.file)
    if(!file){
        return res.status(404).json({
            success:false,
            message:"No image found!"
        })
    }

    try{
        const {url,publicId} = await imageHelper(req.file.path); 
        const newImage = new Image({
            url,publicId,
            uploadedBy:req.userInfo.userId,
        })

        await newImage.save();

        res.status(201).json({
            success: true,
            message: "Imaged uploaded successfully",
            image: newImage,
        });
    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:"Something wrong happens!"
        })
    }
}

const getAllImages = async(req,res)=>{
    try{
    
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;
        const skip = (page-1) * limit;
        const sortBy = req.query.sortBy ||  "createdAt";
        const sortOrder = req.query.sortOrder ==="asc"?1:-1;

        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages/limit);

        const sortObj = {};
        sortObj[sortBy] = sortOrder; 
        const allImages = await Image.find().sort(sortObj).skip(skip).limit(limit);
        if(!allImages){
            res.status(403).json({
                success:false,
                message:"No Image Found in the database!",
            })
        }
        else{
            res.status(200).json({
                success:true,
                message:"Images Found!",
                totalPages,
                totalImages,
                data:allImages,
            })
        }
    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:"Something wrong happens!"
        })
    }
}


const deleteImageController = async(req,res)=>{
    try{
        const imageId = req.params.id;
        const userId = req.userInfo.userId;
        const deleteImage = await Image.findById(imageId);

        if(!deleteImage){
            res.status(403).json({
                success:false,
                message:"This image doesn't exists!",
            })
        }
        
        if(userId!==deleteImage.uploadedBy.toString()){
            res.status(403).json({
                success:false,
                message:"You are not authorized to delete this image!",
            })

        }

        await cloudinary.uploader.destroy(deleteImage.publicId);
        await Image.findByIdAndDelete(deleteImage);

        res.status(200).json({
            success: true,
            message: "Image deleted successfully",
        });
        
    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:"Something wrong happens!"
        })
    }
}

module.exports = {uploadImageController,getAllImages,deleteImageController};