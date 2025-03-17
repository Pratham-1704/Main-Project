const mongoose = require("mongoose");

const QuotationBrandPriceSchema = new mongoose.Schema({
    quotationid: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "quotation", 
        required: [true, "Quotation ID is required"] 
    },
    quotationdetailid: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "quotationDetail", 
        required: [true, "Quotation Detail ID is required"] 
    },
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
    rate: { 
        type: Number, 
        required: [true, "Rate is required"], 
        min: [0, "Rate cannot be negative"] 
    },
    amount: { 
        type: Number, 
        required: [true, "Amount is required"], 
        min: [0, "Amount cannot be negative"] 
    }
}, { timestamps: true });

module.exports = mongoose.model("quotationBrandPrice", QuotationBrandPriceSchema);
