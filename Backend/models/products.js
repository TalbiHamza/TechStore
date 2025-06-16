const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connectDB");
const Category = require("./category");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    images: {
      type: DataTypes.JSON, // Store array of image paths as JSON
      allowNull: false,
      get() {
        const value = this.getDataValue("images");
        return value ? (Array.isArray(value) ? value : JSON.parse(value)) : [];
      },
      set(value) {
        this.setDataValue("images", Array.isArray(value) ? value : []);
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
    },
    reviewsRate: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    reviewsCounts: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "products",
    timestamps: true,
  }
);

// Define relationship
Product.belongsTo(Category, { foreignKey: "categoryId" });

module.exports = Product;
