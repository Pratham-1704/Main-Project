const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true }, // Store hashed passwords in production
    mobileno: { type: String, required: true, unique: true, trim: true },
    role: { type: String, required: true, enum: ["admin", "superadmin", "user"] },
    status: { type: String, required: true, enum: ["active", "inactive"] }
}, { timestamps: true });

module.exports = mongoose.model("Admin", AdminSchema);
