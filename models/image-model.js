

const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    url:{
        type:String,
        required:true,
    },
    publicId:{
        type:String,
        required:true,
    },
    uploadedBy:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    }

},{timestamps:true});

module.exports = mongoose.model('Image',imageSchema);