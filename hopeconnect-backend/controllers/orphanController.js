const Orphan = require('../models/Orphan');
const Sponsorship = require('../models/Sponsorship');
const OrphanUpdate = require('../models/OrphanUpdate');

exports.getAllOrphans = async (req, res) => {
  try {
    const orphans = await Orphan.getAll();
    // Calculate age for each orphan
    const orphansWithAge = await Promise.all(orphans.map(async orphan => {
      const age = await Orphan.calculateAge(orphan.birth_date);
      return { ...orphan, age };
    }));
    res.json(orphansWithAge);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrphanById = async (req, res) => {
  try {
    const orphan = await Orphan.getById(req.params.id);
    if (!orphan) {
      return res.status(404).json({ message: 'Orphan not found' });
    }
    
    const age = await Orphan.calculateAge(orphan.birth_date);
    const updates = await Orphan.getUpdates(req.params.id);
    const sponsorships = await Orphan.getSponsorships(req.params.id);
    
    res.json({
      ...orphan,
      age,
      updates,
      sponsorships
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};