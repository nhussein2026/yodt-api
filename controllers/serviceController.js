const Service = require('../models/Services');

// Get all services
const getServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get service by ID
const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.json(service);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Create a new service
const createService = async (req, res) => {
    const { title, description, photos, cost, requirements, conditions } = req.body;
    try {
        const newService = new Service({ title, description, photos, cost, requirements, conditions });
        await newService.save();
        res.status(201).json(newService);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update a service
const updateService = async (req, res) => {
    const { title, description, photos, cost, requirements, conditions } = req.body;
    try {
        const updatedService = await Service.findByIdAndUpdate(req.params.id, { title, description, photos, cost, requirements, conditions }, { new: true });
        if (!updatedService) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.json(updatedService);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a service
const deleteService = async (req, res) => {
    try {
        const deletedService = await Service.findByIdAndDelete(req.params.id);
        if (!deletedService) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.json({ message: 'Service deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = { getServices, getServiceById, createService, updateService, deleteService };
