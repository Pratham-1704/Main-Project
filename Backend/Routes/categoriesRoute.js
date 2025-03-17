const express = require("express");
const router = express.Router();
const Category = require("../Modules/categorySchema");

// ➤ Get all categories
router.get("/", async (req, res) => {
    try {
        let records = await Category.find({});
        res.json({ status: "success", alldata: records });
    } catch (err) {
        res.status(500).json({ status: "error", message: "Something Went Wrong!" });
    }
});

// ➤ Get a single category by ID
router.get("/:id", async (req, res) => {
    try {
        let record = await Category.findOne({ id: req.params.id });
        if (!record) return res.status(404).json({ status: "error", message: "Category Not Found" });

        res.json({ status: "success", singledata: record });
    } catch (err) {
        res.status(500).json({ status: "error", message: "Something Went Wrong!" });
    }
});

// ➤ Add a new category
router.post("/", async (req, res) => {
    try {
        const { id, name, type, billiningin, srno } = req.body;

        if (!id || !name || !type || billiningin === undefined || !srno) {
            return res.status(400).json({ status: "error", message: "Missing Required Fields" });
        }

        let newCategory = new Category({ id, name, type, billiningin, srno });
        let savedCategory = await newCategory.save();

        res.status(201).json({ status: "success", singledata: savedCategory });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// ➤ Update a category by ID
router.put("/:id", async (req, res) => {
    try {
        let updatedRecord = await Category.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });

        if (!updatedRecord) return res.status(404).json({ status: "error", message: "Category Not Found" });

        res.json({ status: "success", singledata: updatedRecord });
    } catch (err) {
        res.status(500).json({ status: "error", message: "Something Went Wrong!" });
    }
});

// ➤ Delete a category by ID
router.delete("/:id", async (req, res) => {
    try {
        let deletedRecord = await Category.findOneAndDelete({ id: req.params.id });

        if (!deletedRecord) return res.status(404).json({ status: "error", message: "Category Not Found" });

        res.json({ status: "success", singledata: deletedRecord });
    } catch (err) {
        res.status(500).json({ status: "error", message: "Something Went Wrong!" });
    }
});

module.exports = router;
