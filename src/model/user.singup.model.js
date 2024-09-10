import mongoose from "mongoose";

// create user singup model--


const userSingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: Number, required: true },
  password: { type: String, required: true },
  referral: { type: String, required: true }
});

// Create a model using the schema



const UserSingModel = mongoose.model('UserSing', userSingSchema);

export default UserSingModel;
