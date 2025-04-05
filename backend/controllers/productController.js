const { Product, Restaurant, SellerDetails, SubProduct} = require("../models/AuthModel");
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
