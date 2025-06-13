const express = require("express");
const {
    getOrgDashboardStats,
    getWeeklyActivity,
    getRequestStatus,
    getRecentUpdates
} = require("../controllers/OrganisationDashboardController");

const router = express.Router();

// Get dashboard stats for an organization
router.get("/stats/:id", getOrgDashboardStats);

// Get weekly request activity data
router.get("/weekly-activity/:id", getWeeklyActivity);

// Get request status for the current month
router.get("/request-status/:id", getRequestStatus);

// Get recent updates (donations and expiring requests)
router.get("/recent-updates/:id", getRecentUpdates);

module.exports = router;