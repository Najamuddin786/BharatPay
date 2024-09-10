import express from "express";
import UserSignupModel from '../model/user.signup.model.js'; // corrected import

const router = express.Router();

// -----------USERSIGNUP
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
// -----------USER LOGIN
router.post('/login', async (req, res) => {
    const data = req.body;

    try {
        // Check if user exists by number
        let user = await UserSignupModel.findOne({ number: data.number });
        if (!user) {
            return res.status(400).send("Number doesn't match");
        }

        // Check if password matches
        if (user.password !== data.password) {  // Comparing password
            return res.status(400).send("Password doesn't match");
        }

        // Get user's details
        let name = user.name;
        let number = user.number;
        let password = user.password;

        // If login is successful, send the user's details (name, number, password)
        return res.status(200).json({
            message: "Login successful",
            name: name,
            number: number,
            password: password
        });

    } catch (error) {
        console.error("User Login Fail:", error);  // added error logging
        res.status(500).send("Login error, User Login Fail");
    }
});




export default router;
