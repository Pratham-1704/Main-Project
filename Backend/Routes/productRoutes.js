const express = require("express");
const router = express.Router();
const Product = require("../Models/ProductSchema");

// ➤ Get all products
router.get("/", async (req, res) => {
    try {
        let result = await Product.find({}).populate("categoryid");
        res.json({ status: "success", data: result });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

// ➤ Get a single product by ID
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let object = await Product.findById(id).populate("categoryid");
        res.json({ status: "success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

// ➤ Add a new product
router.post("/", async (req, res) => {
    try {
        const data = req.body;

        // Check if product with same srno exists
        let existingProduct = await Product.findOne({ srno: data.srno });
        if (existingProduct) {
            return res.status(400).json({ status: "error", data: "Product with this serial number already exists." });
        }

        let object = await Product.create(data);
        res.json({ status: "success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

// ➤ Update a product by ID
router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        let object = await Product.findByIdAndUpdate(id, data, { new: true });
        res.json({ status: "success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

// ➤ Delete a product by ID
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let object = await Product.findByIdAndDelete(id);
        res.json({ status: "success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

module.exports = router;
