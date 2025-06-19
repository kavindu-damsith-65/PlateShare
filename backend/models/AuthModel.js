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
    offers_delivery: { type: DataTypes.BOOLEAN, defaultValue: false },
    delivery_fee: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0.00 },
    min_order_for_delivery: { type: DataTypes.DECIMAL(6, 2), defaultValue: 0.00 },
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

// Delivery Details Model
const DeliveryDetails = sequelize.define('delivery_details', {
    user_id: { type: DataTypes.STRING, primaryKey: true },
    email: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    location: { type: DataTypes.STRING },
    availability: { type: DataTypes.BOOLEAN, defaultValue: true },
    vehicle_type: { 
        type: DataTypes.ENUM('bicycle', 'motorcycle', 'car', 'walking'),
        allowNull: true 
    },
    total_deliveries: { type: DataTypes.INTEGER, defaultValue: 0 },
    rating: { type: DataTypes.DECIMAL(3, 2), defaultValue: 5.00 },
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
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.STRING, unique: true },
    status: { type: DataTypes.INTEGER },
    price: { type: DataTypes.DECIMAL(5, 2) },
    restaurant_id: { type: DataTypes.STRING }
});

const FoodBucketProduct = sequelize.define('food_bucket_product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    food_bucket_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false }
}, {
    indexes: [
        {
            unique: true,
            fields: ['food_bucket_id', 'product_id']
        }
    ]
});

// Payment Model
const Payment = sequelize.define('payment', {
    id: { type: DataTypes.STRING, primaryKey: true },
    order_id: { type: DataTypes.INTEGER},
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
    restaurant_id: { type: DataTypes.STRING, allowNull: false },
    product_id: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER }
});

// Delivery Request Model
const DeliveryRequest = sequelize.define('delivery_request', {
    id: { type: DataTypes.STRING, primaryKey: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    buyer_id: { type: DataTypes.STRING, allowNull: false },
    volunteer_id: { type: DataTypes.STRING, allowNull: true }, // Set when accepted
    status: {
    type: DataTypes.ENUM('pending', 'accepted', 'picked_up', 'delivered'),
    defaultValue: 'pending'
    },
    pickup_address: { type: DataTypes.TEXT, allowNull: false },
    delivery_address: { type: DataTypes.TEXT, allowNull: false },
    delivery_fee: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0.00 },
});

const DeliveryReview = sequelize.define('delivery_review', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    delivery_request_id: { type: DataTypes.STRING, allowNull: false },
    reviewer_id: { type: DataTypes.STRING, allowNull: false },
    volunteer_id: { type: DataTypes.STRING, allowNull: false },
    reviewer_type: { 
        type: DataTypes.ENUM('buyer', 'restaurant'),
        allowNull: false 
    },
    rating: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        validate: { min: 1, max: 5 }
    },
    comment: { type: DataTypes.TEXT, allowNull: true },
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

User.hasMany(FoodBucket, { foreignKey: "user_id", onDelete: "CASCADE" });
FoodBucket.belongsTo(User, { foreignKey: "user_id" });

FoodBucket.hasMany(FoodBucketProduct, { foreignKey: 'food_bucket_id', as: 'foodBucketProducts' });
FoodBucketProduct.belongsTo(FoodBucket, { foreignKey: 'food_bucket_id', as: 'foodBucket' });

FoodBucket.belongsToMany(Product, {
    through: FoodBucketProduct,
    foreignKey: "food_bucket_id",
    otherKey: "product_id",
    onDelete: "CASCADE"
});
Product.belongsToMany(FoodBucket, {
    through: FoodBucketProduct,
    foreignKey: "product_id",
    otherKey: "food_bucket_id",
    onDelete: "CASCADE"
});

// User - DeliveryDetails relationship (one-to-one)
User.hasOne(DeliveryDetails, { foreignKey: "user_id", constraints: false, onDelete: "CASCADE" });
DeliveryDetails.belongsTo(User, { foreignKey: "user_id", constraints: false });

// DeliveryRequest relationships
User.hasMany(DeliveryRequest, { foreignKey: "buyer_id", as: "buyerDeliveryRequests", onDelete: "CASCADE" });
DeliveryRequest.belongsTo(User, { foreignKey: "buyer_id", as: "buyer" });

User.hasMany(DeliveryRequest, { foreignKey: "volunteer_id", as: "volunteerDeliveryRequests" });
DeliveryRequest.belongsTo(User, { foreignKey: "volunteer_id", as: "volunteer" });

FoodBucket.hasOne(DeliveryRequest, { foreignKey: "order_id", onDelete: "CASCADE" });
DeliveryRequest.belongsTo(FoodBucket, { foreignKey: "order_id", constraints: false });

// DeliveryReview relationships
DeliveryRequest.hasMany(DeliveryReview, { foreignKey: "delivery_request_id", onDelete: "CASCADE" });
DeliveryReview.belongsTo(DeliveryRequest, { foreignKey: "delivery_request_id" });

User.hasMany(DeliveryReview, { foreignKey: "reviewer_id", as: "givenDeliveryReviews", onDelete: "CASCADE" });
DeliveryReview.belongsTo(User, { foreignKey: "reviewer_id", as: "reviewer" });

User.hasMany(DeliveryReview, { foreignKey: "volunteer_id", as: "receivedDeliveryReviews" });
DeliveryReview.belongsTo(User, { foreignKey: "volunteer_id", as: "reviewedVolunteer" });

module.exports = {
    User, BuyerDetails, SellerDetails, OrgDetails, Product, Restaurant, SubProduct,
    FoodRequest, Admin, FoodBucket, FoodBucketProduct, Payment, ProductSubProduct, Review, Donation,
    Category, DeliveryDetails, DeliveryRequest, DeliveryReview
};
