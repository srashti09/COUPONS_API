const express = require('express');
const connectDB = require('./config/db'); // Importing the db connection function
const bodyParser = require('body-parser');
const couponRoutes = require('./routes/couponRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
connectDB(); // Call the function that connects to MongoDB

// Routes
app.use('/coupons', couponRoutes);

// Starting the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
