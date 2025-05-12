const mongoose = require("mongoose");

const QuotationDetailSchema = new mongoose.Schema({
    quotationid: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "quotation", 
        // required: [true, "Quotation ID is required"] 
    },
    categoryid: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "categories", 
        // required: [true, "Category ID is required"] 
    },
    productid: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product", 
        // required: [true, "Product ID is required"] 
    },
    brandid: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Brand", 
        // required: [true, "Brand ID is required"] 
    },
    estimationin: { 
        type: String, 
        required: [true, "Estimation unit is required"], 
        trim: true 
    },
    singleweight: { 
        type: Number, 
        required: [true, "Single weight is required"], 
        min: [0, "Single weight must be a positive value"] 
    },
    quantity: { 
        type: Number, 
        required: [true, "Quantity is required"], 
        min: [1, "Quantity must be at least 1"] 
    },
    weight: { 
        type: Number, 
        required: [true, "Weight is required"], 
        min: [0, "Weight must be a positive value"] 
    },
    rate: { 
        type: Number, 
        required: [true, "Rate is required"], 
        min: [0, "Rate must be a positive value"] 
    },  
    amount: { 
        type: Number, 
        required: [true, "Amount is required"], 

        min: [0, "Amount must be a positive value"] 
    },
    narration: { 
        type: String, 
        trim: true,
        default: "" 
    }
}, { timestamps: true });

module.exports = mongoose.model("quotationDetail", QuotationDetailSchema);
