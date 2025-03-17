const express = require("express");
const router = express.Router();
const QuotationBrandPrice = require("../Models/QuotationBrandPriceSchema");

// ➤ Create a new QuotationBrandPrice
router.post("/", async (req, res) => {
    try {
        const newQuotationBrandPrice = new QuotationBrandPrice(req.body);
        const savedQuotationBrandPrice = await newQuotationBrandPrice.save();
        res.status(201).json({ status: "success", data: savedQuotationBrandPrice });
    } catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
});

// ➤ Get all QuotationBrandPrices
router.get("/", async (req, res) => {
    try {
        const quotationBrandPrices = await QuotationBrandPrice.find().populate("quotationid quotationdetailid brandid productid");
        res.json({ status: "success", data: quotationBrandPrices });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// ➤ Get a single QuotationBrandPrice by ID
router.get("/:id", async (req, res) => {
    try {
        const quotationBrandPrice = await QuotationBrandPrice.findById(req.params.id).populate("quotationid quotationdetailid brandid productid");
        if (!quotationBrandPrice) return res.status(404).json({ status: "error", message: "Quotation Brand Price not found" });
        res.json({ status: "success", data: quotationBrandPrice });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// ➤ Update a QuotationBrandPrice by ID
router.put("/:id", async (req, res) => {
    try {
        const updatedQuotationBrandPrice = await QuotationBrandPrice.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!updatedQuotationBrandPrice) return res.status(404).json({ status: "error", message: "Quotation Brand Price not found" });
        res.json({ status: "success", data: updatedQuotationBrandPrice });
    } catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
});

// ➤ Delete a QuotationBrandPrice by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedQuotationBrandPrice = await QuotationBrandPrice.findByIdAndDelete(req.params.id);
        if (!deletedQuotationBrandPrice) return res.status(404).json({ status: "error", message: "Quotation Brand Price not found" });
        res.json({ status: "success", message: "Quotation Brand Price deleted successfully" });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

module.exports = router;
