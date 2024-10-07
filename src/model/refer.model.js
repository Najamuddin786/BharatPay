import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid'; // Correct way to import uuid

const referenceSchema = new mongoose.Schema({
  refer: {
    type: String,
    unique: true, // Ensure uniqueness of the reference code
    required: true,
  },
});

// Middleware to generate a unique reference code before saving
referenceSchema.pre('save', async function (next) {
  // Make sure to use the 'this' keyword correctly for the document instance
  try {
    let uniqueCode;

    // Keep generating a UUID until it is unique
    do {
      uniqueCode = uuidv4(); // Generate a new UUID
    } while (await mongoose.models.Reference.exists({ refer: uniqueCode })); // Ensure uniqueness in the collection

    this.refer = uniqueCode; // Assign the unique code to the document's refer field
    next(); // Proceed to save the document
  } catch (err) {
    next(err); // Pass any error to the next middleware
  }
});

// Define the model after the schema and middleware are fully set up
const ReferModel = mongoose.model('Reference', referenceSchema);

export default ReferModel;
