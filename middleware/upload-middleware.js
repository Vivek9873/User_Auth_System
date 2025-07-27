
const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"upload/")
    },
    filename:function(req,file,cb){
        cb(null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        )
    }

});


// file filter functoin 

const checkFilter = (req,file,cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null,true);
    }
    else{
        cb(new Error("Now an image! Please upload an image"));
    }


}


// multer middleware

module.exports = multer({
    storage:storage,
    fileFilter:checkFilter,
    limits:{
        fileSize: 5 * 1024 * 1024 // 5 Mb file size limit
    },
})

