const express = require("express");
const router = express.Router();
const BrandProduct = require("../Models/BrandProductSchema");

// ➤ Get all brand products
router.get("/", async (req, res) => {
    try {
        let result = await BrandProduct.find({}).populate("brandid").populate("productid");
        res.json({ status: "success", data: result });
    } catch (err) {
        res.status(500).json({ status: "error", data: err.message });
    }
});

// ➤ Get a single brand product by ID
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let object = await BrandProduct.findById(id).populate("brandid").populate("productid");
        if (!object) {
            return res.status(404).json({ status: "error", data: "BrandProduct not found" });
        }
        res.json({ status: "success", data: object });
    } catch (err) {
        res.status(500).json({ status: "error", data: err.message });
    }
});

// ➤ Add a new brand product
router.post("/", async (req, res) => {
    try {
        const data = req.body;
        let object = await BrandProduct.create(data);
        res.status(201).json({ status: "success", data: object });
    } catch (err) {
        res.status(400).json({ status: "error", data: err.message });
    }
});

// ➤ Update a brand product by ID
router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        let object = await BrandProduct.findByIdAndUpdate(id, data, { new: true });
        if (!object) {
            return res.status(404).json({ status: "error", data: "BrandProduct not found" });
        }
        res.json({ status: "success", data: object });
    } catch (err) {
        res.status(400).json({ status: "error", data: err.message });
    }
});

// ➤ Delete a brand product by ID
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let object = await BrandProduct.findByIdAndDelete(id);
        if (!object) {
            return res.status(404).json({ status: "error", data: "BrandProduct not found" });
        }
        res.json({ status: "success", data: "BrandProduct deleted successfully" });
    } catch (err) {
        res.status(500).json({ status: "error", data: err.message });
    }
});

module.exports = router;
