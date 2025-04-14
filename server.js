const express = require('express');
const { port } = require('./src/config/appConfig');
const authRoutes = require('./src/routes/authRoutes');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Backend RuangIlmu API is running');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});