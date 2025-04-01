const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// User Model
const User = sequelize.define('user', {
    id: { type: DataTypes.STRING, primaryKey: true },
    role: { type: DataTypes.STRING, defaultValue: 'user' },
    verified: { type: DataTypes.BOOLEAN, defaultValue: true },
    password: { type: DataTypes.STRING, allowNull: false },
});

// Buyer Details Model
const BuyerDetails = sequelize.define('buyer_details', {
    user_id: { type: DataTypes.STRING, primaryKey: true },
    name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    location: { type: DataTypes.STRING },
    profile_picture: { type: DataTypes.STRING },
});

// Seller Details Model
const SellerDetails = sequelize.define('seller_details', {
    user_id: { type: DataTypes.STRING ,primaryKey: true},
    name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    location: { type: DataTypes.STRING },
});

// Organization Details Model
const OrgDetails = sequelize.define('org_details', {
    user_id: { type: DataTypes.STRING, primaryKey: true },
    name: { type: DataTypes.STRING },
    email: { type: DataTypes.BOOLEAN },
    phone: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    location: { type: DataTypes.STRING },
    profile_picture: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    additional_images: { type: DataTypes.STRING },
});

// Restaurant Model
const Restaurant = sequelize.define('restaurant', {
    id: { type: DataTypes.STRING, primaryKey: true },
    name: { type: DataTypes.STRING },
    user_id: { type: DataTypes.STRING},
});

// Product Model
const Product = sequelize.define('product', {
    id: { type: DataTypes.STRING, primaryKey: true },
    name: { type: DataTypes.STRING, defaultValue: 'user' },
    type: { type: DataTypes.BOOLEAN, defaultValue: false },
    available: { type: DataTypes.BOOLEAN, defaultValue: true },
    quantity: { type: DataTypes.INTEGER },
    restaurant_id: { type: DataTypes.STRING, allowNull: false },
    has_subs: { type: DataTypes.BOOLEAN, defaultValue: false },
    image: { type: DataTypes.STRING },
    price: { type: DataTypes.DECIMAL(5, 2) },
    description: { type: DataTypes.STRING }
});

// Sub Product Model
const SubProduct = sequelize.define('sub_products', {
    id: { type: DataTypes.STRING, primaryKey: true },
    name: { type: DataTypes.STRING, defaultValue: 'user' },
    type: { type: DataTypes.BOOLEAN, defaultValue: false },
    available: { type: DataTypes.BOOLEAN, defaultValue: true },
    restaurant_id: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(5, 2) },
    image: { type: DataTypes.STRING }
});

// Product-SubProduct Relationship Model
const ProductSubProduct = sequelize.define('product_subproduct', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    product_id: { type: DataTypes.STRING, allowNull: false },
    subproduct_id: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    image: { type: DataTypes.STRING }
});


// Food Request Model
const FoodRequest = sequelize.define('food_request', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    org_details_user_id: { type: DataTypes.STRING },
    product_id: { type: DataTypes.STRING }
});

// Admin Model
const Admin = sequelize.define('admin', {
    id: { type: DataTypes.STRING, primaryKey: true },
    role: { type: DataTypes.STRING, defaultValue: 'user' },
    verified: { type: DataTypes.INTEGER, defaultValue: 0 },
    email: { type: DataTypes.INTEGER }
});

// Request Info Model
const RequestInfo = sequelize.define('request_info', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    food_request_id: { type: DataTypes.INTEGER },
    product_id: { type: DataTypes.STRING },
    quantity: { type: DataTypes.INTEGER },
    completed: { type: DataTypes.BOOLEAN }
});

// Food Bucket Model
const FoodBucket = sequelize.define('food_bucket', {
    id: { type: DataTypes.STRING, primaryKey: true },
    product_id: { type: DataTypes.STRING },
    user_id: { type: DataTypes.STRING },
    sub_products_ids: { type: DataTypes.STRING }
});

// Payment Model
const Payment = sequelize.define('payment', {
    id: { type: DataTypes.STRING, primaryKey: true },
    order_id: { type: DataTypes.STRING },
    price: { type: DataTypes.DECIMAL(5,2) }
});

// Order Model
const Order = sequelize.define('order', {
    id: { type: DataTypes.STRING, primaryKey: true },
    food_bucket_ids: { type: DataTypes.STRING },
    user_id: { type: DataTypes.STRING },
    status: { type: DataTypes.INTEGER },
    price: { type: DataTypes.DECIMAL(5,2) }
});

// Relationships
User.hasOne(BuyerDetails, { foreignKey: 'user_id' });
// User.hasOne(OrgDetails, { foreignKey: 'user_id' });
// User.hasOne(SellerDetails, { foreignKey: 'user_id' });
//
// User.hasMany(Order, { foreignKey: 'user_id' });
// User.hasMany(FoodBucket, { foreignKey: 'user_id' });
// User.hasMany(FoodRequest, { foreignKey: 'org_details_user_id' });
// User.hasMany(Restaurant, { foreignKey: 'user_id' });
//
// Restaurant.hasMany(Product, { foreignKey: 'restaurant_id' });
// Product.hasMany(SubProduct, { foreignKey: 'product_id' });
// Product.hasMany(RequestInfo, { foreignKey: 'product_id' });
// Product.hasMany(FoodBucket, { foreignKey: 'product_id' });
//
// Order.hasOne(Payment, { foreignKey: 'order_id' });
// Order.hasMany(FoodBucket, { foreignKey: 'food_bucket_ids' });
//
// FoodRequest.hasMany(RequestInfo, { foreignKey: 'food_request_id' });

module.exports = {
    User, BuyerDetails, SellerDetails, OrgDetails, Product, Restaurant, SubProduct,
    FoodRequest, Admin, RequestInfo, FoodBucket, Payment, Order, ProductSubProduct
};
