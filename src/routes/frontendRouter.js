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
                product.updatedAt=currentISTTime
            
            // Check if the product exists
            if (!product) {
                return res.status(404).send({ message: "Product not found" });
            }

            // Check if the user's recharge balance is sufficient
            if (product.price <= user.recharge) {
                user.card.push(product); // Add the product to the user's card
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








export default frontend;
