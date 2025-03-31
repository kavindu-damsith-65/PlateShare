const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {User,OrgDetails,BuyerDetails} = require("../models/AuthModel");
require("dotenv").config();



exports.signUp = async (req, res) => {
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



exports.signIn = async (req, res) => {
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
