const mongoose = require("mongoose");

const LeadDetailsSchema = new mongoose.Schema({
    leadon: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Lead", 
        required: true 
    },
    categoryid: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Category", 
        required: true 
    },
    productid: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product", 
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
