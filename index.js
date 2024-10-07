// Import the Express module
import express from 'express';
import connection from './src/config/db.js';
import router from './src/routes/userRoutes.js';
import routerAdmin from './src/routes/adminRoutes.js';
import product from './src/routes/productRouter.js';
import frontend from './src/routes/frontendRouter.js';
import claimRouter from './src/routes/userclaimRouter.js';
import withdrawalRouter from './src/routes/withdrawalRouter.js';
import wallettorechargerouter from './src/routes/wallettorechargeRoutes.js';
import cors from 'cors'


// Initialize the Express app
const app = express();
app.use(cors())

// Set the port for the server to listen on
const PORT = process.env.PORT || 3000;



app.use(express.json());

// Define a simple route
app.use('/user' ,router)
app.use('/admin' ,routerAdmin)
app.use('/product' ,product)
app.use('/frontend' ,frontend)
app.use('/withdrawal' ,withdrawalRouter)
app.use('/claim' ,claimRouter)
app.use('/wallet' ,wallettorechargerouter)
app.get('/',(req,res)=>{
  res.send("Hello World")
})



// Start the server
app.listen(PORT, async() => {
  try {
      await connection;
      console.log('MongoDB Connected...... OK')
  } catch (error) {
    console.log(`MongoDB Not Connected...... NOT ${error}`)
  }
  console.log(`Server is running on port ${PORT}`);
});
