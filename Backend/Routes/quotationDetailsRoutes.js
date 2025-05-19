const express = require("express");
const router = express.Router();
const QuotationDetail = require("../Models/QuotationDetailSchema");

// ➤ Create a new quotation detail

// Replace your current POST route with this:
router.post("/", async (req, res) => {
    try {
        // Handle both array and single object
        const details = Array.isArray(req.body) ? req.body : [req.body];
        
        // Validate and save
        const savedDetails = await QuotationDetail.insertMany(details);
        
        res.status(201).json({ 
            status: "success", 
            data: savedDetails,
            count: savedDetails.length
        });
    } catch (err) {
        console.error("Error saving details:", err);
        res.status(400).json({ 
            status: "error",
            message: err.message,
            errors: err.errors 
        });
    }
});

// router.post("/", async (req, res) => {
//     try {
//         const newQuotationDetail = new QuotationDetail(req.body);
//         const savedQuotationDetail = await newQuotationDetail.save();
//         res.status(201).json({ status: "success", data: savedQuotationDetail });
//     } catch (err) {
//         res.status(400).json({ status: "error", message: err.message });
//     }
// });

// // POST /api/quotationdetails
// router.post('/quotationdetails', async (req, res) => {
//   try {
//     const details = req.body; // should be an array
//     const savedDetails = await QuotationDetail.insertMany(details);
//     res.status(201).json(savedDetails);
//   } catch (error) {
//     console.error('Error saving quotation details:', error);
//     res.status(500).json({ message: 'Failed to save quotation details' });
//   }
// });


// ➤ Get all quotation details
router.get("/", async (req, res) => {
    try {
        const quotationDetails = await QuotationDetail.find().populate("quotationid categoryid productid brandid");
        res.json({ status: "success", data: quotationDetails });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// ➤ Get a single quotation detail by ID
router.get("/:id", async (req, res) => {
    try {
        const quotationDetail = await QuotationDetail.findById(req.params.id).populate("quotationid categoryid productid brandid");
        if (!quotationDetail) return res.status(404).json({ status: "error", message: "Quotation detail not found" });
        res.json({ status: "success", data: quotationDetail });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// routes/quotationdetails.js
router.get('/byquotation/:id', async (req, res) => {
  try {
    const details = await QuotationDetail.find({ quotationid: req.params.id }).populate('productid').populate('categoryid').populate('brandid');
    res.json({ data: details });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching quotation details.' });
  }
});

// ➤ Update a quotation detail by ID
router.put("/:id", async (req, res) => {
    try {
        const updatedQuotationDetail = await QuotationDetail.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedQuotationDetail) return res.status(404).json({ status: "error", message: "Quotation detail not found" });
        res.json({ status: "success", data: updatedQuotationDetail });
    } catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
});

// ➤ Delete a quotation detail by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedQuotationDetail = await QuotationDetail.findByIdAndDelete(req.params.id);
        if (!deletedQuotationDetail) return res.status(404).json({ status: "error", message: "Quotation detail not found" });
        res.json({ status: "success", message: "Quotation detail deleted successfully" });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

router.delete("/byquotation/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await QuotationDetail.deleteMany({ quotationid: id });
    res.json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "error", data: err.message });
  }
});

module.exports = router;
