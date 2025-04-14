const express = require('express');
const { PORT } = require('./constants');
const app = express();


// Import routes
const authRoutes = require('./routes/auth');

// Inisialisasi routes
app.use('/auth', authRoutes);

// Aplikasi start
const appStart = () => {
    try {
        app.listen(PORT, () => {
            console.log(`Aplikasi berjalan di http://localhost:${PORT}`);
        })
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
}

appStart();