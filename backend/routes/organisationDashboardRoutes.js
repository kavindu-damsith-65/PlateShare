const express = require("express");
const { getOrgDashboardStats } = require("../controllers/OrganisationDashboardController");

const router = express.Router();

// Get dashboard stats for an organization
router.get("/stats/:id", getOrgDashboardStats);

module.exports = router;