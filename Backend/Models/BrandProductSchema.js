const mongoose = require("mongoose");

const BrandProductSchema = new mongoose.Schema({
  brandid: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
  productid: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  parityid: { type: mongoose.Schema.Types.ObjectId, ref: "parity",default: null}, // Updated to ObjectId
  parity: { type: String, default: "" },
  rate: { type: Number, default: 0 },
});

BrandProductSchema.index({ brandid: 1, productid: 1 }, { unique: true });

module.exports = mongoose.model("BrandProduct", BrandProductSchema);