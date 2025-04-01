const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Category name is required"], 
      trim: true, 
      minlength: [2, "Category name must be at least 2 characters long"],
      maxlength: [100, "Category name cannot exceed 100 characters"]
    },
    type: { 
      type: String, 
      required: [true, "Type is required"]
    },
    billingIn: { 
      type: String, 
      required: [true, "Billing information is required"]
    },
    srno: { 
      type: Number, 
      required: [true, "Serial number is required"], 
      unique: true 
    }
  }, 
  { timestamps: true }
);

module.exports = mongoose.model("categories", CategorySchema);
