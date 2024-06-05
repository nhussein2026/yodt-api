const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServiceSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    photos: {
        type: [String],
        required: false
    },
    cost: {
        type: Number,
        required: true
    },
    requirements: {
        type: [String],
        required: false
    },
    conditions: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});
const Service = mongoose.model('Service', ServiceSchema);

module.exports = Service;
