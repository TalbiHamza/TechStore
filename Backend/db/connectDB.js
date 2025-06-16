const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("techstore", "root", "", {
  host: "localhost",
  dialect: "mysql",
  port: 3307,
  logging: false, // Set to console.log for debugging
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected successfully");
    await sequelize.sync(); // Sync models to create tables
  } catch (error) {
    console.error("Unable to connect to MySQL:", error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
