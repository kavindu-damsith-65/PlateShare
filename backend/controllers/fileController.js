const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {BuyerDetails,OrgDetails} = require("../models/AuthModel");
require("dotenv").config();

exports.profilePictureUpload = async (req, res) => {
    try {
        const filePath = req.file.path;
        if (req.user.role === 'buyer') {
            await BuyerDetails.update({ profile_picture: filePath }, { where: { user_id: req.user.id } });
        } else if (req.user.role === 'org') {
            await OrgDetails.update({ profile_picture: filePath }, { where: { user_id: req.user.id } });
        }
        res.json({ message: 'Image uploaded successfully', filePath });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};

exports.imageUpload = async (req, res) => {
    try {
        const filePath = req.file.path;
        res.json({ message: 'Image uploaded successfully', filePath });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};

