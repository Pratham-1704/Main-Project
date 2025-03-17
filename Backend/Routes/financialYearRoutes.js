const express = require("express");
const router = express.Router();
const FinancialYear = require("../Models/FinancialYearSchema");

// ➤ Create a new financial year
router.post("/", async (req, res) => {
    try {
        const newFinancialYear = new FinancialYear(req.body);
        const savedFinancialYear = await newFinancialYear.save();
        res.status(201).json({ status: "success", data: savedFinancialYear });
    } catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
});

// ➤ Get all financial years
router.get("/", async (req, res) => {
    try {
        const financialYears = await FinancialYear.find();
        res.json({ status: "success", data: financialYears });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// ➤ Get a single financial year by ID
router.get("/:id", async (req, res) => {
    try {
        const financialYear = await FinancialYear.findById(req.params.id);
        if (!financialYear) return res.status(404).json({ status: "error", message: "Financial year not found" });
        res.json({ status: "success", data: financialYear });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// ➤ Update a financial year by ID
router.put("/:id", async (req, res) => {
    try {
        const updatedFinancialYear = await FinancialYear.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedFinancialYear) return res.status(404).json({ status: "error", message: "Financial year not found" });
        res.json({ status: "success", data: updatedFinancialYear });
    } catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
});

// ➤ Delete a financial year by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedFinancialYear = await FinancialYear.findByIdAndDelete(req.params.id);
        if (!deletedFinancialYear) return res.status(404).json({ status: "error", message: "Financial year not found" });
        res.json({ status: "success", message: "Financial year deleted successfully" });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

module.exports = router;
