const express = require("express");
const router = express.Router();
const QuotationDetail = require("../Models/QuotationDetailSchema");

// ➤ Create a new quotation detail
router.post("/", async (req, res) => {
    try {
        const newQuotationDetail = new QuotationDetail(req.body);
        const savedQuotationDetail = await newQuotationDetail.save();
        res.status(201).json({ status: "success", data: savedQuotationDetail });
    } catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
});

// ➤ Get all quotation details
router.get("/", async (req, res) => {
    try {
        const quotationDetails = await QuotationDetail.find().populate("quotationid categoryid productid brandid");
        res.json({ status: "success", data: quotationDetails });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// ➤ Get a single quotation detail by ID
router.get("/:id", async (req, res) => {
    try {
        const quotationDetail = await QuotationDetail.findById(req.params.id).populate("quotationid categoryid productid brandid");
        if (!quotationDetail) return res.status(404).json({ status: "error", message: "Quotation detail not found" });
        res.json({ status: "success", data: quotationDetail });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// ➤ Update a quotation detail by ID
router.put("/:id", async (req, res) => {
    try {
        const updatedQuotationDetail = await QuotationDetail.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedQuotationDetail) return res.status(404).json({ status: "error", message: "Quotation detail not found" });
        res.json({ status: "success", data: updatedQuotationDetail });
    } catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
});

// ➤ Delete a quotation detail by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedQuotationDetail = await QuotationDetail.findByIdAndDelete(req.params.id);
        if (!deletedQuotationDetail) return res.status(404).json({ status: "error", message: "Quotation detail not found" });
        res.json({ status: "success", message: "Quotation detail deleted successfully" });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

module.exports = router;
