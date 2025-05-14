const express = require("express");
const { getCompletedRequests } = require("../controllers/organisationHistoryController");

const router = express.Router();

// Get all completed food requests for an organization
router.get("/completed/:orgUserId", getCompletedRequests);

module.exports = router;