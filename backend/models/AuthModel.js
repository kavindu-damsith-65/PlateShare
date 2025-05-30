const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// User Model
const User = sequelize.define('user', {
    id: { type: DataTypes.STRING, primaryKey: true },
    name: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: 'user' },
    profile_picture: { type: DataTypes.STRING, allowNull: true },
    verified: { type: DataTypes.BOOLEAN, defaultValue: true },
    password: { type: DataTypes.STRING, allowNull: false },
});

// Buyer Details Model
const BuyerDetails = sequelize.define('buyer_details', {
    user_id: { type: DataTypes.STRING, primaryKey: true },
    email: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    location: { type: DataTypes.STRING },
});

// Seller Details Model
const SellerDetails = sequelize.define('seller_details', {
    user_id: { type: DataTypes.STRING ,primaryKey: true},
    email: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    location: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
});

// Organization Details Model
const OrgDetails = sequelize.define('org_details', {
    user_id: { type: DataTypes.STRING, primaryKey: true },
    email: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    location: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    additional_images: { type: DataTypes.STRING },
});

// Restaurant Model
const Restaurant = sequelize.define('restaurant', {
    id: { type: DataTypes.STRING, primaryKey: true },
    name: { type: DataTypes.STRING },
    user_id: { type: DataTypes.STRING},
    image: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT }, 
});

// Category Model
const Category = sequelize.define('category', {
  id: {type: DataTypes.STRING, primaryKey: true,allowNull: false},
  category: {type: DataTypes.STRING, allowNull: true},
  image: {type: DataTypes.STRING, allowNull: true}
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
    description: { type: DataTypes.STRING },
    category_id: {type: DataTypes.STRING, allowNull: true}
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
},
    {
        indexes: [
            {
                unique: true,
                fields: ['product_id', 'subproduct_id']
            }
        ]
});


// Food Request Model
const FoodRequest = sequelize.define('food_request', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    org_details_user_id: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING },
    products: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER },
    completed: { type: DataTypes.BOOLEAN },
    dateTime: { type: DataTypes.DATE },
    notes: { type: DataTypes.STRING },
    visibility: { type: DataTypes.BOOLEAN },
    urgent: { type: DataTypes.BOOLEAN },
    delivery: { type: DataTypes.BOOLEAN }
});

// Admin Model
const Admin = sequelize.define('admin', {
    id: { type: DataTypes.STRING, primaryKey: true },
    role: { type: DataTypes.STRING, defaultValue: 'user' },
    verified: { type: DataTypes.INTEGER, defaultValue: 0 },
    email: { type: DataTypes.INTEGER }
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

// Reviews Model
const Review = sequelize.define('review', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    description: { type: DataTypes.TEXT },
    rating: { type: DataTypes.INTEGER, },
    restaurant_id: { type: DataTypes.STRING },
    user_id: { type: DataTypes.STRING },
});

// Donations Model
const Donation = sequelize.define('donation', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    food_request_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER }
});

// Relationships
User.hasOne(BuyerDetails, { foreignKey: "user_id", constraints: false, onDelete: "CASCADE"});
BuyerDetails.belongsTo(User, { foreignKey: "user_id", constraints: false });
User.hasOne(SellerDetails, { foreignKey: "user_id", constraints: false, onDelete: "CASCADE"});
SellerDetails.belongsTo(User, { foreignKey: "user_id", constraints: false });
User.hasOne(OrgDetails, { foreignKey: "user_id", constraints: false, onDelete: "CASCADE"});
OrgDetails.belongsTo(User, { foreignKey: "user_id", constraints: false });

// Update this relationship with an explicit alias
SellerDetails.hasOne(Restaurant, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    as: "restaurant"
});
Restaurant.belongsTo(SellerDetails, {
    foreignKey: "user_id",
    as: "seller_detail"
});

Restaurant.hasMany(Product, {foreignKey: "restaurant_id", onDelete: "CASCADE"});
Product.belongsTo(Restaurant, {foreignKey: "restaurant_id"});

Restaurant.hasMany(SubProduct, {foreignKey: "restaurant_id", onDelete: "CASCADE"});
SubProduct.belongsTo(Restaurant, {foreignKey: "restaurant_id"});

Restaurant.hasMany(Review, { foreignKey: "restaurant_id", onDelete: "CASCADE" });
Review.belongsTo(Restaurant, { foreignKey: "restaurant_id" });

User.hasMany(Review, { foreignKey: "user_id", onDelete: "CASCADE" });
Review.belongsTo(User, { foreignKey: "user_id" });

Product.belongsToMany(SubProduct, {
    through: ProductSubProduct,
    foreignKey: "product_id",
    otherKey: "subproduct_id",
    onDelete: "CASCADE"
});

SubProduct.belongsToMany(Product, {
    through: ProductSubProduct,
    foreignKey: "subproduct_id",
    otherKey: "product_id",
    onDelete: "CASCADE"
});

OrgDetails.hasMany(FoodRequest, { foreignKey: "org_details_user_id", onDelete: "CASCADE" });
FoodRequest.belongsTo(OrgDetails, { foreignKey: "org_details_user_id" });

FoodRequest.hasMany(Donation, { foreignKey: "food_request_id", onDelete: "CASCADE" });
Donation.belongsTo(FoodRequest, { foreignKey: "food_request_id" });

Product.hasMany(Donation, { foreignKey: "product_id", onDelete: "CASCADE" });
Donation.belongsTo(Product, { foreignKey: "product_id" });

Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = {
    User, BuyerDetails, SellerDetails, OrgDetails, Product, Restaurant, SubProduct,
    FoodRequest, Admin, FoodBucket, Payment, Order, ProductSubProduct, Review, Donation,
    Category
};
