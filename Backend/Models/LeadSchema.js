const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema({
    // firmid: { 
    //     type: mongoose.Schema.Types.ObjectId, 
    //     ref: "Firm", 
    //     required: true 
    // },
    sourceid: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "source", 
        required: true 
    },
    customerid: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "customer", 
        required: true 
    },
    leadno: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },
    leaddate: { 
        type: Date, 
        required: true 
    },
    createdon: { 
        type: Date, 
        default: Date.now 
    },
    adminid: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "admin", 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model("lead", LeadSchema);
