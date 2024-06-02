const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a new user
exports.registerUser = async (req, res) => {
    try {
        const { name, username, email, universityName, studentId, studyingYear, phoneNumber, membershipId, password } = req.body;
        const user = new User({ name, username, email, universityName, studentId, studyingYear, phoneNumber, membershipId, password });
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Login a user
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Invalid email or password.');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid email or password.');
        }

        if (!user.isConfirmed) {
            return res.status(403).send('Your registration is not confirmed yet, Will send you Confirmation through email.');
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.send({ token });
    } catch (error) {
        res.status(500).send('Internal server error.');
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
};


// Update volunteering hours for a user
exports.updateVolunteeringHours = async (req, res) => {
    const { userId, hours } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.volunteeringHours += hours;
        await user.save();

        res.json({ message: 'Volunteering hours updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


