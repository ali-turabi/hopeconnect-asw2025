import { getAllPartners,getPartnerByName,insertPartner,updatePartnerByName,deletePartnerByName,getPartnersByStatus} from '../models/partnershipsModel.js';

export const fetchAllPartners = async (req, res) => {
  try {
    const partners = await getAllPartners();
    res.json(partners);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const fetchPartnerByName = async (req, res) => {
  try {
    const partner = await getPartnerByName(req.params.name);
    res.json(partner);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const createPartner = async (req, res) => {
  try {
    const partner = await insertPartner(req.body);
    res.status(201).json({ message: 'Partner created', partner });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const editPartnerByName = async (req, res) => {
  try {
    const partnerName = req.params.name;
    const updates = req.body;

    await updatePartnerByName(partnerName, updates);
    res.json({ message: 'Partner updated successfully' });
  } catch (err) {
    const status = err.message.includes('not found') ? 404 : 400;
    res.status(status).json({ error: err.message });
  }
};

export const removePartnerByName = async (req, res) => {
  try {
    const name = req.params.name;
    await deletePartnerByName(name);
    res.json({ message: 'Partner deleted successfully' });
  } catch (err) {
    const status = err.message.includes('not found') ? 404 : 400;
    res.status(status).json({ error: err.message });
  }
};

export const fetchPartnersByStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const partners = await getPartnersByStatus(status);
    res.json(partners);
  } catch (err) {
    const statusCode = err.message.includes('No partners') ? 404 : 500;
    res.status(statusCode).json({ error: err.message });
  }
};