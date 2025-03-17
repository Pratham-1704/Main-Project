const express = require("express");
const router = express.Router();
const Source = require("../Models/SourceSchema");

// ➤ Create a new source
router.post("/", async (req, res) => {
    try {
        const newSource = new Source(req.body);
        const savedSource = await newSource.save();
        res.status(201).json({ status: "success", data: savedSource });
    } catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
});

// ➤ Get all sources
router.get("/", async (req, res) => {
    try {
        const sources = await Source.find();
        res.json({ status: "success", data: sources });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// ➤ Get a single source by ID
router.get("/:id", async (req, res) => {
    try {
        const source = await Source.findById(req.params.id);
        if (!source) return res.status(404).json({ status: "error", message: "Source not found" });
        res.json({ status: "success", data: source });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// ➤ Update a source by ID
router.put("/:id", async (req, res) => {
    try {
        const updatedSource = await Source.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedSource) return res.status(404).json({ status: "error", message: "Source not found" });
        res.json({ status: "success", data: updatedSource });
    } catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
});

// ➤ Delete a source by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedSource = await Source.findByIdAndDelete(req.params.id);
        if (!deletedSource) return res.status(404).json({ status: "error", message: "Source not found" });
        res.json({ status: "success", message: "Source deleted successfully" });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

module.exports = router;
