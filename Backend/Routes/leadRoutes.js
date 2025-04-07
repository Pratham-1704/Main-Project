const express = require("express");
const router = express.Router();
const Lead = require("../Models/LeadSchema");

// ➤ Create a new lead
router.post("/", async (req, res) => {
    try {
        const newLead = new Lead(req.body);
        const savedLead = await newLead.save();
        res.status(201).json({ status: "success", data: savedLead });
    } catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
});

// ➤ Get all leads
router.get("/", async (req, res) => {
    try {
        const leads = await Lead.find();
        res.json({ status: "success", data: leads });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// ➤ Get a single lead by ID
router.get("/:id", async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) return res.status(404).json({ status: "error", message: "Lead not found" });
        res.json({ status: "success", data: lead });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// ➤ Update a lead by ID
router.put("/:id", async (req, res) => {
    try {
        const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedLead) return res.status(404).json({ status: "error", message: "Lead not found" });
        res.json({ status: "success", data: updatedLead });
    } catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
});

// ➤ Delete a lead by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedLead = await Lead.findByIdAndDelete(req.params.id);
        if (!deletedLead) return res.status(404).json({ status: "error", message: "Lead not found" });
        res.json({ status: "success", message: "Lead deleted successfully" });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});


module.exports = router;
