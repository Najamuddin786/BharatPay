import express from 'express';
import AdminLoginModel from '../model/admin.login.model.js';
import ProductModel from '../model/product.model.js';

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







export default frontend;
