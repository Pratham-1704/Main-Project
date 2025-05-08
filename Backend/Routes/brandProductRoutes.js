const express = require("express");
const router = express.Router();
const BrandProduct = require("../Models/BrandProductSchema");
const mongoose = require("mongoose");
const Product = require("../Models/ProductSchema"); // Assuming ProductSchema is defined


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

    const brandproducts = await BrandProduct.find({ brandid });
    let products = await Product.find({});
   // Create an array of productids from brandproducts for fast lookup
const brandProductIds = brandproducts.map(item => item.productid.toString());

// Add the 'added' column to each product
products = products.map(product => {
    return {
        ...product.toObject(),  // Convert product object to a plain object
        added: brandProductIds.includes(product._id.toString())  // Check if product exists in brandproducts
    };
});
    res.json({ status: "success", data: products });
  } catch (err) {
    res.status(500).json({ status: "error", data: err.message });
  }
});

// Add a brand product
router.post("/", async (req, res) => {
  try {
    const { brandid, productid, parityid = null, parity = "", rate = 0 } = req.body;

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
    });

    res.status(201).json({ status: "success", data: newRecord });
  } catch (err) {
    console.error("Error adding brandproduct:", err);
    res.status(500).json({ status: "error", data: err.message });
  }
});

router.post("/update", async (req, res) => {
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
      if (!update.brandid || !update.productid || !update.parityid) {
        return res.status(400).json({
          status: "error",
          message: "Missing required fields: brandid, productid, or parityid in one of the updates.",
        });
      }

      await BrandProduct.updateOne(
        { brandid: update.brandid, productid: update.productid }, // Match by brandid and productid
        {
          $set: {
            parity: update.parity,
            rate: update.rate,
            parityid: update.parityid, // Use the parity ID
          },
        },
        { upsert: true } // Create a new record if it doesn't exist
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

router.get("/parity-counts", async (req, res) => {
  try {
    const parityCounts = await BrandProduct.aggregate([
      {
        $group: {
          _id: "$parityid", // Group by parityid (ObjectId)
          count: { $sum: 1 }, // Count the number of records
        },
      },
      {
        $lookup: {
          from: "parities", // Name of the parity collection
          localField: "_id", // Field in BrandProduct (parityid)
          foreignField: "_id", // Field in Parity collection (_id)
          as: "parityDetails", // Alias for the joined data
        },
      },
      {
        $unwind: "$parityDetails", // Unwind the parityDetails array
      },
      {
        $project: {
          _id: "$parityDetails.name", // Replace _id with the parity name
          count: 1, // Keep the count field
        },
      },
    ]);

    res.status(200).json({ status: "success", data: parityCounts });
  } catch (error) {
    console.error("Error fetching parity counts:", error);
    res.status(500).json({ status: "error", message: "Failed to fetch parity counts" });
  }
});

router.get("/products-by-category", async (req, res) => {
  try {
    const { brandid, categoryid } = req.query;

    if (!brandid || !categoryid) {
      return res.status(400).json({
        status: "error",
        message: "Missing required query parameters: brandid or categoryid",
      });
    }

    // Fetch products by category
    const products = await Product.find({ categoryid });

    // Fetch brandproduct records for the given brand
    const brandProducts = await BrandProduct.find({ brandid });
    const brandProductIds = brandProducts.map((bp) => bp.productid.toString());

    // Mark products as existing or not in brandproduct
    const result = products.map((product) => ({
      ...product.toObject(),
      existsInBrandProduct: brandProductIds.includes(product._id.toString()),
    }));

    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ status: "error", message: "Failed to fetch products" });
  }
});

const getRate = async (brandid, productid) => {
  try {
    const brandProduct = await BrandProduct.findOne({ brandid, productid });
    if (brandProduct) {
      return brandProduct.rate;
    } else {
      return 0; // Default rate if no match is found
    }
  } catch (error) {
    console.error("Error fetching rate:", error);
    throw error;
  }
};

// API Endpoint
router.get("/getRate", async (req, res) => {
  const { brandid, productid } = req.query;

  if (!brandid || !productid) {
    return res.status(400).json({ error: "Brand ID and Product ID are required" });
  }

  try {
    const rate = await getRate(brandid, productid);
    res.status(200).json({ rate });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rate" });
  }
});


module.exports = router;
