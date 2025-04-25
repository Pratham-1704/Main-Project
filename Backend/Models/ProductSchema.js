const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        categoryid: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Category", 
            required: [true, "Category ID is required"]
        },
        name: { 
            type: String, 
            required: [true, "Product name is required"], 
            trim: true, 
            minlength: [2, "Product name must be at least 2 characters long"],
            maxlength: [100, "Product name cannot exceed 100 characters"]
        },
        weight: { 
            type: Number, 
            required: [true, "Weight is required"], 
            min: [0.1, "Weight must be at least 0.1"]
        },
        srno: { 
            type: Number, 
            required: [true, "Serial number is required"], 
            unique: true 
        }
    }, 
    { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
