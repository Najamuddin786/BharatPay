import mongoose from "mongoose";

// create user singup model--


const userSingSchema = new mongoose.Schema({
  name: { type: String},
  number: { type: Number, required: true },
  password: { type: String, required: true },
  referralCode: { type: String},
  status:String,
  recharge: { type: Number, default: 0 },
  wallet: { type: Number, default: 0 },
  withdrawal: { type: Number, default: 0 },
  utr:[],
  card:[]
});

// Create a model using the schema



const UserSignModel = mongoose.model('UserSing', userSingSchema);

export default UserSignModel;
