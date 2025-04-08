const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const FinancialYear = require("../Models/FinancialYearSchema");

// Middleware to validate ObjectID
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ status: "error", message: "Invalid ID format" });
  }
  next();
};

// ➤ Create a new financial year
router.post("/", async (req, res) => {
  try {
    const newFinancialYear = new FinancialYear(req.body);
    const savedFinancialYear = await newFinancialYear.save();
    res.status(201).json({ status: "success", data: savedFinancialYear });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ status: "error", message: "Financial year name must be unique" });
    }
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ status: "error", message: errors.join(", ") });
    }
    res.status(500).json({ status: "error", message: err.message });
  }
});

// ➤ Get all financial years with pagination
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const financialYears = await FinancialYear.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await FinancialYear.countDocuments();
    res.json({ status: "success", data: financialYears, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// ➤ Get a single financial year by ID
router.get("/:id", validateObjectId, async (req, res) => {
  try {
    const financialYear = await FinancialYear.findById(req.params.id);
    if (!financialYear) return res.status(404).json({ status: "error", message: "Financial year not found" });
    res.json({ status: "success", data: financialYear });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// ➤ Update a financial year by ID
router.put("/:id", validateObjectId, async (req, res) => {
  try {
    const updatedFinancialYear = await FinancialYear.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedFinancialYear) return res.status(404).json({ status: "error", message: "Financial year not found" });
    res.json({ status: "success", data: updatedFinancialYear });
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ status: "error", message: errors.join(", ") });
    }
    res.status(500).json({ status: "error", message: err.message });
  }
});

// ➤ Delete a financial year by ID
router.delete("/:id", validateObjectId, async (req, res) => {
  try {
    const deletedFinancialYear = await FinancialYear.findByIdAndDelete(req.params.id);
    if (!deletedFinancialYear) return res.status(404).json({ status: "error", message: "Financial year not found" });
    res.json({ status: "success", message: "Financial year deleted successfully" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;