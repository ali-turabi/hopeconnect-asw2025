const OrphanUpdate = require('../models/OrphanUpdate');

exports.createUpdate = async (req, res) => {
  try {
    // In a real app, you'd want to validate the input data first
    // Also, you'd probably get created_by from the authenticated staff user
    const updateId = await OrphanUpdate.create(req.body);
    res.status(201).json({ 
      message: 'Update created successfully',
      updateId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating update' });
  }
};

exports.getOrphanUpdates = async (req, res) => {
  try {
    const updates = await OrphanUpdate.getByOrphan(req.params.orphanId);
    res.json(updates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching updates' });
  }
};