const mongoose=require("mongoose");

let sriDB = new mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        requiredd:true
    },
    confirmPassword:{
        type:String,
        requiredd:true
    }
})

module.exports = mongoose.model("sriDB",sriDB)