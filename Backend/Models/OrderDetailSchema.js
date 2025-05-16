const mongoose = require("mongoose");

const OrderDetailSchema = new mongoose.Schema({
  orderid: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  categoryid: { type: mongoose.Schema.Types.ObjectId, ref: "categories", required: true },
  productid: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  brandid: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
  estimationin: { type: String, required: true },
  singleweight: { type: Number, required: true },
  quantity: { type: Number, required: true },
  weight: { type: Number, required: true },
  rate: { type: Number, required: true },
  amount: { type: Number, required: true },
  narration: { type: String, default: "" },
  paymentMode : { type: String ,default: "" },
}, { timestamps: true });

module.exports = mongoose.model("orderDetail", OrderDetailSchema);
