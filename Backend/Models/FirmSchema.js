const mongoose = require("mongoose");

const FirmSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "Firm name is required"], 
        unique: true,
        trim: true,
        minlength: [3, "Firm name must be at least 3 characters long"]
    },
    address: { 
        type: String, 
        required: [true, "Address is required"], 
        trim: true 
    },
    gstno: { 
        type: String, 
        required: [true, "GST Number is required"], 
        unique: true,
        match: [/^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})$/, "Invalid GST Number format"]
    },
    contactno: { 
        type: String, 
        required: [true, "Contact number is required"], 
        match: [/^[6-9]\d{9}$/, "Invalid contact number"]
    },
    bankname: { 
        type: String, 
        required: [true, "Bank name is required"], 
        trim: true 
    },
    accountno: { 
        type: String, 
        required: [true, "Account number is required"], 
        match: [/^\d{9,18}$/, "Invalid account number"]
    },
    ifsccode: { 
        type: String, 
        required: [true, "IFSC Code is required"], 
        match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"]
    }
}, { timestamps: true });

module.exports = mongoose.model("Firm", FirmSchema);
