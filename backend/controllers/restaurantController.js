const {Restaurant, SellerDetails, Product, SubProduct, Review} = require("../models/AuthModel");
const { Op } = require("sequelize");

exports.showNearByRestaurants = async (req, res) => {
    try {
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
            include: [
                {
                    model: SellerDetails,
                    as: "seller_detail", // Make sure this matches the association alias
                    attributes: ["user_id", "email", "phone", "address", "location"]
                },
                {
                    model: Review,
                    attributes: ["id", "rating"]
                }
            ]
        });

        if (restaurants.length === 0) {
            return res.status(404).json({ message: "No restaurants found for this location" });
        }

        const restaurantsWithRatings = await Promise.all(
            restaurants.map(async (restaurant) => {
                const averageRating = await averageRatingForRestaurant(restaurant.id);
                return {
                    ...restaurant.toJSON(),
                    averageRating
                };
            })
        );

       return res.status(200).json({ restaurants: restaurantsWithRatings });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.showRestaurantDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await Restaurant.findOne({
            where: { id },
            include: [
                {
                    model: SellerDetails,
                    as: "seller_detail",
                    attributes: ["email", "phone", "address", "location"]
                },
                {
                    model: Product,
                    include: [
                        {
                            model: SubProduct,
                            through: { attributes: [] },
                        }
                    ]
                },
                {
                    model: Review,
                    attributes: ["id", "rating"]
                }
            ]
        });

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        return res.status(200).json({ restaurant });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

averageRatingForRestaurant = async (restaurantId) => {
    try {
        const reviews = await Review.findAll({
            where: { restaurant_id: restaurantId },
            attributes: ["rating"]
        });

        if (!reviews || reviews.length === 0) {
            return "N/A";
        }

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = parseFloat((totalRating / reviews.length).toFixed(1));

        return averageRating;
    } catch (error) {
        throw new Error("Failed to calculate average rating");
    }
};


