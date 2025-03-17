const mongoose = require("mongoose");

const BrandProductSchema = new mongoose.Schema(
    {
        brandid: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "brand", 
            required: [true, "Brand ID is required"] 
        },
        productid: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "product", 
            required: [true, "Product ID is required"] 
        },
        parity: { 
            type: String, 
            required: [true, "Parity is required"], 
            enum: {
                values: ["standard", "premium", "economy"],
                message: "Parity must be 'standard', 'premium', or 'economy'"
            }
        },
        rate: { 
            type: Number, 
            required: [true, "Rate is required"], 
            min: [0, "Rate must be a positive number"] 
        },
        billingrate: { 
            type: Number, 
            required: [true, "Billing rate is required"], 
            min: [0, "Billing rate must be a positive number"] 
        }
    }, 
    { timestamps: true }
);

module.exports = mongoose.model("BrandProduct", BrandProductSchema);
