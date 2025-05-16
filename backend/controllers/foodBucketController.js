const { FoodBucket, Product } = require("../models/AuthModel");

// Add item to food bucket (cart)
exports.addToFoodBucket = async (req, res) => {
    try {
        const { user_id, product_id, amount } = req.body;
        if (!user_id || !product_id || !amount) {
            return res.status(400).json({ message: "user_id, product_id, and amount are required" });
        }

        // Check if item already exists in cart
        let item = await FoodBucket.findOne({ where: { user_id, product_id } });
        if (item) {
            item.amount += amount;
            await item.save();
        } else {
            item = await FoodBucket.create({ user_id, product_id, amount });
        }
        return res.status(200).json({ message: "Item added to cart", item });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

// View all items in user's food bucket (cart)
exports.getFoodBucketByUser = async (req, res) => {
    try {
        const { user_id } = req.params;
        if (!user_id) {
            return res.status(400).json({ message: "user_id is required" });
        }
        const items = await FoodBucket.findAll({
            where: { user_id },
            include: [{ model: Product }]
        });
        return res.status(200).json({ items });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Delete an item from user's food bucket (cart)
exports.deleteFoodBucketItem = async (req, res) => {
    try {
        const { user_id, product_id } = req.params;
        if (!user_id || !product_id) {
            return res.status(400).json({ message: "user_id and product_id are required" });
        }
        const item = await FoodBucket.findOne({ where: { user_id, product_id } });
        if (!item) {
            return res.status(404).json({ message: "Item not found in cart" });
        }
        await item.destroy();
        return res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};