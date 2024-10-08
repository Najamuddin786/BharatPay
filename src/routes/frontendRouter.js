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

frontend.post('/bank-c', async (req, res) => {
    const { number, password, name } = req.body;
    const data = req.body; // Assuming `data` contains bank details

    // Validate incoming data
    if (!number || !password) { // Ensure bank details are included
        return res.status(400).send({ message: "All fields are required." });
    }

    try {
        // Find user by number and name
        let user = await UserSignModel.findOne({ number, password });

        // Check if user exists and password matches (consider using bcrypt to compare passwords)
        if (!user || user.password !== password) {
            return res.status(401).send({ message: "Invalid credentials." });
        }

        // Push the bank details into the user's bank array
        if(user.bank.length<=0){
            return res.status(202).send("Bank not ablable")
        }
        let lastElement = user.bank[user.bank.length - 1];
 // Assuming `data.bank` contains the bank details
        

        // Send back updated user data (excluding password)
     
        res.send(lastElement);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send({ message: "Internal server error." });
    }
});
frontend.post('/bank', async (req, res) => {
    const { number, password, name } = req.body;
    const data = req.body; // Assuming `data` contains bank details

    // Validate incoming data
    if (!number || !password || !data.bank) { // Ensure bank details are included
        return res.status(400).send({ message: "All fields are required." });
    }

    try {
        // Find user by number and name
        let user = await UserSignModel.findOne({ number, password });

        // Check if user exists and password matches (consider using bcrypt to compare passwords)
        if (!user || user.password !== password) {
            return res.status(401).send({ message: "Invalid credentials." });
        }

        // Push the bank details into the user's bank array
        user.bank.push(data); // Assuming `data.bank` contains the bank details
        
        // Save the updated user
        let updatedUser = await user.save();

        // Send back updated user data (excluding password)
        const { password: _, ...userData } = updatedUser._doc; // Exclude password from response
        res.send(userData);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send({ message: "Internal server error." });
    }
});



frontend.post('/team', async (req, res) => {
    const { number, password } = req.body;

    try {
        // Find the primary user by number and password
        const user = await UserSignModel.findOne({ number, password });

        // Check if the primary user exists
        if (!user) {
            return res.status(401).send({ status: "error", message: 'Invalid credentials' });
        }

        // Find first-level referred users
        const firstLevelUsers = await UserSignModel.find({ referralCode: user.refur });

        // Find second-level referred users based on first-level users
        const secondLevelReferralCodes = firstLevelUsers.map(u => u.refur);
        const secondLevelUsers = await UserSignModel.find({ referralCode: { $in: secondLevelReferralCodes } });

        // Find third-level referred users based on second-level users
        const thirdLevelReferralCodes = secondLevelUsers.map(u => u.refur);
        const thirdLevelUsers = await UserSignModel.find({ referralCode: { $in: thirdLevelReferralCodes } });

        // Send the users back to the client with three labels
        res.status(200).send({
            firstLevel: firstLevelUsers,
            secondLevel: secondLevelUsers,
            thirdLevel: thirdLevelUsers
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", message: 'Server error' });
    }
});


















export default frontend;
