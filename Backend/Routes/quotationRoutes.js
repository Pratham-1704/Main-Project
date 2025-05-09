const express = require("express");
const router = express.Router();
const Quotation = require("../Models/QuotationSchema");

// ➤ Create a new quotation
router.post("/", async (req, res) => {
    try {
        const newQuotation = new Quotation(req.body);
        const savedQuotation = await newQuotation.save();
        res.status(201).json({ status: "success", data: savedQuotation });
    } catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
});

// ➤ Get all quotations
router.get("/", async (req, res) => {
    try {
        const quotations = await Quotation.find();
        res.json({ status: "success", data: quotations });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// router.get("/:id", async (req, res) => {
//     try {
//       const quotationId = req.params.id;
  
//       const quotation = await Quotation.findById(quotationId)
//         .populate("baddress")
//         .populate("saddress")
//         .populate("adminid");
  
//       if (!quotation) {
//         return res.status(404).json({ message: "Quotation not found" });
//       }
  
//       const products = await QuotationDetail.find({ quotationid: quotationId })
//         .populate("productid categoryid brandid");
  
//       res.json({
//         details: {
//           quotationNo: quotation.quotationno,
//           quotationDate: quotation.quotationdate,
//           owner: quotation.adminid?.name || "Unknown",
//         },
//         billTo: quotation.baddress,
//         shipTo: quotation.saddress,
//         products: products.map((p, i) => ({
//           no: i + 1,
//           product: p.productid?.name,
//           size: p.size,
//           narration: p.narration,
//           req: p.req,
//           unit: p.unit,
//           producer: p.brandid?.name,
//           quantity: p.quantity,
//           rate: p.rate,
//           amount: p.amount,
//         })),
//         totalWeight: quotation.totalweight,
//         totalAmount: quotation.totalamount,
//       });
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   });
  
// ➤ Get a single quotation by ID
router.get("/:id", async (req, res) => {
    try {
        const quotation = await Quotation.findById(req.params.id).populate("sourceid customerid adminid");
        if (!quotation) return res.status(404).json({ status: "error", message: "Quotation not found" });
        res.json({ status: "success", data: quotation });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// ➤ Update a quotation by ID
router.put("/:id", async (req, res) => {
    try {
        const updatedQuotation = await Quotation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedQuotation) return res.status(404).json({ status: "error", message: "Quotation not found" });
        res.json({ status: "success", data: updatedQuotation });
    } catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
});

// ➤ Delete a quotation by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedQuotation = await Quotation.findByIdAndDelete(req.params.id);
        if (!deletedQuotation) return res.status(404).json({ status: "error", message: "Quotation not found" });
        res.json({ status: "success", message: "Quotation deleted successfully" });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

module.exports = router;
