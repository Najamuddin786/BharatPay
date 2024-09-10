import express from "express";
import UserSingModel from '../model/user.singup.model.js'

const router = express.Router();

// -----------
router.post('/singup',async(req,res)=>{
    const data=req.body;
    try {
        let existingUser=await UserSingModel.findOne({number:data.number})
        if(existingUser){
            return res.status(400).send("User already exists");
        }
        const newUser = new UserSingModel(data)
        await newUser.save();
        res.status(201).send("User created successfully");
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).send("Server error");
        
    }

})


export default router;

