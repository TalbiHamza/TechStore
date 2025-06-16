const express = require("express");
const router = express.Router();
const Category = require("../models/category");

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [["name", "ASC"]],
    });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//Adding new category
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }
    const category = await Category.create({
      name,
      image: req.file ? req.file.filename : req.body.image || null,
    });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
