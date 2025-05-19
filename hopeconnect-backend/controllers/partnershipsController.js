const {
  getAllPartners,
  getPartnerByName,
  insertPartner,
  updatePartnerByName,
  deletePartnerByName,
  getPartnersByStatus
} = require('../models/partnershipsModel');

exports.fetchAllPartners = async (req, res) => {
  try {
    const partners = await getAllPartners();
    res.json(partners);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.fetchPartnerByName = async (req, res) => {
  try {
    const partner = await getPartnerByName(req.params.name);
    res.json(partner);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.createPartner = async (req, res) => {
  try {
    const id = await insertPartner(req.body);
    res.status(201).json({ message: 'Partner created successfully', id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.editPartnerByName = async (req, res) => {
  try {
    const success = await updatePartnerByName(req.params.name, req.body);
    if (!success) throw new Error('Partner not updated');
    res.json({ message: 'Partner updated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.removePartnerByName = async (req, res) => {
  try {
    const success = await deletePartnerByName(req.params.name);
    if (!success) throw new Error('Partner not deleted');
    res.json({ message: 'Partner deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.fetchPartnersByStatus = async (req, res) => {
  try {
    const partners = await getPartnersByStatus(req.params.status);
    res.json(partners);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
