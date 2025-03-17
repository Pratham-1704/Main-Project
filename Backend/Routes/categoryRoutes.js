const express = require("express");
const router = express.Router();
const Category = require("../Models/CategorySchema");

// ➤ Get all categories
router.get("/", async (req, res) => {
    try {
        let result = await Category.find({});
        res.json({ status: "success", data: result });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

// ➤ Get a single category by ID
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let object = await Category.findById(id);
        res.json({ status: "success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

// ➤ Add a new category
router.post("/", async (req, res) => {
    try {
        const data = req.body;

        // Check if category with same srno exists
        let existingCategory = await Category.findOne({ srno: data.srno });
        if (existingCategory) {
            return res.status(400).json({ status: "error", data: "Category with this serial number already exists." });
        }

        let object = await Category.create(data);
        res.json({ status: "success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

// ➤ Update a category by ID
router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        let object = await Category.findByIdAndUpdate(id, data, { new: true });
        res.json({ status: "success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

// ➤ Delete a category by ID
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let object = await Category.findByIdAndDelete(id);
        res.json({ status: "success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

module.exports = router;
