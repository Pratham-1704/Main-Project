const express = require("express");
const router = express.Router();
const LeadDetails = require("../Models/LeadDetailsSchema");

// ➤ Create a new lead detail
router.post("/", async (req, res) => {
    try {
        const newLeadDetail = new LeadDetails(req.body);
        const savedLeadDetail = await newLeadDetail.save();
        res.status(201).json({ status: "success", data: savedLeadDetail });
    } catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
});

// ➤ Get all lead details
router.get("/", async (req, res) => {
    try {
        const leadDetails = await LeadDetails.find().populate("productid");
        res.json({ status: "success", data: leadDetails });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// ➤ Get a single lead detail by ID
router.get("/:id", async (req, res) => {
    try {
        const leadDetail = await LeadDetails.findById(req.params.id);
        if (!leadDetail) return res.status(404).json({ status: "error", message: "Lead detail not found" });
        res.json({ status: "success", data: leadDetail });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// ➤ Update a lead detail by ID
router.put("/:id", async (req, res) => {
    try {
        const updatedLeadDetail = await LeadDetails.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedLeadDetail) return res.status(404).json({ status: "error", message: "Lead detail not found" });
        res.json({ status: "success", data: updatedLeadDetail });
    } catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
});

// ➤ Delete a lead detail by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedLeadDetail = await LeadDetails.findByIdAndDelete(req.params.id);
        if (!deletedLeadDetail) return res.status(404).json({ status: "error", message: "Lead detail not found" });
        res.json({ status: "success", message: "Lead detail deleted successfully" });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

module.exports = router;
