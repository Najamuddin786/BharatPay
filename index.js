// Import the Express module
import express from 'express';
import connection from './src/config/db.js';

// Initialize the Express app
const app = express();

// Set the port for the server to listen on
const PORT = process.env.PORT || 3000;

// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});



// Start the server
app.listen(PORT, async() => {
  try {
      await connection;
      console.log('MongoDB Connected....... OK')
  } catch (error) {
    console.log('MongoDB Not Connected....... NOT')
  }
  console.log(`Server is running on port ${PORT}`);
});
