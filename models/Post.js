const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    photos: {
        type: [String], // Array of strings to store URLs or paths to photos
        required: false
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['news', 'activity', 'post', 'discounts', 'visits', 'service'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
