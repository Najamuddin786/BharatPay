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
routerAdmin.patch('/recharge/utr/update/:utrId', async (req, res) => {
    const utrId = req.params.utrId; // Get the UTR ID from the request parameters
    const { number, password, status } = req.body; // Assuming the request contains admin credentials and the new status

    try {
        // Verify the admin credentials
        const adminEx = await AdminLoginModel.findOne({ number, password });

        if (!adminEx) {
            return res.status(401).send({ message: 'Invalid admin credentials' });
        }
    } catch (error) {
        return res.status(500).send({ message: `Admin verification error: ${error.message}` });
    }

    try {
        // Now, proceed with updating the user's UTR status
        const user = await UserSignModel.findOne({ "utr.utr": utrId });

        if (!user) {
            return res.status(404).send({ message: 'User with specified UTR not found' });
        }

        // Update the status of the UTR inside the user's `utr` array
        const utrEntry = user.utr.find(utr => utr.utr === utrId);
        if (utrEntry) {
            if(utrEntry.status=='approve'){
                return res.status(200).send('UTR status All ready Approve successfully');
            }else if(status == 'approve'){
                utrEntry.status = status; // Update the status with the new value
                user.recharge += Number(utrEntry.amount)
            user.markModified('utr'); // Explicitly mark the 'utr' array as modified
            await user.save();
            return res.status(200).send('UTR status updated successfully');

            }else{
                utrEntry.status = status; 
                user.markModified('utr'); // Explicitly mark the 'utr' array as modified
                await user.save();
                return res.status(200).send('UTR status updated successfully');
            }
            
        } else {
            return res.status(404).send({ message: 'UTR not found' });
        }
    } catch (error) {
        return res.status(500).send({ message: `Updating recharge status error: ${error.message}` });
    }
});





export default routerAdmin;
