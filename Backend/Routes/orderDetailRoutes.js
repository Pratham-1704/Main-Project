const express = require("express");
const router = express.Router();
const OrderDetail = require("../Models/OrderDetailSchema");

// ➤ Create a new order detail
router.post("/", async (req, res) => {
    try {
        const newOrderDetail = new OrderDetail(req.body);
        const savedOrderDetail = await newOrderDetail.save();
        res.status(201).json({ status: "success", data: savedOrderDetail });
    } catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
});

// ➤ Get all order details
router.get("/", async (req, res) => {
    try {
        const orderDetails = await OrderDetail.find();
        res.json({ status: "success", data: orderDetails });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// ➤ Get a single order detail by ID
router.get("/:id", async (req, res) => {
    try {
        const orderDetail = await OrderDetail.findById(req.params.id);
        if (!orderDetail) return res.status(404).json({ status: "error", message: "Order Detail not found" });
        res.json({ status: "success", data: orderDetail });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// ➤ Update an order detail by ID
router.put("/:id", async (req, res) => {
    try {
        const updatedOrderDetail = await OrderDetail.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedOrderDetail) return res.status(404).json({ status: "error", message: "Order Detail not found" });
        res.json({ status: "success", data: updatedOrderDetail });
    } catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
});

// ➤ Delete an order detail by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedOrderDetail = await OrderDetail.findByIdAndDelete(req.params.id);
        if (!deletedOrderDetail) return res.status(404).json({ status: "error", message: "Order Detail not found" });
        res.json({ status: "success", message: "Order Detail deleted successfully" });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

module.exports = router;
