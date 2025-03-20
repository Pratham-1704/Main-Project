const mongoose = require("mongoose");

const LeadDetailsSchema = new mongoose.Schema({
    leadon: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "lead", 
        required: true 
    },
    categoryid: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "category", 
        required: true 
    },
    productid: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "product", 
        required: true 
    },
    estimationin: { 
        type: String, 
        required: true, 
        trim: true 
    },
    quantity: { 
        type: Number, 
        required: true, 
        min: [1, "Quantity must be at least 1"]
    },
    narration: { 
        type: String, 
        trim: true 
    }
}, { timestamps: true });

module.exports = mongoose.model("leadDetails", LeadDetailsSchema);
