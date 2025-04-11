const express = require("express");
const router = express.Router();
const In = require("../Models/InSchema");

// CREATE - Add a new "in"
router.post("/", async (req, res) => {
  try {
    const newIn = new In(req.body);
    const savedIn = await newIn.save();
    res.status(201).json({ status: "success", data: savedIn });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

// READ - Get all "in"
router.get("/", async (req, res) => {
  try {
    const allIn = await In.find().sort({ createdAt: -1 });
    res.status(200).json({ status: "success", data: allIn });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// READ - Get a specific "in" by ID
router.get("/:id", async (req, res) => {
  try {
    const singleIn = await In.findById(req.params.id);
    if (!singleIn) {
      return res.status(404).json({ status: "error", message: "Not found" });
    }
    res.status(200).json({ status: "success", data: singleIn });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

// UPDATE - Update an "in" by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedIn = await In.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedIn) {
      return res.status(404).json({ status: "error", message: "Not found" });
    }
    res.status(200).json({ status: "success", data: updatedIn });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

// DELETE - Delete an "in" by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedIn = await In.findByIdAndDelete(req.params.id);
    if (!deletedIn) {
      return res.status(404).json({ status: "error", message: "Not found" });
    }
    res.status(200).json({ status: "success", message: "Deleted successfully" });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

module.exports = router;
