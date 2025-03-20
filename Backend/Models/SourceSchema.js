const mongoose = require("mongoose");

const SourceSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "Source name is required"], 
        unique: true,
        trim: true,
        minlength: [2, "Source name must be at least 2 characters long"]
    }
}, { timestamps: true });

module.exports = mongoose.model("source", SourceSchema);
