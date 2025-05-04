const sequelize = require("../config/db");
const { Product, Restaurant, SellerDetails, SubProduct, FoodRequest, FoodBucket} = require("../models/AuthModel");
const { Op } = require("sequelize");

exports.showNearByProducts = async (req, res) => {
    try {
        // Get location from params
        const { location } = req.params;

        // Find sellers based on location
        const sellers = await SellerDetails.findAll({
            where: { location },
            attributes: ["user_id"]
        });

        if (sellers.length === 0) {
            return res.status(404).json({ message: "No sellers found in this location" });
        }

        const sellerIds = sellers.map(seller => seller.user_id);

        // Find restaurants owned by these sellers
        const restaurants = await Restaurant.findAll({
            where: { user_id: { [Op.in]: sellerIds } },
            attributes: ["id"]
        });

        if (restaurants.length === 0) {
            return res.status(404).json({ message: "No restaurants found for these sellers" });
        }

        const restaurantIds = restaurants.map(restaurant => restaurant.id);

        // Find products from these restaurants
        const products = await Product.findAll({
            where: {
                restaurant_id: { [Op.in]: restaurantIds },
                available: true
            },
            include: [
                {
                    model: SubProduct,
                    through: { attributes: [] } // Exclude junction table fields if not needed
                }
            ]
        });

        if (products.length === 0) {
            return res.status(404).json({ message: "No products available for these restaurants" });
        }

        // Return the found products
        return res.status(200).json({ products });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};


exports.searchProducts = async (req, res) => {
    try {
        const { name } = req.params;

        if (!name) {
            return res.status(400).json({ message: "name is required" });
        }

        const products = await Product.findAll({
            where: {
                name: {
                    [Op.like]: `%${name}%`
                }
            }
        });
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

exports.getRecommendedProducts = async (req, res) => {
    try {
        const { userId } = req.params;

        // Only check food bucket
        const foodBucketProducts = await FoodBucket.findAll({
            where: { user_id: userId },
            attributes: ["product_id"]
        });

        const productIds = foodBucketProducts.map(item => item.product_id);

        if (productIds.length > 0) {
            const products = await Product.findAll({
                where: { id: { [Op.in]: productIds } }
            });

            return res.status(200).json({ products });
        }

        const randomProducts = await Product.findAll({
            where: { available: true },
            order: sequelize.random(),
            limit: 6
        });

        return res.status(200).json({ products: randomProducts });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
