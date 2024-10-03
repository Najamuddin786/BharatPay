import express from 'express';
import UserSignModel from '../model/user.signup.model.js';
import AdminLoginModel from '../model/admin.login.model.js';
import ProductModel from '../model/product.model.js';
import moment from 'moment-timezone';

const frontend = express.Router();


// productRoutes.js
frontend.get('/product', async (req, res) => {
    try {
        // Find products where status is 'approved'
        const approvedProducts = await ProductModel.find({ status: 'Approve' });

        if (approvedProducts.length === 0) {
            return res.status(404).send({ message: 'No approved products found' });
        }

        return res.status(200).send(approvedProducts); // Send approved products with 200 status
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).send({ message: 'Internal Server Error', error: error.message }); // Send a 500 error response
    }
});
frontend.post('/product/buy', async (req, res) => { // Changed to POST for a buy action
    const { number, password, id } = req.body; // Destructure the request body
    let currentISTTime = moment.tz("Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss');

    try {
        // Check for user credentials (you might want to change this to find an admin, if needed)
        const user = await UserSignModel.findOne({ number, password });

        // If user found
        if (user) {
            let product = await ProductModel.findById(id); // Retrieve the product by ID
                
            
            // Check if the product exists
            if (!product) {
                return res.status(404).send({ message: "Product not found" });
            }

            // Check if the user's recharge balance is sufficient
            if (product.price <= user.recharge) {
                
                user.card.push({
                                _id:product._id,
                                time:currentISTTime,
                                image:product.image,
                                category:product.category,
                                title:product.title,
                                totalIncome:product.totalIncome,
                                originalPrice:product.originalPrice,
                                day:product.day,
                                dailyIncome:product.dailyIncome,
                                price:product.price,
                                dis:product.dis,
                                startday:0,
                                claim:[]
                }); // Add the product to the user's card
                user.recharge -= product.price; // Deduct the product price from the user's recharge balance
                await user.save(); // Save the updated user document

                return res.status(200).send({ 
                    message: "Purchase Successful", 
                    balance: user.recharge, 
                    product: product // Send back the purchased product
                });
            } else {
                return res.status(205).send({ message: "Insufficient balance" }); // Bad request for insufficient balance
            }
        } else {
            // If credentials don't match, send 401 Unauthorized
            return res.status(401).send({ message: 'Invalid number or password' });
        }
    } catch (error) {
        console.error("Error during purchase process:", error);
        // Send a 500 response if there's an internal error
        res.status(500).send({ message: 'Internal server error' });
    }
});

frontend.post('/card', async (req, res) => {
let data=req.body
    try {
        // Fetch all products
        
        let user = await UserSignModel.findOne({
            number:data.number,
            password:data.password
        })
        // Filter products where card day is greater than or equal to card day start
        

        // Return the filtered products
        res.send(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
//   ------------ RECARGE WALLET
frontend.post('/info', async (req, res) => {
    const { number, password } = req.body;

    // Input validation
    if (!number || !password) {
        return res.status(400).json({ message: 'Number and password are required' });
    }

    try {
        // Find the user by number and password
        const user = await UserSignModel.findOne({ number, password });

        // Check if the user exists
        if (!user) {
            return res.status(401).json({ message: 'Invalid number or password' });
        }
        let obj={
            recharge:user.recharge,
            wallet:user.wallet,
            withdrawal:user.withdrawal
        }

        // Return the recharge array of the user
        res.status(200).send(obj);
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // Use sendStatus for status codes
    }
});
//   ------------ Claim Product 
frontend.post('/claim', async (req, res) => {
    let currentISTTime = moment.tz("Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss');
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
        if (daysLeft > 0) {
            // Get the daily income
            let money = mainProduct.dailyIncome;

            // Check if there are any claims made
            let lastClaim = mainProduct.claim.length > 0 
                ? mainProduct.claim[mainProduct.claim.length - 1].time 
                : null;

            if (lastClaim) {
                // Split last claim date and current date to compare
                const [lastDate] = lastClaim.split(" ");
                const [currentDate] = currentISTTime.split(" ");

                // If the last claim was not today, proceed
                if (lastDate !== currentDate) {
                    // Create a new claim object
                    let newClaim = {
                        money: money,
                        claim:"claim",
                        time: currentISTTime,
                    };

                    // Add the new claim to the claim array
                    mainProduct.claim.push(newClaim);
                    
                    // Increment the startday by 1
                    mainProduct.startday += 1;
                    user.wallet += money
                    user.walletD.push(newClaim)

                    // Mark the card array as modified
                    user.markModified('card');

                    // Save the updated user document
                    await user.save();

                    // Respond with the new claim
                    res.status(200).json(newClaim);
                } else {
                    // If the claim was already made today
                    res.status(202).json({ message: 'Claim already made today' });
                }
            } else {
                // No previous claims, allow the first claim
                let newClaim = {
                    money: money,
                    claim:"claim",
                    time: currentISTTime,
                };

                // Add the new claim to the claim array
                mainProduct.claim.push(newClaim);

                // Increment the startday by 1
                mainProduct.startday += 1;
                user.wallet += money
                user.walletD.push(newClaim)

                // Mark the card array as modified
                user.markModified('card');

                // Save the updated user document
                await user.save();

                // Respond with the new claim
                res.status(200).json(newClaim);
            }
        } else {
            // If no days are left in the cycle
            res.status(400).json({ message: 'No active days left to claim' });
        }

    } catch (error) {
        console.error(error);
        res.sendStatus(500); // Internal server error
    }
});
frontend.post('/wallet-history', async (req, res) => {
    const { number, password } = req.body;

    // Input validation
    if (!number || !password) {
        return res.status(400).json({ message: 'Number and password are required' });
    }

    try {
        // Find the user by number and password
        const user = await UserSignModel.findOne({ number, password });

        // Check if the user exists
        if (!user) {
            return res.status(401).json({ message: 'Invalid number or password' });
        }
        let newValue=user.walletD
        res.status(200).send(newValue);
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // Use sendStatus for status codes
    }
});
frontend.post('/product-history', async (req, res) => {
    const { number, password } = req.body;

    // Input validation
    if (!number || !password) {
        return res.status(400).json({ message: 'Number and password are required' });
    }

    try {
        // Find the user by number and password
        const user = await UserSignModel.findOne({ number, password });

        // Check if the user exists
        if (!user) {
            return res.status(401).json({ message: 'Invalid number or password' });
        }
        let newValue=user.card
        res.status(200).send(newValue);
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // Use sendStatus for status codes
    }
});
frontend.post('/recharge-history', async (req, res) => {
    const { number, password } = req.body;

    // Input validation
    if (!number || !password) {
        return res.status(400).json({ message: 'Number and password are required' });
    }

    try {
        // Find the user by number and password
        const user = await UserSignModel.findOne({ number, password });

        // Check if the user exists
        if (!user) {
            return res.status(401).json({ message: 'Invalid number or password' });
        }
        let newValue=user.utr
        res.status(200).send(newValue);
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // Use sendStatus for status codes
    }
});
















export default frontend;
