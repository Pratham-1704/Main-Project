const express = require("express");
const router = express.Router();
const Quotation = require("../models/QuotationSchema");

// ➤ Create a new quotation
router.post("/", async (req, res) => {
    try {
        const newQuotation = new Quotation(req.body);
        const savedQuotation = await newQuotation.save();
        res.status(201).json({ status: "success", data: savedQuotation });
    } catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
});

// ➤ Get all quotations
router.get("/", async (req, res) => {
    try {
        const quotations = await Quotation.find().populate("firmid sourceid customerid adminid");
        res.json({ status: "success", data: quotations });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// ➤ Get a single quotation by ID
router.get("/:id", async (req, res) => {
    try {
        const quotation = await Quotation.findById(req.params.id).populate("firmid sourceid customerid adminid");
        if (!quotation) return res.status(404).json({ status: "error", message: "Quotation not found" });
        res.json({ status: "success", data: quotation });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// ➤ Update a quotation by ID
router.put("/:id", async (req, res) => {
    try {
        const updatedQuotation = await Quotation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedQuotation) return res.status(404).json({ status: "error", message: "Quotation not found" });
        res.json({ status: "success", data: updatedQuotation });
    } catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
});

// ➤ Delete a quotation by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedQuotation = await Quotation.findByIdAndDelete(req.params.id);
        if (!deletedQuotation) return res.status(404).json({ status: "error", message: "Quotation not found" });
        res.json({ status: "success", message: "Quotation deleted successfully" });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

module.exports = router;
