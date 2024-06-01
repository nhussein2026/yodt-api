const User = require('../models/User');

// Confirm user registration
exports.confirmUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found.');
        }
        user.isConfirmed = true;
        await user.save();
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Change user role
exports.changeUserRole = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found.');
        }
        user.role = req.body.role;
        await user.save();
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};
