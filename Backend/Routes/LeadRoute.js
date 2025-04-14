const express = require("express");
const router = express.Router();
const Lead = require("../Models/LeadSchema");

// ➤ Save a new lead
router.post("/", async (req, res) => {
  try {
    const data = req.body;

    // Save the lead data
    const lead = await Lead.create(data);

    res.json({ status: "success", data: lead });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
});

module.exports = router;