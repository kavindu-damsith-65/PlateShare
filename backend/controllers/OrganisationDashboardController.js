
const { FoodRequest, Donation, User, OrgDetails } = require("../models/AuthModel");
const { Op } = require("sequelize");

// Get dashboard stats for an organization
exports.getOrgDashboardStats = async (req, res) => {
    try {
        const { id } = req.params;

        // Get active (incomplete) requests count
        const activeRequestsCount = await FoodRequest.count({
            where: {
                org_details_user_id: id,
                completed: false
            }
        });

        // Get completed requests count
        const completedRequestsCount = await FoodRequest.count({
            where: {
                org_details_user_id: id,
                completed: true
            }
        });

        // Get total donations count
        const donations = await Donation.count({
            include: [{
                model: FoodRequest,
                where: { org_details_user_id: id },
                required: true
            }]
        });

        // Return the stats
        return res.status(200).json({
            stats: [
                { title: "Active Requests", value: activeRequestsCount.toString(), icon: "clipboard-outline" },
                { title: "Donations", value: donations.toString(), icon: "gift-outline" },
                { title: "Completed", value: completedRequestsCount.toString(), icon: "checkmark-circle-outline" }
            ]
        });

    } catch (error) {
        console.error("Error fetching organization dashboard stats:", error);
        return res.status(500).json({ message: "Server error" });
    }
};