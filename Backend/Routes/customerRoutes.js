const express = require("express");
const router = express.Router();
const Customer = require("../Models/CustomerSchema");

// ➤ Create a new customer with proper validation
router.post("/", async (req, res) => {
    try {
        const newCustomer = new Customer(req.body);
        const savedCustomer = await newCustomer.save();
        res.status(201).json({ status: "success", data: savedCustomer });
    } catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
});

// ➤ Get all customers
router.get("/", async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json({ status: "success", data: customers });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// ➤ Get a single customer by ID
router.get("/:id", async (req, res) => {
    try {
        let id= req.params.id;
        const customer = await Customer.findById(id).populate("firmid", "name");
        if (!customer) return res.status(404).json({ status: "error", message: "Customer not found" });
        res.json({ status: "success", data: customer });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// ➤ Update a customer by ID with validation
router.put("/:id", async (req, res) => {
    try {
        let Id = req.params.id;
        let Data = req.body;
        const updatedCustomer = await Customer.findByIdAndUpdate( Id, Data, { new: true, runValidators: true });
        if (!updatedCustomer) return res.status(404).json({ status: "error", message: "Customer not found" });
        res.json({ status: "success", data: updatedCustomer });
    } catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
});

// ➤ Delete a customer by ID
router.delete("/:id", async (req, res) => {
    try {

        let Id = req.params.id;
        const deletedCustomer = await Customer.findByIdAndDelete(Id);
        if (!deletedCustomer) return res.status(404).json({ status: "error", message: "Customer not found" });
        res.json({ status: "success", message: "Customer deleted successfully" });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

module.exports = router;
