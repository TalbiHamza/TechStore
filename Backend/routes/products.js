const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const multer = require("multer");
const path = require("path");

const Product = require("../models/products");
const Category = require("../models/category");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// Setting up multer for multiple images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/products");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = file.fieldname + "-" + Date.now() + ext;
    cb(null, filename);
  },
});
const upload = multer({ storage });

// Getting featured products
router.get("/featured", async (req, res) => {
  try {
    const featuredProducts = await Product.findAll({
      attributes: [
        "id",
        "title",
        "price",
        "images",
        "reviewsRate",
        "reviewsCounts",
        "stock",
      ],
      order: [
        ["reviewsRate", "DESC"],
        ["reviewsCounts", "DESC"],
      ],
      limit: 3,
    });
    return res.json(featuredProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Route to handle auto-suggestions based on search string
router.get("/suggestions", async (req, res) => {
  try {
    const search = req.query.search;
    const products = await Product.findAll({
      where: {
        title: {
          [Op.iLike]: `%${search}%`,
        },
      },
      attributes: ["id", "title"],
      limit: 10,
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// Getting single product details
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findOne({
      where: { id },
      include: [{ model: Category }],
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Getting products information
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 8;
  const startIndex = (page - 1) * perPage;
  const queryCategory = req.query.category || null;
  const querySearch = req.query.search || null;

  try {
    let where = {};
    if (queryCategory) {
      const category = await Category.findOne({
        where: { name: queryCategory },
      });
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      where.categoryId = category.id;
    }
    if (querySearch) {
      where.title = { [Op.iLike]: `%${querySearch}%` };
    }

    const products = await Product.findAll({
      where,
      attributes: [
        "id",
        "title",
        "price",
        "images",
        "reviewsRate",
        "reviewsCounts",
        "stock",
      ],
      offset: startIndex,
      limit: perPage,
    });

    const totalProducts = await Product.count({ where });
    const totalPages = Math.ceil(totalProducts / perPage);

    return res.json({
      products,
      currentPage: page,
      postPerPage: perPage,
      totalProducts,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Post products with image upload
router.post("/", auth, admin, upload.array("images", 5), async (req, res) => {
  try {
    const images = req.files
      ? req.files.map((file) => file.filename)
      : req.body.images || [];
    const newProduct = await Product.create({
      title: req.body.title,
      description: req.body.description,
      images,
      price: req.body.price,
      stock: req.body.stock,
      categoryId: req.body.category,
      reviewsRate: req.body.reviews?.rate,
      reviewsCounts: req.body.reviews?.counts,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete products by admin
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const deleted = await Product.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product Deleted Successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
