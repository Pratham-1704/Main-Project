const mongoose = require("mongoose");

const LeadDetailsSchema = new mongoose.Schema({
  leadid: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: "lead" },
  categoryid: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "category" },
  productid: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "product" },
  estimationin: { type: String, required: true },
  quantity: { type: Number, required: true },
  narration: { type: String },
});

module.exports = mongoose.model("leaddetail", LeadDetailsSchema);
