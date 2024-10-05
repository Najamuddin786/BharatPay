import express from 'express';
import UserSignModel from '../model/user.signup.model.js';
import moment from 'moment-timezone';

const claimRouter = express.Router();

// ------------ Claim Product 
claimRouter.post('/claim', async (req, res) => {
    const currentISTTime = moment.tz("Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss');
    const { number, password, index } = req.body;

    // Input validation
    if (!number || !password || index === undefined) {
        return res.status(400).json({ message: 'Number, password, and index are required' });
    }

    try {
        // Find the user by number and password
        const user = await UserSignModel.findOne({ number, password });

        // Check if the user exists
        if (!user) {
            return res.status(401).json({ message: 'Invalid number or password' });
        }

        // Ensure the index is within bounds
        if (index < 0 || index >= user.card.length) {
            return res.status(404).json({ message: 'Card not found' });
        }

        // Get the card at the provided index
        const mainProduct = user.card[index];
        const daysLeft = mainProduct.day - mainProduct.startday;

        // Check if the product is still active (has days left)
        if (daysLeft <= 0) {
            return res.status(400).json({ message: 'No active days left to claim' });
        }

        // Get the daily income
        const money = mainProduct.dailyIncome;

        // Get last claim time
        const lastClaim = mainProduct.claim.length > 0 ? mainProduct.claim[mainProduct.claim.length - 1].time : null;
        const [lastDate] = lastClaim ? lastClaim.split(" ") : [null];
        const [currentDate] = currentISTTime.split(" ");

        // If the last claim was made today
        if (lastClaim && lastDate === currentDate) {
            return res.status(202).json({ message: 'Claim already made today' });
        }

        // Create a new claim object
        const newClaim = {
            money,
            claim: "claim",
            time: currentISTTime,
        };

        // Update product claims and user wallet
        mainProduct.claim.push(newClaim);
        mainProduct.startday += 1; // Increment the startday by 1
        user.wallet += money;
        user.walletD.push(newClaim); // Add to walletD

        user.markModified('card');
        await user.save();

        // Referral Logic
        const userReferralCode = user.referralCode;

        // Define referral levels: 10%, 5%, and 3%
        const referralLevels = [0.10, 0.05, 0.03]; 

        // Helper function to process referral bonus
        const processReferral = async (referralUser, level, amount) => {
            if (amount > 0) {
                referralUser.wallet += amount;
                const newReferralClaim = {
                    money: amount,
                    claim: `${level + 1} Level`,
                    time: currentISTTime,
                };
                referralUser.walletD.push(newReferralClaim);
                await referralUser.save();
            }
        };

        // Find all users who were referred using the referral code
        const allUserRefur = await UserSignModel.find({ refur: userReferralCode });

        // Process first level referrals
        for (const referralUser of allUserRefur) {
            if (Array.isArray(referralUser.card)) {
                // Update first level referral bonus
                await processReferral(referralUser, 0, money * referralLevels[0]);
                
                // Check for second level referrals
                if (referralUser.referralCode) {
                    const secondLevelReferrals = await UserSignModel.find({ refur: referralUser.referralCode });
                    for (const secondLevelUser of secondLevelReferrals) {
                        await processReferral(secondLevelUser, 1, money * referralLevels[1]);
                        
                        // Check for third level referrals
                        if (secondLevelUser.referralCode) {
                            const thirdLevelReferrals = await UserSignModel.find({ refur: secondLevelUser.referralCode });
                            for (const thirdLevelUser of thirdLevelReferrals) {
                                await processReferral(thirdLevelUser, 2, money * referralLevels[2]);
                            }
                        }
                    }
                }
            }
        }

        // Respond with success
        return res.status(200).json({ message: 'Claim successful' });

    } catch (error) {
        console.error(error);
        res.sendStatus(500); // Internal server error
    }
});

export default claimRouter;
