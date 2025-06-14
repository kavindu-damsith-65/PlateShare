const { FoodBucket, Restaurant, FoodBucketProduct, User } = require("../models/AuthModel");
const Sequelize = require("sequelize");

exports.getOrdersByRestaurantId = async (req, res) => {
    try {
        const restaurantId = req.params.restaurantId;

        const restaurant = await Restaurant.findByPk(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        const orders = await FoodBucket.findAll({
            where: { restaurant_id: restaurantId },
            include: [
            {
                model: FoodBucketProduct,
                as: 'foodBucketProducts',
                required: false
            },
            {
                model: User,
                attributes: ['name', 'profile_picture']
            }
            ]
        });

        return res.status(200).json({ orders });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}