const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: [true, "Name is required"], 
            trim: true,
            minlength: [3, "Name must be at least 3 characters long"],
            maxlength: [50, "Name cannot exceed 50 characters"]
        },
        username: { 
            type: String, 
            required: [true, "Username is required"], 
            unique: true, 
            trim: true,
            minlength: [4, "Username must be at least 4 characters long"],
            maxlength: [20, "Username cannot exceed 20 characters"]
        },
        password: { 
            type: String, 
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"]
        }, // Store hashed passwords in production
        mobileno: { 
            type: String, 
            required: [true, "Mobile number is required"], 
            unique: true, 
            trim: true, 
            match: [/^\d{10}$/, "Mobile number must be a valid 10-digit number"]
        },
        role: { 
            type: String, 
            required: [true, "Role is required"], 
            enum: {
                values: ["admin", "superadmin", "user"],
                message: "Role must be either 'admin', 'superadmin', or 'user'"
            }
        },
        status: { 
            type: String, 
            required: [true, "Status is required"], 
            enum: {
                values: ["active", "inactive"],
                message: "Status must be either 'active' or 'inactive'"
            }
        }
    }, 
    { timestamps: true }
);

module.exports = mongoose.model("admin", AdminSchema);
