import mongoose from "mongoose";

// create user singup model--


const adminLoginSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  password: { type: String, required: true }
});

// Create a model using the schema



const AdminLoginModel = mongoose.model('Admin', adminLoginSchema);

export default AdminLoginModel;
