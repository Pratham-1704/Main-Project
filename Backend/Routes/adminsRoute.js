const express = require("express");
const router = express.Router();
const Admin = require("../Models/AdminSchema");
const multer = require("multer");
const path = require("path");

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/admins/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });

// Ensure uploads/admins directory exists
const fs = require("fs");
const uploadDir = path.join(__dirname, "../../uploads/admins");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ➤ Get all admins
router.get("/", async (req, res) => {
    try {
        let result = await Admin.find();
        res.json({ status: "success", data: result });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

// ...forgot-password route remains unchanged...

// ➤ Get a single admin by ID
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let object = await Admin.findById(id);
        res.json({ status: "success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

// ➤ Add a new admin (with profile pic)
router.post("/", upload.single("profilePic"), async (req, res) => {
    try {
        const data = req.body;
        if (req.file) {
            data.profilePic = `/uploads/admins/${req.file.filename}`;
        }

        // Check if username or mobile number already exists
        let existingAdmin = await Admin.findOne({ 
            $or: [{ username: data.username }, { mobileno: data.mobileno }]
        });

        if (existingAdmin) {
            return res.status(400).json({ status: "error", data: "Admin with this username or mobile number already exists." });
        }

        let object = await Admin.create(data);
        res.json({ status: "success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

// ➤ Update an admin by ID (with profile pic)
router.put("/:id", upload.single("profilePic"), async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        if (req.file) {
            data.profilePic = `/uploads/admins/${req.file.filename}`;
        }
        let object = await Admin.findByIdAndUpdate(id, data, { new: true });
        res.send({ status: "success", data: object });
    } catch (err) {
        res.send({ status: "error", data: err });
    }
});

// ➤ Delete an admin by ID
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let object = await Admin.findByIdAndDelete(id);
        res.send({ status: "success", data: object });
    } catch (err) {
        res.send({ status: "error", data: err });
    }
});

// ...login route remains unchanged...

// ➤ Admin login
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find admin by username and password
        const admin = await Admin.findOne({ username, password });

        if (!admin) {
            return res.status(401).json({ status: "error", message: "Invalid username or password" });
        }

        if (admin.status !== "active") {
            return res.status(403).json({ status: "error", message: "Admin account is inactive" });
        }

        // Return admin details including the `adminid`
        res.json({
            status: "success",
            message: "Login successful",
            data: {
                adminid: admin._id, // Include the MongoDB `_id` as `adminid`
                name: admin.name,
                role: admin.role,
            },
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: "Server error" });
    }
});
module.exports = router;