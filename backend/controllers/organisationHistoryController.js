const { FoodRequest, Donation, Product, Restaurant, User } = require("../models/AuthModel");
const { Op } = require("sequelize");

// Get all completed food requests for an organization with related donations and product details
exports.getCompletedRequests = async (req, res) => {
    try {
        const { orgUserId } = req.params;

        // Find all completed food requests for the organization
        const foodRequests = await FoodRequest.findAll({
            where: { 
                org_details_user_id: orgUserId,
                completed: true
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
            ],
            order: [['dateTime', 'DESC']] // Order by date, most recent first
        });

        if (foodRequests.length === 0) {
            return res.status(404).json({ message: "No completed food requests found for this organization" });
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
                completedDate: requestData.updatedAt, // Use updatedAt as completion date
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