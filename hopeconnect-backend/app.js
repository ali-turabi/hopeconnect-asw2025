const express = require('express');
const app = express();
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const orphanageRoutes = require('./routes/orphanageRoutes');
const orphanRoutes = require('./routes/orphanRoutes');
const bodyParser = require('body-parser');
const orphanUpdateRoutes = require('./routes/orphanUpdateRoutes');
const sponsorshipRoutes = require('./routes/sponsorshipRoutes');
const donationRoutes = require('./routes/donationRoutes');
const reportRoutes = require('./routes/reportRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const requestRoutes = require('./routes/requestRoutes')
const assignmentRoutes = require('./routes/assignmentRoutes');
const expenditureRoutes = require('./routes/expenditureRoutes');
const impactReportRoutes = require('./routes/impactReportRoutes');
const verificationRoutes = require('./routes/verificationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const reviewPlatformRoutes = require('./routes/reviewPlatformRoutes'); // Updated filename
const budgetRoutes = require('./routes/budgetRoutes');



app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/orphanages', orphanageRoutes);
app.use('/api/orphans', orphanRoutes);
app.use('/api/sponsorships', sponsorshipRoutes);
app.use('/api/orphan-updates', orphanUpdateRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api', reviewPlatformRoutes);
app.use('/api', budgetRoutes);

//mmmmmmmmmmmmmmmmmmmmmmmmmmm
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/expenditures', expenditureRoutes);
app.use('/api/reports', impactReportRoutes);
app.use('/api/verifications', verificationRoutes);
app.use('/api/reviews', reviewRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
