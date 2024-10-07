import express from 'express';
import UserSignModel from '../model/user.signup.model.js';
import moment from 'moment-timezone';

const trs = express.Router();

// ------------ Transfer Wallet to Recharge
trs.post('/trs', async (req, res) => {
    const currentISTTime = moment.tz("Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss');
    const { number, password, amount } = req.body;

    // Input validation
    if (!number || !password || !amount) {
        return res.status(400).send('Number, password, and amount are required');
    }

    try {
        // Find the user by number and password
        const user = await UserSignModel.findOne({ number, password });

        // Check if the user exists
        if (!user) {
            return res.status(401).send('Invalid number or password');
        }

        // Check if the user has enough wallet balance
        if (amount > user.wallet) {
            return res.status(200).send('Insufficient wallet balance');
        }

        // Deduct the amount from the user's wallet and add to recharge
        user.wallet -= amount;
        user.recharge +=Number(amount);
        
        // Create a new claim record for the transaction
        const newClaim = {
            money: amount,
            claim: "WalletToRecharge",
            time: currentISTTime
        };
       
        user.walletD.push(newClaim);
        await user.save(); // Save the updated user data to the database

        // Return success message
        return res.status(202).send('Transfer successful!');

    } catch (error) {
        return res.status(500).send('An error occurred while processing your request');
    }
});


export default trs;
