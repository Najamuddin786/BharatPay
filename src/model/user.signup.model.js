import mongoose from "mongoose";

// create user singup model--


const userSingSchema = new mongoose.Schema({
  name: { type: String},
  number: { type: Number, required: true },
  password: { type: String, required: true },
  referralCode: { type: String},
  status:String,
  recharge:Number,
  utr:[],
  card:[]
});

// Create a model using the schema



const UserSignModel = mongoose.model('UserSing', userSingSchema);

export default UserSignModel;
