const { FoodBucket, Product, FoodBucketProduct } = require("../models/AuthModel");

//  Place an order by creating a food bucket (cart)
exports.placeOrder = async (req, res) => {
    try {
        const { user_id, restaurant_id, items, total_price } = req.body;
        
        if (!user_id || !restaurant_id || !items || !Array.isArray(items)) {
            return res.status(400).json({ 
                message: "user_id, restaurant_id, and items array are required" 
            });
        }

        const foodBucket = await FoodBucket.create({ 
            user_id,
            restaurant_id,
            status: 0, // active/cart status
            price: total_price || 0 
        });

        // Create all items in bulk
        const bulkItems = items.map(item => ({
            food_bucket_id: foodBucket.id,
            product_id: item.product_id,
            quantity: item.quantity
        }));

        await FoodBucketProduct.bulkCreate(bulkItems);

        return res.status(200).json({ 
            message: "Order created successfully", 
            basket: {
                id: foodBucket.id,
                price: foodBucket.price,
                status: foodBucket.status
            }
        });
        
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
