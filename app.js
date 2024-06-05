const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const postRoutes = require('./routes/postRoutes'); 
const serviceRoutes = require('./routes/serviceRoutes');
const volunteeringRoutes = require('./routes/volunteeringRoutes')
require('dotenv').config();
const cors = require('cors');


const app = express();

// Enable All CORS Requests
// Configure CORS
app.use(cors({
    origin: 'http://localhost:3001', // Allow requests from this origin
}));

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
app.use('/posts', postRoutes); 

// Service routes
app.use('/services', serviceRoutes);

// Volunteering routes
app.use('/volunteering', volunteeringRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
