// hi there i am ali turabi 
// making another test for ensure 
// test 3 fdas 
// test 5


// it should be added in the master brachconst express = require('express');
const app = express();
const cors = require('cors');
const orphanRoutes = require('./routes/orphanRoutes');
const sponsorshipRoutes = require('./routes/sponsorshipRoutes');
const orphanUpdateRoutes = require('./routes/orphanUpdateRoutes');
const authRoutes = require('./routes/authRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/orphans', orphanRoutes);
app.use('/api/sponsorships', sponsorshipRoutes);
app.use('/api/orphan-updates', orphanUpdateRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});
// ... other imports

app.use('/api/auth', authRoutes);

module.exports = app;