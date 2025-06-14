const { FoodBucket, Product, FoodBucketProduct } = require("../models/AuthModel");

// Add item to food bucket (cart)
exports.addToFoodBucket = async (req, res) => {
    try {
        const { user_id, product_id, amount, restaurant_id } = req.body;
        if (!user_id || !product_id || !amount || !restaurant_id) {
            return res.status(400).json({ message: "user_id, product_id, amount, and restaurant_id are required" });
        }

        // Find or create the user's food bucket
        let foodBucket = await FoodBucket.findOne({ 
            where: { 
                user_id,
                restaurant_id,
                status: 0, // assuming status 0 means "active/cart" 
            }
        });
         if (!foodBucket) {
            foodBucket = await FoodBucket.create({ 
                user_id,
                restaurant_id,
                status: 0,
                price: 0 // initialize price
            });
        }

        // Check if product already exists in the bucket
        let bucketProduct = await FoodBucketProduct.findOne({
            where: { food_bucket_id: foodBucket.id, product_id }
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

        return res.status(200).json({ message: "Item added to cart", item: bucketProduct });
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

// Delete an item from user's food bucket (cart)
exports.deleteFoodBucketItem = async (req, res) => {
    try {
        const { user_id, product_id } = req.params;
        if (!user_id || !product_id) {
            return res.status(400).json({ message: "user_id and product_id are required" });
        }

        const foodBucket = await FoodBucket.findOne({ where: { user_id } });
        if (!foodBucket) {
            return res.status(404).json({ message: "Food bucket not found" });
        }

        const bucketProduct = await FoodBucketProduct.findOne({
            where: { food_bucket_id: foodBucket.id, product_id }
        });

        if (!bucketProduct) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        await bucketProduct.destroy();
        return res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
