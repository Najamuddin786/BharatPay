// Import the Express module
import express from 'express';
import connection from './src/config/db.js';
import router from './src/routes/userRoutes.js';


// Initialize the Express app
const app = express();

// Set the port for the server to listen on
const PORT = process.env.PORT || 3000;



app.use(express.json());

// Define a simple route
app.use('/user' ,router)
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
