import express from "express";
import UserSignupModel from '../model/user.signup.model.js'; // corrected import
import moment from 'moment-timezone';

const router = express.Router();

// -----------USERSIGNUP
router.post('/signup', async (req, res) => {  // corrected 'singup' to 'signup'
    const data = req.body;

    try {
        // Check if user already exists
        let existingUser = await UserSignupModel.findOne({ number: data.number });
        if (existingUser) {
            return res.status(202).send("User already exists");
        }

        // Create new user
        const newUser = new UserSignupModel(data);
        await newUser.save();

        res.status(201).send("User created successfully");
    } catch (error) {
        console.error("Signup error:", error);  // added error logging
        res.status(500).send("Signup error, Server error");
    }
});
// -----------USER LOGIN
router.post('/login', async (req, res) => {
    const data = req.body;

    try {
        // Check if user exists by number
        let user = await UserSignupModel.findOne({ number: data.number });
        if (!user) {
            return res.status(202).send("Number doesn't match");
        }

        // Check if password matches
        if (user.password !== data.password) {  // Comparing password
            return res.status(202).send("Password doesn't match");
        }

        // Get user's details
        let name = user.name;
        let number = user.number;
        let password = user.password;
        let referralCode = user.referralCode;

        // If login is successful, send the user's details (name, number, password)
        return res.status(200).json({
            message: "Login successful",
            name: name,
            number: number,
            password: password,
            referralCode:referralCode
        });

    } catch (error) {
        console.error("User Login Fail:", error);  // added error logging
        res.status(500).send("Login error, User Login Fail");
    }
});

router.post('/utr',async(req,res)=>{
    let data=req.body
    let currentISTTime = moment.tz("Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss');
    try {
        let resp=await UserSignupModel.findOne({'utr.utr':data.utr})
        if(resp){
            console.log(resp)
            res.send('UTR all ready Claimed')
        }else{
            let user=await UserSignupModel.findOne({'number':data.number})
     
        if(user.number && user.password==data.password){
            user.utr.push({'utr':data.utr,'amount':data.amount,"channel":data.channel,'updatedAt':currentISTTime})
            // res.send(currentISTTime)
            await user.save()
            res.status(202).send('UTR Submited')
        }
            
        }
        
    } catch (error) {
        // const newUser = new UserSignupModel(data);
        // await newUser.save();
        console.log(error)
        res.send(error)
        

        
    }

    // res.send(data)
})




export default router;
