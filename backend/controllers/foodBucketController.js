const { FoodBucket, Product, FoodBucketProduct } = require("../models/AuthModel");

//  Place an order by creating a food bucket (cart)
exports.placeOrder = async (req, res) => {
    try {
        const { user_id, product_id, amount } = req.body;
        if (!user_id || !product_id || !amount) {
            return res.status(400).json({ message: "user_id, product_id, and amount are required" });
        }

        // Find or create the user's food bucket
        let foodBucket = await FoodBucket.findOne({ where: { user_id, status: 1 } });
        if (!foodBucket) {
            foodBucket = await FoodBucket.create({ user_id, status: 1 });
        }

        const foodBucket = await FoodBucket.create({ 
            user_id,
            restaurant_id,
            status: 0, // active/cart status
            price: total_price || 0 
        });

        if (bucketProduct) {
            bucketProduct.quantity += amount;
            await bucketProduct.save();
        } else {
            bucketProduct = await FoodBucketProduct.create({
                food_bucket_id: foodBucket.id,
                product_id,
                quantity: amount
            });
        }
        return res.status(200).json({ message: "Item added to cart", item: foodBucket });
    } catch (error) {
        console.error("Error creating food bucket:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// View all items in user's food bucket (cart)
exports.getFoodBucketByUser = async (req, res) => {
    try {
        const { user_id } = req.params;
        if (!user_id) {
            return res.status(400).json({ message: "user_id is required" });
        }

        const foodBuckets = await FoodBucket.findAll({
            where: { user_id },
            include: [{
                model: Product,
                through: { attributes: ['quantity'] }
            }]
        });

        if (!foodBuckets || foodBuckets.length === 0) {
            return res.status(200).json({ items: [] });
        }

        // Format response to include all buckets with their products
        const buckets = foodBuckets.map(bucket => {
            const items = bucket.products.map(product => ({
                ...product.toJSON(),
                quantity: product.food_bucket_product.quantity
            }));
            
            return {
                id: bucket.id,
                restaurant_id: bucket.restaurant_id,
                status: bucket.status,
                price: bucket.price,
                items
            };
        });

        return res.status(200).json({ buckets });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.getFoodBucketByUserIdAndStatus = async (req, res) => {
    try {
        const { user_id } = req.params;
        const foodBucket = await FoodBucket.findOne({
            where: { user_id: user_id, status: 1 },
            include: [{
                model: Product,
                through: { attributes: ['quantity'] }
            }]
        });

        if (!foodBucket) {
            return res.status(404).json({ message: 'Food bucket not found' });
        }

        res.json(foodBucket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
