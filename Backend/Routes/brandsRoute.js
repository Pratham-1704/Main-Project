const express = require("express");
const router = express.Router();
const Brand = require("../Models/BrandSchema");

// ➤ Get all brands
router.get("/", async (req, res) => {
    try {
        let result = await Brand.find({});
        res.json({ status: "success", data: result });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

// ➤ Get a single brand by ID
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let object = await Brand.findById(id);
        res.json({ status: "success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

// ➤ Add a new brand
router.post("/", async (req, res) => {
    try {
        const data = req.body;

        // Check if srno already exists
        let existingBrand = await Brand.findOne({ srno: data.srno });
        if (existingBrand) {
            return res.status(400).json({ status: "error", data: "Brand with this serial number already exists." });
        }

        let object = await Brand.create(data);
        res.json({ status: "success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

// ➤ Update a brand by ID
router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        let object = await Brand.findByIdAndUpdate(id, data, { new: true });
        res.send({ status: "success", data: object });
    } catch (err) {
        res.send({ status: "error", data: err });
    }
});

// ➤ Delete a brand by ID
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let object = await Brand.findByIdAndDelete(id);
        res.send({ status: "success", data: object });
    } catch (err) {
        res.send({ status: "error", data: err });
    }
});

module.exports = router;
