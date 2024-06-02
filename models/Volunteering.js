const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VolunteeringSchema = new Schema({
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
    location: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    time: { //total hours for the task
        type: String,
        required: true
    },
    requirements: {
        type: [String],
        required: false
    },
    contactInformation: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Volunteering', VolunteeringSchema);
