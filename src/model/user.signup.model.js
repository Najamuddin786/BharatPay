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
  walletD: [],
  withdrawal: { type: Number, default: 0 },
  utr:[],
  card:[],
  bank:[],
  refur:{type:Number,default:0}
});

// Create a model using the schema



const UserSignModel = mongoose.model('UserSing', userSingSchema);

export default UserSignModel;
