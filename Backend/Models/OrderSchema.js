const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    // firmid: { 
    //     type: mongoose.Schema.Types.ObjectId, 
    //     ref: "Firm", 
    //     required: [true, "Firm ID is required"] 
    // },
    quotationid: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Quotation", 
        required: [true, "Quotation ID is required"] 
    },
    customerid: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "customer", 
        required: [true, "Customer ID is required"] 
    },
    orderno: { 
        type: String, 
        required: [true, "Order number is required"], 
        unique: true 
    },
    orderdate: { 
        type: Date, 
        required: [true, "Order date is required"] 
    },
    baddress: { 
        type: String, 
        required: [true, "Billing address is required"] 
    },
    saddress: { 
        type: String, 
        required: [true, "Shipping address is required"] 
    },
    createdon: { 
        type: Date, 
        default: Date.now 
    },
    adminid: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Admin", 
        required: [true, "Admin ID is required"] 
    },
    totalweight: { 
        type: Number, 
        required: [true, "Total weight is required"], 
        min: [0, "Total weight cannot be negative"] 
    },
    subtotal: { 
        type: Number, 
        required: [true, "Subtotal is required"], 
        min: [0, "Subtotal cannot be negative"] 
    },
    gstamount: { 
        type: Number, 
        required: [true, "GST amount is required"], 
        min: [0, "GST amount cannot be negative"] 
    },
    total: { 
        type: Number, 
        required: [true, "Total amount is required"], 
        min: [0, "Total amount cannot be negative"] 
    }
}, { timestamps: true });

module.exports = mongoose.model("order", OrderSchema);
