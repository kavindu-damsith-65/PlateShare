const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {User,OrgDetails,BuyerDetails} = require("../models/AuthModel");
require("dotenv").config();


const crypto = require('crypto');
const {sendVerificationEmail} = require("../middleware/mail");





function generateVerificationCode() {
    return crypto.randomInt(100000, 999999).toString();
}



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
    try {
        const { id, role, password, name, email, phone, address, location, description } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ id, role, verified: role === 'buyer' ? 1 : 0, password: hashedPassword });

        const profile_picture = req.file ? req.file.path : null;
        if (role === 'buyer') {
            await BuyerDetails.create({ user_id: id, name, email, phone, address, location, profile_picture });
        } else if (role === 'org') {
            await OrgDetails.create({ user_id: id, name, email, phone, address, location, profile_picture, description });
        }
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const signIn = async (req, res) => {
    try {
        const { id, password } = req.body;
        const user = await User.findByPk(id);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, role: user.role, verified: user.verified }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = {
    sendCode,
    verifyCode,
    signUp,
    signIn
};
