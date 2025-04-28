const express = require("express");
const router = express.Router();
const Parity = require("../Models/ParitySchema");

// ➤ Get all products
router.get("/", async (req, res) => {
    try {
        let result = await Parity.find({});
        res.json({ status: "success", data: result });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

// ➤ Get a single product by ID
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let object = await Parity.findById(id);
        res.json({ status: "success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

// ➤ Add a new product
router.post("/", async (req, res) => {
    try {
        const parity = new Parity(req.body);
        const savedParity = await parity.save();
        res.status(201).json({ status: "success", data: savedParity });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
});

// Update a parity by ID
router.put("/:id", async (req, res) => {
    try {
        const updatedParity = await Parity.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ status: "success", data: updatedParity });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to update parity" });
    }
});

// ➤ Delete a product by ID
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let object = await Parity.findByIdAndDelete(id);
        res.json({ status: "success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

module.exports = router;