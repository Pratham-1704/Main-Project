const express = require("express");
const router = express.Router();
const Profession = require("../Models/ProfessionSchema");

// ➤ Create a new profession
router.post("/", async (req, res) => {
    try {
        const newProfession = new Profession(req.body);
        const savedProfession = await newProfession.save();
        res.status(201).json({ status: "success", data: savedProfession });
    } catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
});

// ➤ Get all professions
router.get("/", async (req, res) => {
    try {
        const professions = await Profession.find();
        res.json({ status: "success", data: professions });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// ➤ Get a single profession by ID
router.get("/:id", async (req, res) => {
    try {
        const profession = await Profession.findById(req.params.id);
        if (!profession) return res.status(404).json({ status: "error", message: "Profession not found" });
        res.json({ status: "success", data: profession });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// ➤ Update a profession by ID
router.put("/:id", async (req, res) => {
    try {
        const updatedProfession = await Profession.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedProfession) return res.status(404).json({ status: "error", message: "Profession not found" });
        res.json({ status: "success", data: updatedProfession });
    } catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
});

// ➤ Delete a profession by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedProfession = await Profession.findByIdAndDelete(req.params.id);
        if (!deletedProfession) return res.status(404).json({ status: "error", message: "Profession not found" });
        res.json({ status: "success", message: "Profession deleted successfully" });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

module.exports = router;
