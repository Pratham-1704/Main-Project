const express = require("express");
const router = express.Router();
const Product = require("../Models/ProductSchema");

// ➤ Get all products
router.get("/", async (req, res) => {
    try {
        let result = await Product.find({});
        res.json({ status: "success", data: result });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

// ➤ Get a single product by ID
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let object = await Product.findById(id);
        res.json({ status: "success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

// ➤ Add a new product
router.post("/", async (req, res) => {
    try {
        const data = req.body;

        // Fetch the highest srno from the database
        const lastProduct = await Product.findOne().sort({ srno: -1 });
        const nextSrno = lastProduct ? lastProduct.srno + 1 : 1;

        // Assign the next srno to the new product
        const newProduct = new Product({
            ...data,
            srno: nextSrno,
        });

        const savedProduct = await newProduct.save();
        res.json({ status: "success", data: savedProduct });
    } catch (err) {
        console.error("Error creating product:", err);
        res.status(500).json({ status: "error", message: "Failed to create product." });
    }
});

// ➤ Update a product by ID
router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        // Check if srno already exists for another product
        const existingProduct = await Product.findOne({ srno: data.srno, _id: { $ne: id } });
        if (existingProduct) {
            return res.status(400).json({ status: "error", message: "Serial number already exists." });
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });
        res.json({ status: "success", data: updatedProduct });
    } catch (err) {
        console.error("Error updating product:", err);
        res.status(500).json({ status: "error", message: "Failed to update product." });
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
