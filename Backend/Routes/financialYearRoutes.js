const express = require("express");
const router = express.Router();
const FinancialYear = require("../Models/FinancialYearSchema");

// Fetch all financial years
router.get("/", async (req, res) => {
  try {
    const financialYears = await FinancialYear.find();
    res.status(200).json({ status: "success", data: financialYears });
  } catch (error) {
    console.error("Error fetching financial years:", error);
    res.status(500).json({ status: "error", message: "Failed to fetch financial years." });
  }
});

// Add a new financial year
router.post("/", async (req, res) => {
  try {
    const { name, startDate, endDate } = req.body;
    const financialYear = new FinancialYear({ name, startDate, endDate });
    await financialYear.save();
    res.status(201).json({ status: "success", message: "Financial year added successfully!" });
  } catch (error) {
    console.error("Error adding financial year:", error);
    res.status(500).json({ status: "error", message: "Failed to add financial year." });
  }
});

// Update an existing financial year
router.put("/:id", async (req, res) => {
  try {
    const { name, startDate, endDate } = req.body;
    const financialYear = await FinancialYear.findByIdAndUpdate(req.params.id, { name, startDate, endDate }, { new: true });
    res.status(200).json({ status: "success", message: "Financial year updated successfully!", data: financialYear });
  } catch (error) {
    console.error("Error updating financial year:", error);
    res.status(500).json({ status: "error", message: "Failed to update financial year." });
  }
});

// Delete a financial year
router.delete("/:id", async (req, res) => {
  try {
    await FinancialYear.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: "success", message: "Financial year deleted successfully!" });
  } catch (error) {
    console.error("Error deleting financial year:", error);
    res.status(500).json({ status: "error", message: "Failed to delete financial year." });
  }
});

module.exports = router;
