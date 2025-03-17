const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Create Category
router.post('/categories', async (req, res) => {
  try {
    const { id, name, type, billiningin, srno } = req.body;
    
    // Validate required fields
    if (!id || !name || !type || !srno) {
      return res.status(400).json({ message: 'All fields except billiningin are required' });
    }

    const category = new Category({ id, name, type, billiningin, srno });
    await category.save();
    
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Category by ID
router.get('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findOne({ id: req.params.id });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Category
router.put('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });

    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Category
router.delete('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ id: req.params.id });
    if (!category) return res.status(404).json({ message: 'Category not found' });

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
