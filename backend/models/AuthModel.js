const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// User Model
const User = sequelize.define('user', {
    id: { type: DataTypes.STRING, primaryKey: true },
    role: { type: DataTypes.STRING, defaultValue: 'user' },
    verified: { type: DataTypes.INTEGER, defaultValue: 0 },
    password: { type: DataTypes.STRING, allowNull: false },
});

// Buyer Details Model
const BuyerDetails = sequelize.define('buyer_details', {
    user_id: { type: DataTypes.STRING, primaryKey: true },
    name: { type: DataTypes.STRING },
    email: { type: DataTypes.BOOLEAN },
    phone: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    location: { type: DataTypes.STRING },
    profile_picture: { type: DataTypes.STRING },
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

// Relationships
User.hasOne(BuyerDetails, { foreignKey: 'user_id' });
User.hasOne(OrgDetails, { foreignKey: 'user_id' });


module.exports = { User, BuyerDetails, OrgDetails };
