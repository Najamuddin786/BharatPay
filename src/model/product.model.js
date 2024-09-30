import mongoose from "mongoose";

// create user singup model--


const productSchema = new mongoose.Schema({
  image:{ type: String, required: true },
  category:{ type: String, required: true },
  title:{ type: String, required: true },
  totalIncome:{ type: Number, required: true },
  originalPrice:{ type: Number, required: true },
  day:{ type: Number, required: true },
  dailyIncome:{ type:Number, required: true },
  price:{ type: Number, required: true },
  dis:{ type: String, required: true },
  status:String
});

// Create a model using the schema



const ProductModel = mongoose.model('product', productSchema);

export default ProductModel;
