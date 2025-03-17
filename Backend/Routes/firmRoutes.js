const express = require("express");
const router = express.Router();
const Firm = require("../Models/FirmSchema");

// ➤ Create a new firm
router.post("/", async (req, res) => {
    try {
        const newFirm = new Firm(req.body);
        const savedFirm = await newFirm.save();
        res.status(201).json({ status: "success", data: savedFirm });
    } catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
});

// ➤ Get all firms
router.get("/", async (req, res) => {
    try {
        const firms = await Firm.find();
        res.json({ status: "success", data: firms });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// ➤ Get a single firm by ID
router.get("/:id", async (req, res) => {
    try {
        const firm = await Firm.findById(req.params.id);
        if (!firm) return res.status(404).json({ status: "error", message: "Firm not found" });
        res.json({ status: "success", data: firm });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// ➤ Update a firm by ID
router.put("/:id", async (req, res) => {
    try {
        const updatedFirm = await Firm.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedFirm) return res.status(404).json({ status: "error", message: "Firm not found" });
        res.json({ status: "success", data: updatedFirm });
    } catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
});

// ➤ Delete a firm by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedFirm = await Firm.findByIdAndDelete(req.params.id);
        if (!deletedFirm) return res.status(404).json({ status: "error", message: "Firm not found" });
        res.json({ status: "success", message: "Firm deleted successfully" });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

module.exports = router;
