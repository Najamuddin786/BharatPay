import express from 'express';
import AdminLoginModel from '../model/admin.login.model.js';
import ProductModel from '../model/product.model.js';

const product = express.Router();

product.post('/create', async (req, res) => {
    const data = req.body;
    function cal(){
        let dailyIncome=data.totalIncome / data.day
        data.dailyIncome=dailyIncome

    }
    cal()

    try {
        // Validate admin credentials
        const adminEx = await AdminLoginModel.findOne({
            number: data.number,
            password: data.password // Consider hashing passwords in production
        });

        if (adminEx) {
            // Ensure you have product data in req.body
           
            const newProduct = new ProductModel(data);
            const savedProduct = await newProduct.save(); // Save the product to the database

            return res.status(201).send(savedProduct); // Return the created product
        } else {
            return res.status(401).send("Admin not Validating"); // Return if not found
        }
    } catch (error) {
        return res.status(500).send(error); // Handle error
    }
});

export default product;
