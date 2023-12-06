const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

// Create an Express app
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.set("strictQuery", true);
mongoose.connect("mongodb+srv://test:12345@cluster0.jcexqzk.mongodb.net/Project1");
var db = mongoose.connection;
db.on("open", () => console.log("Connected to DB"));
db.on("error", () => console.log("An error has occurred"));

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/cart', cartRoutes);
app.use('/expenses', expenseRoutes);

// Example root endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});

// Start server
const PORT = process.env.PORT || 4000;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}/`);
});
