const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const orphanageRoutes = require('./routes/orphanageRoutes');
require('dotenv').config();

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/orphanages', orphanageRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
