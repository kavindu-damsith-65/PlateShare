const express = require("express");
const { 
    getIncompleteRequests, 
    getRequestById, 
    markRequestCompleted,
    toggleRequestVisibility
} = require("../controllers/organisationController");

const router = express.Router();

// Get all incomplete food requests for an organization
router.get("/requests/incomplete/:orgUserId", getIncompleteRequests);

// Get a specific food request with donations
router.get("/requests/:requestId", getRequestById);

// Mark a food request as completed
router.put("/requests/:requestId/complete", markRequestCompleted);

// Toggle visibility of a food request (public/private)
router.put("/requests/:requestId/toggle-visibility", toggleRequestVisibility);

module.exports = router;
