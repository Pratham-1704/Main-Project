const express = require("express");
const router = express.Router();
const Category = require("../Models/CategorySchema");

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json({ status: "success", data: categories });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to fetch categories" });
  }
});

// Get a single category by ID
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.json({ status: "success", data: category });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Category not found" });
  }
});

// Add a new category
// Add a new category
router.post("/", async (req, res) => {
  const { name, type, billingIn, srno } = req.body;

  if (!name || !type || !billingIn || !srno) {
    return res.status(400).json({ status: "error", message: "All fields are required" });
  }

  try {
    const newCategory = new Category({ name, type, billingIn, srno });
    await newCategory.save();
    res.json({ status: "success", data: newCategory });
  } catch (error) {
    if (error.name === "ValidationError") {
      // Return Mongoose validation error
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ status: "error", message: messages.join(", ") });
    } else if (error.code === 11000) {
      // Handle duplicate srno
      return res.status(400).json({ status: "error", message: "Serial number must be unique" });
    }
    res.status(500).json({ status: "error", message: "Failed to add category" });
  }
});


// Update a category by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ status: "success", data: updatedCategory });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to update category" });
  }
});

// Delete a category by ID
router.delete("/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ status: "success", message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to delete category" });
  }
});

module.exports = router;
