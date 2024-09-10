import express from "express";
import UserSignupModel from '../model/user.signup.model.js'; // corrected import

const router = express.Router();

// -----------
router.post('/signup', async (req, res) => {  // corrected 'singup' to 'signup'
    const data = req.body;

    try {
        // Check if user already exists
        let existingUser = await UserSignupModel.findOne({ number: data.number });
        if (existingUser) {
            return res.status(400).send("User already exists");
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

export default router;
