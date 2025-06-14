const express = require("express");
const { 
    getIncompleteRequests,
    getAllRequests, 
    getRequestById, 
    markRequestCompleted,
    toggleRequestVisibility,
    createRequest,
    updateRequest,
    deleteRequest
} = require("../controllers/organisationRequestsController");

const router = express.Router();

// Get all incomplete food requests for an organization
router.get("/requests/incomplete/:orgUserId", getIncompleteRequests);

// Get all food requests for sellers
router.get("/requests", getAllRequests);

// Get a specific food request with donations
router.get("/requests/:requestId", getRequestById);

// Create a new food request
router.post("/requests", createRequest);

// Update an existing food request
router.put("/requests/:requestId", updateRequest);

// Delete a food request
router.delete("/requests/:requestId", deleteRequest);

// Mark a food request as completed
router.put("/requests/:requestId/complete", markRequestCompleted);

// Toggle visibility of a food request (public/private)
router.put("/requests/:requestId/toggle-visibility", toggleRequestVisibility);

module.exports = router;
