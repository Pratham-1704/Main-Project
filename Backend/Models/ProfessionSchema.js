const mongoose = require("mongoose");

const ProfessionSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "Profession name is required"], 
        trim: true,
        unique: true, 
        minlength: [3, "Profession name must be at least 3 characters long"],
        maxlength: [50, "Profession name must not exceed 50 characters"]
    }
}, { timestamps: true });

module.exports = mongoose.model("Profession", ProfessionSchema);
