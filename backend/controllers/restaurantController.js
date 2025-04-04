const {Restaurant, SellerDetails } = require("../models/AuthModel");
const { Op } = require("sequelize");

exports.showNearByRestaurants = async (req, res) => {
    try {
        // Get location from params
        const { location } = req.params;

        // Find sellers based on location
        const sellers = await SellerDetails.findAll({
            where: { location },
            attributes: ["user_id"]
        });

        const sellerIds = sellers.map(seller => seller.user_id);

        // Find restaurants owned by these sellers
        const restaurants = await Restaurant.findAll({
            where: { user_id: { [Op.in]: sellerIds } },
        });

        if (restaurants.length === 0) {
            return res.status(404).json({ message: "No restaurants found for this location" });
        }

        // Return the found restaurants
        return res.status(200).json({ restaurants });


    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
