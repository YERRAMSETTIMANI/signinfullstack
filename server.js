const express= require("express");
const mongoose=require("mongoose");
const sriDB=require("./model");
const jwt=require("jsonwebtoken");
const middleware = require("./middleware");
const cors =require("cors")
const app=express();

mongoose.connect("mongodb+srv://Mani123:Mani123@cluster0.t8hfzn9.mongodb.net/?retryWrites=true&w=majority").then(()=>{
    console.log("DB connnected");
})
app.use(express.json());
app.use(cors({origin:"*"}))
app.post("/register", async (req,res)=>{
     const {user,email,password,confirmPassword} = req.body
     try{
         let exist = await sriDB.findOne({email});
         if(exist){
            return res.status(400).send("User already existed")
         } 
         if(password !== confirmPassword){
            return res.status(400).send("Password mismatch")
         }
         let newData = new sriDB({
            user,email,password,confirmPassword
         })
         await newData.save();
         return res.status(200).send("User registered successfully")
     }
     catch(err){
        console.log(err);
        return res.status(500).send("Internal error")
     }
})

app.post("/login", async (req,res)=>{
    const {email,password} = req.body
    try{
        let exist = await sriDB.findOne({email});
        if(!exist){
           return res.status(400).send("User not existed")
        } 
        if(password !== exist.password){
           return res.status(400).send("Passssword mismatch")
        }

        let payload = {
            user:{
                id : exist.id
            }
        }

        jwt.sign(payload,"jwtKey",{expiresIn:3600000},
        (err,token)=>{
            if (err) throw err;
            return res.json({token})
        })

    }
    catch(err){
       console.log(err);
       return res.status(500).send("Internal error")
    }
})

app.get("/myprofile",middleware, async (req,res)=>{
    try{
         let newId = req.user.id;
         let exist = await sriDB.findById(newId);
         if(!exist){
            return res.status(400).send("user id not existed")
         }
         return res.json(exist);

    }
    catch(err){
        console.log(err);
        return res.status(500).send("Internal error");
    }
})

app.listen(5000,()=>{
    console.log("server is running");
})