const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const orphanRoutes = require('./routes/orphanRoutes');
require('dotenv').config();
const db = require('./config/db');

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/orphans', orphanRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
