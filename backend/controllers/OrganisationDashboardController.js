
const { FoodRequest, Donation, User, OrgDetails } = require("../models/AuthModel");
const { Op, fn, col, literal } = require("sequelize");
const sequelize = require("../config/db");

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

// Get weekly request activity data
exports.getWeeklyActivity = async (req, res) => {
    try {
        const { id } = req.params;

        // Get the current date and calculate dates for the past week
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Calculate days to go back to Monday

        const monday = new Date(today);
        monday.setDate(today.getDate() - daysToMonday);
        monday.setHours(0, 0, 0, 0);

        // Create an array of days from Monday to Sunday
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const values = Array(7).fill(0); // Initialize with zeros

        // Query to get count of requests created each day of the week
        const requests = await FoodRequest.findAll({
            attributes: [
                [fn('DATE', col('createdAt')), 'date'],
                [fn('COUNT', '*'), 'count']
            ],
            where: {
                org_details_user_id: id,
                createdAt: {
                    [Op.gte]: monday
                }
            },
            group: [fn('DATE', col('createdAt'))],
            raw: true
        });

        // Fill in the value array with actual counts
        requests.forEach(request => {
            const requestDate = new Date(request.date);
            const dayIndex = (requestDate.getDay() + 6) % 7; // Convert to 0 = Monday, ..., 6 = Sunday
            values[dayIndex] = parseInt(request.count);
        });

        return res.status(200).json({
            weeklyRequestData: {
                labels: days,
                values: values
            }
        });
    } catch (error) {
        console.error("Error fetching weekly activity:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Get request status for the current month
exports.getRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;

        // Get first day of current month
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // Get count of fulfilled (completed) requests
        const fulfilled = await FoodRequest.count({
            where: {
                org_details_user_id: id,
                completed: true,
                createdAt: {
                    [Op.gte]: firstDayOfMonth
                }
            }
        });

        // Get count of pending (incomplete) requests
        const pending = await FoodRequest.count({
            where: {
                org_details_user_id: id,
                completed: false,
                createdAt: {
                    [Op.gte]: firstDayOfMonth
                }
            }
        });

        return res.status(200).json({
            requestStatus: {
                fulfilled,
                pending
            }
        });
    } catch (error) {
        console.error("Error fetching request status:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
