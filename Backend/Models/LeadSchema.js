const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
  {
    leadno: { type: String, required: true, unique: true }, // Lead number
    leaddate: { type: Date, required: true }, // Lead date
    createdon: { type: Date, default: Date.now }, // Automatically set to the current date
    sourceid: { type: mongoose.Schema.Types.ObjectId, ref: "source", required: true }, // Source reference
    customerid: { type: mongoose.Schema.Types.ObjectId, ref: "customer", required: true }, // Customer reference
    adminid: { type: mongoose.Schema.Types.ObjectId, ref: "admin", required: true }, // Admin reference
    items: [
      {
        categoryid: { type: mongoose.Schema.Types.ObjectId, ref: "category", required: true }, // Category reference
        productid: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true }, // Product reference
        estimationin: { type: String, required: true }, // Estimation unit (e.g., KG, METER)
        quantity: { type: Number, required: true }, // Quantity
        narration: { type: String }, // Optional narration
      },
    ],
  }
);

module.exports = mongoose.model("lead", LeadSchema);
