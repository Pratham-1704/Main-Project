const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
    firmid: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Firm", 
        required: [true, "Firm ID is required"] 
    },
    name: { 
        type: String, 
        required: [true, "Customer name is required"], 
        trim: true, 
        minlength: [3, "Name must be at least 3 characters long"],
        maxlength: [50, "Name must not exceed 50 characters"]
    },
    firmname: { 
        type: String, 
        required: [true, "Firm name is required"], 
        trim: true, 
        minlength: [3, "Firm name must be at least 3 characters long"],
        maxlength: [50, "Firm name must not exceed 50 characters"]
    },
    address: { 
        type: String, 
        required: [true, "Address is required"], 
        trim: true, 
        minlength: [10, "Address must be at least 10 characters long"] 
    },
    city: { 
        type: String, 
        required: [true, "City is required"], 
        trim: true 
    },
    state: { 
        type: String, 
        required: [true, "State is required"], 
        trim: true 
    },
    mobileno1: { 
        type: String, 
        required: [true, "Primary mobile number is required"], 
        unique: true, 
        match: [/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"]
    },
    mobileno2: { 
        type: String, 
        match: [/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"],
        default: null 
    },
    profession: { 
        type: String, 
        required: [true, "Profession is required"], 
        trim: true 
    },
    gstno: { 
        type: String, 
        required: [true, "GST Number is required"], 
        unique: true, 
        match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/, "Enter a valid GST Number"]
    }
}, { timestamps: true });

module.exports = mongoose.model("Customer", CustomerSchema);
