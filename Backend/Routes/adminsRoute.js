const express = require("express");
const router = express.Router();
const Admin = require("../Models/AdminSchema");

// ➤ Get all admins
router.get("/", async (req, res) => {
    try {
        let result = await Admin.find();
        res.json({ status: "success", data: result });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

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

// ➤ Add a new admin
router.post("/", async (req, res) => {
    try {
        const data = req.body;

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

// ➤ Update an admin by ID
router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
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

// ➤ Admin login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ status: "error", message: "Invalid credentials" });
        }

        // Compare entered password with stored plain-text password
        if (password !== admin.password) {
            return res.status(401).json({ status: "error", message: "Invalid credentials" });
        }

        res.json({ status: "success", message: "Login successful" });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Server error" });
    }
});

module.exports = router;
