const mongoose = require("mongoose");

const ParitySchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: [true, "Name is required"], 
            trim: true,
            minlength: [2, "Name must be at least 3 characters long"],
            maxlength: [50, "Name cannot exceed 50 characters"]
        },
        baserate: { 
            type: Number, 
            required: true,
            trim: true
        }
    }, 
    { timestamps: true }
);

module.exports = mongoose.model("parity", ParitySchema);