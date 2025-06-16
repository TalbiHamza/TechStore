const { sequelize } = require("./db/connectDB");
const Category = require("./models/category");
const Product = require("./models/products");
const data = require("./data.json");

async function restoreProducts() {
  try {
    // Connect to MySQL
    await sequelize.authenticate();
    console.log("MySQL connected successfully");

    // Start a transaction
    await sequelize.transaction(async (t) => {
      // Clear existing data
      await Product.destroy({ where: {}, transaction: t });
      await Category.destroy({ where: {}, transaction: t });

      // Insert categories and products
      for (const category of data) {
        // Create category
        const newCategory = await Category.create(
          {
            name: category.name,
            image: category.image || null,
          },
          { transaction: t }
        );

        // Prepare products with categoryId
        const products = category.products.map((product) => ({
          title: product.title,
          description: product.description,
          images: product.images,
          price: product.price,
          stock: product.stock,
          categoryId: newCategory.id,
          reviewsRate: product.reviews?.rate,
          reviewsCounts: product.reviews?.counts,
        }));

        // Bulk insert products
        await Product.bulkCreate(products, { transaction: t });
      }
    });

    console.info("Database Filled/Restored Successfully!!");
  } catch (error) {
    console.error("Error restoring database:", error);
  } finally {
    // Close Sequelize connection
    await sequelize.close();
  }
}

restoreProducts();
