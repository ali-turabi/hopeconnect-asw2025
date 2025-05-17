const express = require('express');
const app = express();
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const orphanageRoutes = require('./routes/orphanageRoutes');
const orphanRoutes = require('./routes/orphanRoutes');
const bodyParser = require('body-parser');
const sponsorshipRoutes = require('./routes/sponsorshipRoutes');

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/orphanages', orphanageRoutes);
app.use('/api/orphans', orphanRoutes);
app.use('/api/sponsorships', sponsorshipRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
