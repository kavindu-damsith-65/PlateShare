const express = require("express");
const path = require('path');

const cors = require("cors");
const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const productRoutes = require("./routes/productRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/products", productRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

sequelize.sync().then(() => {
    console.log("Database connected and synced");
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
});
