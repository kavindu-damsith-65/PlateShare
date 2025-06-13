const { Restaurant, Product, Donation } = require("../models/AuthModel");

exports.createDonation = async (req, res) => {
    try {
        const restaurantId = req.params.restaurantId;
        const { requestId, products } = req.body;

        // Fetch restaurant
        const restaurant = await Restaurant.findByPk(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        // Validate each product
        const productValidationErrors = [];
        for (const { productId, quantity } of products) {
            const product = await Product.findByPk(productId);

            if (!product) {
                productValidationErrors.push(`Product with ID ${productId} not found`);
                continue;
            }
            if (product.restaurant_id !== restaurant.id) {
                productValidationErrors.push(`Product with ID ${productId} does not belong to the specified restaurant`);
                continue;
            }

            if (product.quantity < quantity) {
                productValidationErrors.push(`Insufficient quantity for product ID ${productId}`);
                continue;
            }
        }

        if (productValidationErrors.length > 0) {
            return res.status(400).json({ message: "Validation errors", errors: productValidationErrors });
        }

        // Create donations and update product quantities
        const createdDonations = [];
        for (const { productId, quantity } of products) {
            console.log(requestId, productId, quantity);
            const donation = await Donation.create({
                food_request_id: requestId,
                product_id: productId,
                restaurant_id: restaurantId,
                quantity: quantity
            });
            Product.update(
                { quantity: Product.sequelize.literal(`quantity - ${quantity}`) },
                { where: { id: productId } }
            );
            createdDonations.push(donation);
        }

        return res.status(201).json({ message: "Donations created successfully", donations: createdDonations });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getDonationsByRestaurantId = async (req, res) => {
    try {
        const restaurantId = req.params.restaurantId;

        // Fetch donations for the restaurant
        const donations = await Donation.findAll({
            where: { restaurant_id: restaurantId },
            include: [
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name', 'image']
                }
            ]
        });

        if (!donations || donations.length === 0) {
            return res.status(404).json({ message: "No donations found for this restaurant" });
        }

        return res.status(200).json({ donations });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}