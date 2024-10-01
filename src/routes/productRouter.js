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

product.get('/product', async (req, res) => {
    try {
        const product = await ProductModel.find(); // Use await to get the product
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }
        return res.status(200).send(product); // Send product with 200 status
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).send({ message: 'Internal Server Error', error: error.message }); // Send a 500 error response
    }
});





// PATCH route to update product status
product.patch('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // Assume status is sent in the request body
    console.log(id)

    try {
        const updatedProduct = await ProductModel.findByIdAndUpdate(id, { status }, { new: true }); // Update product and return the new version
        if (!updatedProduct) {
            return res.status(404).send({ message: 'Product not found' });
        }
        return res.status(200).send(updatedProduct); // Send the updated product
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).send({ message: 'Internal Server Error', error: error.message }); // Send a 500 error response
    }
});





export default product;
