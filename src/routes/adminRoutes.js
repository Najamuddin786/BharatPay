import express from 'express';
import AdminLoginModel from '../model/admin.login.model.js';
import UserSignModel from '../model/user.signup.model.js';

const routerAdmin = express.Router();

routerAdmin.post('/login', async (req, res) => {
    const data = req.body;

    try {
        const adminEx = await AdminLoginModel.findOne({
            number: data.number,
            password:data.password
        });

        if (adminEx) {
            // If admin found, send the admin details
            res.status(200).send(adminEx);
        } else {
            // If credentials don't match, send 401 Unauthorized
            res.status(401).send({ message: 'Invalid number or password' });
        }
    } catch (error) {
        console.log(error);
        // Handle any server errors
        res.status(500).send({ message: 'Internal Server Error', error });
    }
});
routerAdmin.post('/user',async(req,res)=>{
    let data=req.body;
    try {
        const adminEx = await AdminLoginModel.findOne({
            number: data.number,
            password:data.password
        });
        const user = await UserSignModel.find()

        if (adminEx) {
            // If admin found, send the admin details
            res.status(200).send(user);
        } else {
            // If credentials don't match, send 401 Unauthorized
            res.status(401).send({ message: 'Invalid number or password' });
        }
    } catch (error) {
        console.log(error);
        // Handle any server errors
        res.status(500).send({ message: 'Internal Server Error', error });
    }
})
routerAdmin.post('/recharge',async(req,res)=>{
    let data=req.body;
    try {
        const adminEx = await AdminLoginModel.findOne({
            number: data.number,
            password:data.password
        });
        const user = await UserSignModel.findOne({number:data.userNumber})

        if (adminEx) {
            // If admin found, send the admin details
            res.status(200).send(user);
        } else {
            // If credentials don't match, send 401 Unauthorized
            res.status(401).send({ message: 'Invalid number or password' });
        }
    } catch (error) {
        console.log(error);
        // Handle any server errors
        res.status(500).send({ message: 'Internal Server Error', error });
    }
})

export default routerAdmin;
