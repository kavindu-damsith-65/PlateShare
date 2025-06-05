const sequelize = require("../config/db");
const { SellerDetails, User, Restaurant, BuyerDetails, OrgDetails } = require("../models/AuthModel");
const { Op } = require("sequelize");

exports.getSellerDetails = async(req, res) => {
    try {
        const user_id  = req.params.id;
        if (!user_id) {
            return res.status(401).json({ message: "Please try login again" });
        }

        const seller = await SellerDetails.findOne({
            where: { user_id },
            attributes: ["email", "phone", "address", "createdAt"],
            include: [
                {
                    model: User,
                    attributes: ["name", "profile_picture"]
                },
                {
                    model: Restaurant,
                    attributes: ["name", "image", "description", "id"],
                    as: "restaurant"
                }
            ]
        });

        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        return res.status(200).json({ seller });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.getBuyerDetails = async(req, res) => {
    try {
        const user_id = req.params.id;
        if (!user_id) {
            return res.status(401).json({ message: "Please try login again" });
        }

        const buyer = await BuyerDetails.findOne({
            where: { user_id },
            attributes: ["email", "phone", "address", "location"],
            include: [
                {
                    model: User,
                    attributes: ["name", "profile_picture"]
                }
            ]
        });

        if (!buyer) {
            return res.status(404).json({ message: "Buyer not found" });
        }

        return res.status(200).json({ buyer });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.getOrgDetails = async(req, res) => {
    try {
        const user_id = req.params.id;
        if (!user_id) {
            return res.status(401).json({ message: "Please try login again" });
        }

        const organization = await OrgDetails.findOne({
            where: { user_id },
            attributes: ["email", "phone", "address", "location", "description", "additional_images"],
            include: [
                {
                    model: User,
                    attributes: ["name", "profile_picture"]
                }
            ]
        });

        if (!organization) {
            return res.status(404).json({ message: "Organization not found" });
        }

        return res.status(200).json({ organization });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
