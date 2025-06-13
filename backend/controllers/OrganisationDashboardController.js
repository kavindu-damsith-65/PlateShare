
const { FoodRequest, Donation, User, OrgDetails, Product, Restaurant } = require("../models/AuthModel");
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

// Get recent updates for an organization (recent donations and expiring requests)
exports.getRecentUpdates = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = [];

        // Get recent donations (last 7 days)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const recentDonations = await Donation.findAll({
            include: [
                {
                    model: FoodRequest,
                    where: { org_details_user_id: id },
                    required: true
                },
                {
                    model: Product,
                    include: [
                        {
                            model: Restaurant,
                            attributes: ['name']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: 5
        });

        // Format recent donations for the frontend
        for (const donation of recentDonations) {
            const restaurantName = donation.product?.restaurant?.name || "Unknown Restaurant";
            const timeDiff = Math.floor((new Date() - new Date(donation.createdAt)) / (1000 * 60 * 60));
            let timeText;

            if (timeDiff < 24) {
                timeText = `${timeDiff} hours ago`;
            } else {
                const days = Math.floor(timeDiff / 24);
                timeText = days === 1 ? "Yesterday" : `${days} days ago`;
            }

            updates.push({
                message: `${restaurantName} donated ${donation.quantity} ${donation.product.name}`,
                time: timeText,
                icon: "gift-outline",
                type: "donation"
            });
        }

        // Get soon-to-expire requests (next 3 days)
        const now = new Date();
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(now.getDate() + 3);

        const expiringRequests = await FoodRequest.findAll({
            where: {
                org_details_user_id: id,
                completed: false,
                dateTime: {
                    [Op.between]: [now, threeDaysFromNow]
                }
            },
            order: [['dateTime', 'ASC']],
            limit: 5
        });

        // Format expiring requests for the frontend
        for (const request of expiringRequests) {
            const daysToExpire = Math.ceil((new Date(request.dateTime) - now) / (1000 * 60 * 60 * 24));
            let expiryText;

            if (daysToExpire <= 0) {
                expiryText = "today";
            } else if (daysToExpire === 1) {
                expiryText = "tomorrow";
            } else {
                expiryText = `in ${daysToExpire} days`;
            }

            updates.push({
                message: `Your request "${request.title}" expires ${expiryText}`,
                time: `Expires ${expiryText}`,
                icon: "alert-circle-outline",
                type: "expiring"
            });
        }

        // Sort updates by recency (most recent first)
        updates.sort((a, b) => {
            // Convert time strings to comparable values (rough approximation)
            const getTimeValue = (timeStr) => {
                if (timeStr.includes("hours")) return parseInt(timeStr) || 0;
                if (timeStr.includes("Yesterday")) return 24;
                if (timeStr.includes("days")) return parseInt(timeStr) * 24 || 48;
                return 0;
            };

            return getTimeValue(a.time) - getTimeValue(b.time);
        });

        return res.status(200).json({
            updates: updates.slice(0, 5) // Return at most 5 updates
        });

    } catch (error) {
        console.error("Error fetching recent updates:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
