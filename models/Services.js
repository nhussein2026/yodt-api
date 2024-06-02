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

module.exports = mongoose.model('Service', ServiceSchema);
