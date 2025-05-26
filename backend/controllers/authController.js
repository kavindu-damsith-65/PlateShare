const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {User,OrgDetails,BuyerDetails, SellerDetails} = require("../models/AuthModel");
require("dotenv").config();
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const {sendVerificationEmail} = require("../middleware/mail");
const sequelize = require("../config/db");




function generateVerificationCode() {
    return crypto.randomInt(100000, 999999).toString();
}


const generateTokens = (userId, role) => {
    const accessToken = jwt.sign(
        { id: userId, role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { id: userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};



const verificationCodes = new Map();

const sendCode = async (req, res) => {
    const { email } = req.body;
    // Validate email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    try {
        // Check if user already exists (consistent with your signIn structure)
        const user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Generate verification code
        const code = generateVerificationCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now


        verificationCodes.set(email, { code, expiresAt });

        // Send verification email
        const emailSent = await sendVerificationEmail(email, code);
        if (!emailSent) {
            return res.status(500).json({ error: 'Failed to send verification email' });
        }

        res.json({ message: 'Verification code sent successfully' });
    } catch (error) {
        console.error('Error sending verification code:',error);
        res.status(500).json({ error: 'Failed to send verification code' });
    }
};




async function verifyCode(req, res) {
    const { email, code } = req.body;

    try {


        const verification = verificationCodes.get(email);

        if (!verification) {
            return res.status(400).json({ error: 'No verification code found for this email' });
        }

        // Check if code matches
        if (verification.code !== code) {
            return res.status(400).json({ error: 'Invalid verification code' });
        }

        // Check if code is expired
        if (new Date() > new Date(verification.expiresAt)) {
            return res.status(400).json({ error: 'Verification code has expired' });
        }


        verificationCodes.delete(email);

        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Error verifying code:');
        res.status(500).json({ error: 'Failed to verify code' });
    }
}




const signUp = async (req, res) => {
    const data = req.body;

    // Required fields validation
    const requiredFields = {
        all: ['email', 'password', 'confirmPassword', 'name', 'role', 'phone', 'address', 'location'],
        org: ['description', 'orgImage1', 'orgImage2', 'orgImage3']
    };

    try {
        // Validate common fields
        for (const field of requiredFields.all) {
            if (!data[field]) throw new Error(`${field} is required`);
        }

        // Role-specific validation
        if (data.role === 'org') {
            for (const field of requiredFields.org) {
                if (!data[field]) throw new Error(`${field} is required for organizations`);
            }
        }

        // Password validation
        if (data.password !== data.confirmPassword) throw new Error('Passwords do not match');
        if (data.password.length < 8) throw new Error('Password must be at least 8 characters');

        // Check existing user
        const existingUser = await User.findOne({ where: { email: data.email } });
        if (existingUser) throw new Error('Email already registered');

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 12);
        const userId = uuidv4();

        // Start transaction
        const transaction = await sequelize.transaction();

        try {
            // Create user

            // const user = await User.create({
            //     id: userId,
            //     email: data.email,
            //     name: data.name,
            //     role: data.role,
            //     profile_picture: data.profileImage,
            //     password: hashedPassword
            // }, { transaction });
            //
            // // Create role-specific details
            // const detailsData = {
            //     user_id: userId,
            //     phone: data.phone,
            //     address: data.address,
            //     location: JSON.stringify(data.location)
            // };
            //
            // switch (data.role.toLowerCase()) {
            //     case 'buyer':
            //         await BuyerDetails.create(detailsData, { transaction });
            //         break;
            //     case 'seller':
            //         await SellerDetails.create({ ...detailsData, createdAt: new Date() }, { transaction });
            //         break;
            //     case 'org':
            //         await OrgDetails.create({
            //             ...detailsData,
            //             description: data.description,
            //             additional_images: JSON.stringify([data.orgImage1, data.orgImage2, data.orgImage3])
            //         }, { transaction });
            //         break;
            //     default:
            //         throw new Error('Invalid user role');
            // }
            //
            // await transaction.commit();

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
            });

        } catch (error) {
            await transaction.rollback();
            throw error;
        }

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};



const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate input
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error('Email not found!');
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user.id, user.role);

        // Return user data and tokens
        res.json({
            success: true,
            user: {
                role: user.role,
            },
            tokens: {
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
};



module.exports = {
    sendCode,
    verifyCode,
    signUp,
    signIn
};
