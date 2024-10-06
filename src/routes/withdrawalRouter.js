import express from 'express';
import UserSignModel from '../model/user.signup.model.js';
import moment from 'moment-timezone';

const withdrawalRouter = express.Router();

// ------------ Claim Product 
withdrawalRouter.post('/withdrawal', async (req, res) => {
    const currentISTTime = moment.tz("Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss');
    const { number, password, amount } = req.body;

    // Input validation
    // if (!number || !password || !amount) {
    //     return res.status(200).send('Amount are required');
    // }

    try {
        // Find the user by number and password
        const user = await UserSignModel.findOne({ number, password });

        // Check if the user exists
        if (!user) {
            return res.status(200).send('Invalid number or password');
        }

        // Check if the withdrawal amount is >= 199
        if (amount < 199) {
            return res.status(200).send('Your amount is less than 199. You cannot withdraw.');
        }

        // Get the current time in IST
        const currentTime = moment.tz("Asia/Kolkata").format('HH:mm');
        const startTime = '00:00';
        const endTime = '24:00';

        // Check if the current time is between 10:00 AM and 12:00 PM
        if (!(currentTime >= startTime && currentTime <= endTime)) {
            return res.status(200).send('Withdrawal time is between 10:00 AM to 12:00 PM.');
        }

        // Check if the user's wallet has sufficient balance
        if (user.wallet < amount) {
            return res.status(200).send('Insufficient wallet balance.');
        }

        // Deduct the amount from the user's wallet
        user.wallet -= amount;
        const newClaim = {
            money:amount,
            claim: "withdrawal",
            time: currentISTTime,
            status:"Pending"
        };
        user.withdrawal +=amount
        user.walletD.push(newClaim)
        await user.save(); // Save the updated user data to the database

        // Return success message
        return res.status(202).send('Withdrawal successful!');

    } catch (error) {
        return res.status(500).send('An error occurred while processing your withdrawal.');
    }
});




// ------------ Get User Balance 
withdrawalRouter.post('/balance', async (req, res) => {
    const { number, password } = req.body;

    // Input validation
    // if (!number || !password) {
    //     return res.status(400).json({ message: 'Number and password are required' });
    // }

    try {
        // Find the user by number and password
        const user = await UserSignModel.findOne({ number, password });

        // Check if the user exists
        if (!user) {
            return res.status(401).json('Invalid number or password');
        }

        // Return the user's current wallet balance
        let f={
            amount:user.wallet, 
            walletD:user.walletD, 
        }
        return res.status(200).send(f);

    } catch (error) {
        return res.status(500).json('An error occurred while retrieving your balance.');
    }
});




export default withdrawalRouter;
