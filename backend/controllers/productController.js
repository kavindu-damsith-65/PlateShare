const sequelize = require("../config/db");
const { Product, Restaurant, SellerDetails, SubProduct, FoodRequest, FoodBucket, Category, ProductSubProduct } = require("../models/AuthModel");
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
        console.error("Error fetching products:", error);
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
            limit: 12
        });

        return res.status(200).json({ products: randomProducts });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.fetchCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            attributes: ['id', 'category', 'image']
        });

        if (!categories || categories.length === 0) {
            return res.status(404).json({ message: 'No categories found' });
        }

        return res.status(200).json({
            message: 'Categories fetched successfully',
            categories: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getProductsByCategory = async (req, res) => {
    try {
        const { categoryId, location } = req.params;

        if (!categoryId || !location) {
            return res.status(400).json({ message: "Category ID and location are required" });
        }

        // Get the category name from the category ID
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        const categoryName = category.category;

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
            where: {
                user_id: { [Op.in]: sellerIds },
                name: { [Op.like]: `%${categoryName}%` } // Filter restaurants by name containing category name
            },
            attributes: ["id", "name", "image", "description", "user_id"]
        });

        const restaurantIds = restaurants.map(restaurant => restaurant.id);

        // Find products from these restaurants with the specified category
        const products = await Product.findAll({
            where: {
                [Op.or]: [
                    { category_id: categoryId }, // Products with exact category ID
                    { restaurant_id: { [Op.in]: restaurantIds } } // Products from restaurants with category in name
                ],
                available: true
            },
            include: [
                {
                    model: Restaurant,
                    attributes: ["name", "image"]
                },
                {
                    model: Category,
                    attributes: ["category"]
                }
            ]
        });

        return res.status(200).json({
            restaurants,
            products,
            message: "Category items fetched successfully"
        });

    } catch (error) {
        console.error("Error fetching category items:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.searchProductsAndRestaurants = async (req, res) => {
    try {
        const { query, location } = req.params;

        // Check if query is at least 3 characters
        if (!query || query.length < 3) {
            return res.status(400).json({ message: "Search query must be at least 3 characters" });
        }

        // Find sellers based on location
        const sellers = await SellerDetails.findAll({
            where: { location },
            attributes: ["user_id"]
        });

        if (sellers.length === 0) {
            return res.status(404).json({ message: "No sellers found in this location" });
        }

        const sellerIds = sellers.map(seller => seller.user_id);

        // Find restaurants with names containing the search query
        const restaurants = await Restaurant.findAll({
            where: {
                user_id: { [Op.in]: sellerIds },
                name: { [Op.like]: `%${query}%` }
            },
            attributes: ["id", "name", "image", "description", "user_id"]
        });

        // Find products with names containing the search query
        const products = await Product.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${query}%` } },
                    { description: { [Op.like]: `%${query}%` } }
                ],
                available: true
            },
            include: [
                {
                    model: Restaurant,
                    attributes: ["name", "image"]
                },
                {
                    model: Category,
                    attributes: ["category"]
                }
            ]
        });

        return res.status(200).json({
            restaurants,
            products,
            message: "Search results fetched successfully"
        });

    } catch (error) {
        console.error("Error searching products and restaurants:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
