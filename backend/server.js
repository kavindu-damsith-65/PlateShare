const express = require("express");
const path = require('path');

const cors = require("cors");
const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const productRoutes = require("./routes/productRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const organisationRequestsRoutes = require("./routes/organisationRequestsRoutes");
const organisationHistoryRoutes = require("./routes/organisationHistoryRoutes");


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/products", productRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/user", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/orgrequests", organisationRequestsRoutes);
app.use("/api/orghistory", organisationHistoryRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// sequelize.sync({ alter: true }).then(() => {
//     console.log("Database connected and synced (altered)");
//     app.listen(process.env.PORT, () => {
//         console.log(`Server running on port ${process.env.PORT}`);
//     });
// });

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
