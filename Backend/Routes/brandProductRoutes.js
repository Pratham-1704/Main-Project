const express = require("express");
const router = express.Router();
const BrandProduct = require("../Models/BrandProductSchema");
const mongoose = require("mongoose");


// Get all brand products with optional filtering
router.get("/", async (req, res) => {
  try {
    const { brandid, productid } = req.query;
    const filter = {};
    if (brandid) filter.brandid = brandid;
    if (productid) filter.productid = productid;

    const result = await BrandProduct.find(filter)
      .populate("brandid", "name") // Populate only the name field of the brand
      .populate("productid", "name") // Populate only the name field of the product
      // .populate("categoryid", "name"); // Populate only the name field of the category (if applicable)

    res.json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "error", data: err.message });
  }
});

// Get a list of product IDs by brand ID
router.get("/productids/:brandid", async (req, res) => {
  try {
    const { brandid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(brandid)) {
      return res.status(400).json({
        status: "error",
        data: "Invalid brand ID format",
      });
    }

    const records = await BrandProduct.find({ brandid });
    const productIds = records.map((r) => r.productid.toString());
    res.json({ status: "success", data: productIds });
  } catch (err) {
    res.status(500).json({ status: "error", data: err.message });
  }
});

// Add a brand product
router.post("/", async (req, res) => {
  try {
    const { brandid, productid, parityid, parity, rate, billingrate } = req.body;

    if (!brandid || !productid) {
      return res.status(400).json({
        status: "error",
        data: "Missing required fields: brandid and productid",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(brandid) || !mongoose.Types.ObjectId.isValid(productid)) {
      return res.status(400).json({
        status: "error",
        data: "Invalid brandid or productid format",
      });
    }

    const existing = await BrandProduct.findOne({ brandid, productid });
    if (existing) {
      return res.status(409).json({
        status: "error",
        data: "This brand-product combination already exists",
      });
    }

    const newRecord = await BrandProduct.create({
      brandid,
      productid,
      parityid,
      parity,
      rate,
      billingrate,
    });

    res.status(201).json({ status: "success", data: newRecord });
  } catch (err) {
    res.status(500).json({ status: "error", data: err.message });
  }
});

router.put("/update", async (req, res) => {
  try {
    const { updates } = req.body;

    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid request body. 'updates' must be an array.",
      });
    }

    // Loop through the updates and update each record
    for (const update of updates) {
      if (!update.brandid || !update.productid) {
        return res.status(400).json({
          status: "error",
          message: "Missing required fields: brandid and productid in one of the updates.",
        });
      }

      await BrandProduct.updateOne(
        { brandid: update.brandid, productid: update.productid }, // Match by brandid and productid
        {
          $set: {
            parity: update.parity,
            rate: update.rate,
            parityid: update.parityid,
          },
        }
      );
    }

    res.status(200).json({ status: "success", message: "Brand products updated successfully" });
  } catch (error) {
    console.error("Error updating brand products:", error);
    res.status(500).json({ status: "error", message: "Failed to update brand products" });
  }
});

// Delete brand product by brandId and productId
router.delete("/", async (req, res) => {
  try {
    const { brandId, productId } = req.query;

    if (!brandId || !productId) {
      return res.status(400).json({
        status: "error",
        data: "Missing query parameters: brandId and productId",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(brandId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        status: "error",
        data: "Invalid brandId or productId format",
      });
    }

    const record = await BrandProduct.findOneAndDelete({
      brandid: brandId,
      productid: productId,
    });

    if (!record) {
      return res.status(404).json({ status: "error", data: "BrandProduct not found" });
    }

    res.json({ status: "success", data: "BrandProduct deleted successfully" });
  } catch (err) {
    res.status(500).json({ status: "error", data: err.message });
  }
});

// Get product count for a specific brand
// Get product count for a specific brand
router.get("/count", async (req, res) => {
  try {
    const { brandid } = req.query;

    if (!brandid) {
      return res.status(400).json({
        status: "error",
        data: "Missing query parameter: brandid",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(brandid)) {
      return res.status(400).json({
        status: "error",
        data: "Invalid brandid format",
      });
    }

    const count = await BrandProduct.countDocuments({ brandid });
    res.json({ status: "success", count });
  } catch (err) {
    res.status(500).json({ status: "error", data: err.message });
  }
});


module.exports = router;
