const express = require("express");
const router = express.Router();
const State = require("../Models/StateSchema");

// ➤ Get all admins
router.get("/", async (req, res) => {
    try {
        let result = await State.find({});
        res.json({ status: "success", data: result });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

// ➤ Get a single admin by ID
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let object = await State.findById(id);
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
        let existingState = await State.findOne({ 
            $or: [{ username: data.username }, { mobileno: data.mobileno }]
        });

        if (existingState) {
            return res.status(400).json({ status: "error", data: "Admin with this username or mobile number already exists." });
        }

        let object = await State.create(data);
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
        let object = await State.findByIdAndUpdate(id, data, { new: true });
        res.send({ status: "success", data: object });
    } catch (err) {
        res.send({ status: "error", data: err });
    }
});

// ➤ Delete an admin by ID
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let object = await State.findByIdAndDelete(id);
        res.send({ status: "success", data: object });
    } catch (err) {
        res.send({ status: "error", data: err });
    }
});

module.exports = router;
