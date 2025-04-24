const mongoose = require("mongoose");

const BrandProductSchema = new mongoose.Schema({
  brandid: { type: mongoose.Schema.Types.ObjectId, ref: "brand", required: true },
  productid: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
  parityid: { type: String, default: "none" },
  parity: { type: String, default: "0" },
  rate: { type: Number, default: 0 },
  billingrate: { type: Number, default: 0 },
});

BrandProductSchema.index({ brandid: 1, productid: 1 }, { unique: true });

module.exports = mongoose.model("BrandProduct", BrandProductSchema);
