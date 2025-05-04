const { FoodRequest, Donation, Product, Restaurant, User } = require("../models/AuthModel");
const { Op } = require("sequelize");

// Get all incomplete food requests for an organization with related donations and product details
exports.getIncompleteRequests = async (req, res) => {
    try {
        const { orgUserId } = req.params;

        // Find all incomplete food requests for the organization
        const foodRequests = await FoodRequest.findAll({
            where: { 
                org_details_user_id: orgUserId,
                completed: false
            },
            include: [
                {
                    model: Donation,
                    include: [
                        {
                            model: Product,
                            attributes: ['id', 'name', 'image', 'description', 'restaurant_id'],
                            include: [
                                {
                                    model: Restaurant,
                                    attributes: ['id', 'name', 'image']
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        if (foodRequests.length === 0) {
            return res.status(404).json({ message: "No incomplete food requests found for this organization" });
        }

        // Format the response data
        const formattedRequests = foodRequests.map(request => {
            const requestData = request.toJSON();
            
            // Format donations with product and restaurant info
            const donations = requestData.donations.map(donation => {
                return {
                    id: donation.id,
                    quantity: donation.quantity,
                    product: {
                        id: donation.product.id,
                        name: donation.product.name,
                        image: donation.product.image,
                        description: donation.product.description
                    },
                    restaurant: {
                        id: donation.product.restaurant.id,
                        name: donation.product.restaurant.name,
                        image: donation.product.restaurant.image
                    }
                };
            });

            return {
                id: requestData.id,
                title: requestData.title,
                products: requestData.products,
                quantity: requestData.quantity,
                dateTime: requestData.dateTime,
                notes: requestData.notes,
                urgent: requestData.urgent,
                delivery: requestData.delivery,
                visibility: requestData.visibility,
                donations: donations
            };
        });

        return res.status(200).json({ foodRequests: formattedRequests });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Get a specific food request with donations
exports.getRequestById = async (req, res) => {
    try {
        const { requestId } = req.params;

        const foodRequest = await FoodRequest.findByPk(requestId, {
            include: [
                {
                    model: Donation,
                    include: [
                        {
                            model: Product,
                            attributes: ['id', 'name', 'image', 'description', 'restaurant_id'],
                            include: [
                                {
                                    model: Restaurant,
                                    attributes: ['id', 'name', 'image']
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        if (!foodRequest) {
            return res.status(404).json({ message: "Food request not found" });
        }

        // Format the response
        const requestData = foodRequest.toJSON();
        
        // Format donations with product and restaurant info
        const donations = requestData.donations.map(donation => {
            return {
                id: donation.id,
                quantity: donation.quantity,
                product: {
                    id: donation.product.id,
                    name: donation.product.name,
                    image: donation.product.image,
                    description: donation.product.description
                },
                restaurant: {
                    id: donation.product.restaurant.id,
                    name: donation.product.restaurant.name,
                    image: donation.product.restaurant.image
                }
            };
        });

        const formattedRequest = {
            id: requestData.id,
            title: requestData.title,
            products: requestData.products,
            quantity: requestData.quantity,
            dateTime: requestData.dateTime,
            notes: requestData.notes,
            urgent: requestData.urgent,
            delivery: requestData.delivery,
            visibility: requestData.visibility,
            completed: requestData.completed,
            donations: donations
        };

        return res.status(200).json({ foodRequest: formattedRequest });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Mark a food request as completed
exports.markRequestCompleted = async (req, res) => {
    try {
        const { requestId } = req.params;
        
        const foodRequest = await FoodRequest.findByPk(requestId);
        
        if (!foodRequest) {
            return res.status(404).json({ message: "Food request not found" });
        }
        
        await foodRequest.update({ completed: true });
        
        return res.status(200).json({ 
            message: "Food request marked as completed",
            foodRequest
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Toggle visibility of a food request
exports.toggleRequestVisibility = async (req, res) => {
    try {
        const { requestId } = req.params;

        const foodRequest = await FoodRequest.findByPk(requestId);

        if (!foodRequest) {
            return res.status(404).json({ message: "Food request not found" });
        }

        // Toggle the visibility value
        const newVisibility = !foodRequest.visibility;

        await foodRequest.update({ visibility: newVisibility });

        return res.status(200).json({
            message: `Food request visibility changed to ${newVisibility ? 'public' : 'private'}`,
            foodRequest
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
