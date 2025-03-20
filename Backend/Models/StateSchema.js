const mongoose = require("mongoose");

const StateSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: [true, "Name is required"], 
            trim: true,
            minlength: [3, "Name must be at least 3 characters long"],
            maxlength: [50, "Name cannot exceed 50 characters"]
        }, 
    }, 
    { timestamps: true }
);

module.exports = mongoose.model("state",StateSchema );
