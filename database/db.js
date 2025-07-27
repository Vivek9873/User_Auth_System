
const mongoose = require("mongoose")
async function connecttoDb(){
    try{
        await mongoose.connect(process.env.MONG0DB_CONNECTION);
        console.log("Mongodb database connnected successfully");
    }
    catch(e){
        console.log(e);
        process.exit(1);

    }
}

module.exports = connecttoDb;