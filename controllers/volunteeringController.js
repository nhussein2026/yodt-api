const Volunteering = require('../models/Volunteering');

// Get all volunteering opportunities
const getVolunteerings = async (req, res) => {
    try {
        const volunteerings = await Volunteering.find();
        res.json(volunteerings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get volunteering opportunity by ID
const getVolunteeringById = async (req, res) => {
    try {
        const volunteering = await Volunteering.findById(req.params.id);
        if (!volunteering) {
            return res.status(404).json({ message: 'Volunteering opportunity not found' });
        }
        res.json(volunteering);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Create a new volunteering opportunity
const createVolunteering = async (req, res) => {
    const { title, description, location, date, time, requirements, contactInformation } = req.body;
    try {
        const newVolunteering = new Volunteering({ title, description, location, date, time, requirements, contactInformation });
        await newVolunteering.save();
        res.status(201).json(newVolunteering);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update a volunteering opportunity
const updateVolunteering = async (req, res) => {
    const { title, description, location, date, time, requirements, contactInformation } = req.body;
    try {
        const updatedVolunteering = await Volunteering.findByIdAndUpdate(req.params.id, { title, description, location, date, time, requirements, contactInformation }, { new: true });
        if (!updatedVolunteering) {
            return res.status(404).json({ message: 'Volunteering opportunity not found' });
        }
        res.json(updatedVolunteering);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a volunteering opportunity
const deleteVolunteering = async (req, res) => {
    try {
        const deletedVolunteering = await Volunteering.findByIdAndDelete(req.params.id);
        if (!deletedVolunteering) {
            return res.status(404).json({ message: 'Volunteering opportunity not found' });
        }
        res.json({ message: 'Volunteering opportunity deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = { getVolunteerings, getVolunteeringById, createVolunteering, updateVolunteering, deleteVolunteering };
