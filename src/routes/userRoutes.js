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
router.post('/utr', async (req, res) => {
    let data = req.body;
    let currentISTTime = moment.tz("Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss');

    try {
        let user = await UserSignupModel.findOne({ 'number': data.number });
        if (!user) {
            return res.status(404).send('User not found');
        }
        // Check if UTR already exists
        let existingUTR = await UserSignupModel.findOne({ 'utr.utr': data.utr });
        if (existingUTR) {
            console.log(existingUTR);
            return res.status(200).send('UTR already claimed');
        }

        // Check if the user exists based on the number
        

        // Verify password
        if (user.password === data.password) {
            // Add UTR information to user's array
            user.utr.push({
                'utr': data.utr,
                'amount': data.amount,
                "channel": data.channel,
                'updatedAt': currentISTTime,
                "status":"pending"
            });

            await user.save();
            return res.status(202).send('UTR submitted successfully');
        } else {
            return res.status(401).send('Invalid password');
        }

    } catch (error) {
        console.error(error);
        return res.status(500).send('Server error');
    }
})




export default router;
