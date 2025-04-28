const express = require("express");
const router = express.Router();
const Parity = require("../Models/ParitySchema");

// ➤ Get all parity entries
router.get("/", async (req, res) => {
    try {
        const result = await Parity.find({});
        res.json({ status: "success", data: result });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

// ➤ Get a single parity entry by ID
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const object = await Parity.findById(id);
        res.json({ status: "success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

// ➤ Add a new parity entry
router.post("/", async (req, res) => {
    try {
        const parity = new Parity(req.body);
        const savedParity = await parity.save();
        res.status(201).json({ status: "success", data: savedParity });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
});

// ➤ Update a parity entry by ID
router.put("/:id", async function (req, res) {
        try {
            const id = req.params.id;
            const data = req.body;

            const updatedParity = await Parity.findByIdAndUpdate(id, data, { new: true });
            res.json({ status: "success", data: updatedParity });
        } catch (err) {
            console.error("Error updating parity:", err);
            res.status(500).json({ status: "error", message: "Failed to update parity entry." });
        }
    });

// ➤ Delete a parity entry by ID
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const object = await Parity.findByIdAndDelete(id);
        res.json({ status: "success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

module.exports = router;
