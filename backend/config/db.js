const { Sequelize } = require("sequelize");
require("dotenv").config();
const fs = require("fs");
const path = require("path");



// Get absolute path of ca.pem
const caPath = path.resolve(__dirname, "ca.pem");


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    dialectOptions: {
        ssl: {
            rejectUnauthorized: true,
            ca: fs.readFileSync(caPath),
        },
    },
});


module.exports = sequelize;
