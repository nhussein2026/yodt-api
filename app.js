const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const postRoutes = require('./routes/postRoutes'); // Import post routes
require('dotenv').config();

const app = express();

app.use(express.json());

// Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

// Basic route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// User routes
app.use('/users', userRoutes);

// Admin routes
app.use('/admin', adminRoutes);

// Post routes
app.use('/posts', postRoutes); // Use post routes

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
