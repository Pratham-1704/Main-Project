const express = require("express");
const router = express.Router();
const Order = require("../Models/OrderSchema");

// ➤ Create a new Order
router.post("/", async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).json({ status: "success", data: savedOrder });
    } catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
});

// ➤ Get all Orders
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find();
        res.json({ status: "success", data: orders });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// ➤ Get a single Order by ID
router.get("/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("customerid"); // <-- Add this line
        if (!order) return res.status(404).json({ status: "error", message: "Order not found" });
        res.json({ status: "success", data: order });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// ➤ Update an Order by ID
router.put("/:id", async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!updatedOrder) return res.status(404).json({ status: "error", message: "Order not found" });
        res.json({ status: "success", data: updatedOrder });
    } catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
});

// ➤ Delete an Order by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) return res.status(404).json({ status: "error", message: "Order not found" });
        res.json({ status: "success", message: "Order deleted successfully" });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

module.exports = router;
