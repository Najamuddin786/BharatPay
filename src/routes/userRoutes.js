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

        // Handle referral code assignment
        if (user.refur === 0) {
            let lastSixDigits = data.number.toString().slice(-6);
            let randomInt = Math.floor(Math.random() * 99) + 1;
            let newNumber = Number(lastSixDigits) + Number(randomInt);

            let allUsers = await UserSignupModel.find();
            
            // Use a loop to ensure the generated referral number is unique
            let isUnique = false;
            while (!isUnique) {
                isUnique = true;  // Assume it is unique unless proven otherwise

                for (let existingUser of allUsers) {
                    if (existingUser.refur === newNumber) {
                        newNumber += Math.floor(Math.random() * 99) + 1;  // Generate a new number
                        isUnique = false;  // Repeat the loop if a match is found
                        break;  // Break out of the for loop and retry with a new number
                    }
                }
            }

            // Once a unique referral number is found, assign it to the user and save
            user.refur += newNumber;
            user.markModified('refur');
            let updatedUser = await user.save();

            return res.status(200).send(updatedUser);
        }

        // Get user's details
        let { name, number, password, referralCode } = user;

        // If login is successful, send the user's details
        return res.status(200).json({
            message: "Login successful",
            name: name,
            number: number,
            password: password,
            referralCode: referralCode
        });

    } catch (error) {
        console.error("User Login Fail:", error);  // added error logging
        res.status(500).send("Login error, User Login Fail");
    }
});

// -----------------
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

router.post('/utrHis', async (req, res) => {
    let data = req.body;

    try {
        // Find the user by number
        let user = await UserSignupModel.findOne({ 'number': data.number });
        
        // Check if user exists and if the password matches
        if (user && user.password === data.password) {
            res.status(200).send([{"uts":user.utr},{"ch":user.utr}]);
        } else {
            res.status(404).send("User Not Found");
        }

    } catch (error) {
        // Handle any errors that might occur during the database query
        console.error(error);
        res.status(500).send("Server error");
    }
});





export default router;
