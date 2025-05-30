const mongoose = require("mongoose");

const QuotationSchema = new mongoose.Schema({
    sourceid: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "source", 
        required: [true, "Source ID is required"] 
    },
    customerid: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "customer", 
        required: [true, "Customer ID is required"] 
    },
    quotationno: { 
        type: String, 
        required: [true, "Quotation Number is required"], 
        unique: true,
        trim: true 
    },
    quotationdate: { 
        type: Date, 
        required: [true, "Quotation Date is required"] 
    },
    baddress: { 
        type: String, 
        required: [true, "Billing Address is required"], 
        trim: true 
    },
    saddress: { 
        type: String, 
        required: [true, "Shipping Address is required"], 
        trim: true 
    },
    createdon: { 
        type: Date, 
        default: Date.now 
    },
    adminid: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "admin", 
        required: [true, "Admin ID is required"] 
    },
    totalweight: { 
        type: Number, 
        required: [true, "Total weight is required"], 
        min: [0, "Weight cannot be negative"] 
    },
    subtotal: { 
        type: Number, 
        required: [true, "Subtotal is required"], 
        min: [0, "Subtotal cannot be negative"] 
    },
    gstamount: { 
        type: Number, 
        required: [true, "GST amount is required"], 
        min: [0, "GST cannot be negative"] 
    },
    total: { 
        type: Number, 
        required: [true, "Total amount is required"], 
        min: [0, "Total cannot be negative"] 
    },
    quotationtype: { 
        type: String,
        // enum: ["retail", "wholesale"], 
        required: [true, "Quotation Type is required"] 
    },
      do_prepared: {
        type: String,
        enum: ["yes", "no"],
        default: "no",
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("quotation", QuotationSchema);
