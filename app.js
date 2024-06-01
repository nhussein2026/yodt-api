const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/config');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const { mockAuth } = require('./middleware/auth');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(mockAuth); // Apply mock authentication for all routes

// MongoDB connection
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// User routes
app.use('/users', userRoutes);

// Admin routes
app.use('/admin', adminRoutes);

module.exports = app;
