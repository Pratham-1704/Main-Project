const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: [true, "Brand name is required"], 
            trim: true,
            minlength: [2, "Brand name must be at least 2 characters long"],
            maxlength: [50, "Brand name cannot exceed 50 characters"]
        },
        srno: { 
            type: Number, 
            required: [true, "Serial number is required"],
            unique: true,
            min: [1, "Serial number must be at least 1"]
        }
    }, 
    { timestamps: true }
);

module.exports = mongoose.model("Brand", BrandSchema);
