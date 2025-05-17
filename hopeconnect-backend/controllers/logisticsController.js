import { getAllDonations,createLogisticsRequest,getAllMappingDonations,updateLogisticsStatus,deleteLogisticsRequest,deleteDonationById,getLogisticsTrackingInfo} from '../models/logisticsModels.js';


export const fetchAllDonations = async (req, res) => {
  try {
    const donations = await getAllDonations();
    res.status(200).json(donations);
  } catch (err) {
    console.error('Error fetching donations:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getTrackingInfo = async (req, res) => {
  const { id } = req.params;

  try {
    const trackingInfo = await getLogisticsTrackingInfo(id);
    res.status(200).json(trackingInfo);
  } catch (err) {
    console.error('Tracking error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

export const removeDonationById = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteDonationById(id);
    res.status(200).json({ message: 'Donation deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err.message);
    res.status(404).json({ error: err.message });
  }
};

export const createMappingDonation = async (req, res) => {
  const { donation_id, assigned_id } = req.body;
  if (!donation_id || !assigned_id) {
    return res.status(400).json({ error: 'donation_id and assigned_id are required' });
  }

  try {
    const requestId = await createLogisticsRequest({ donation_id, assigned_id });
    res.status(201).json({ message: 'Logistics request created', requestId });
  } catch (err) {
    console.error('Assignment failed:', err.message);
    res.status(500).json({ error: err.message });
  }
};

export const fetchAllMappingDonations = async (req, res) => {
  try {
    const donations = await getAllMappingDonations();
    res.status(200).json(donations);
  } catch (err) {
    console.error('Error fetching mapping donations:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateMappingDonation = async (req, res) => {
  const { id, status, current_location, signature } = req.body;
  const VALID_STATUSES = ['scheduled', 'in_transit', 'delivered', 'cancelled'];

  if (!id || !status || !current_location) {
    return res.status(400).json({ error: 'id, status, and current_location are required' });
  }

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  if (status === 'delivered' && !signature) {
    return res.status(400).json({ error: 'Signature is required when marking delivery as delivered.' });
  }

  try {
    await updateLogisticsStatus({ id, status, current_location, signature });
    res.status(200).json({ message: 'Delivery status updated successfully' });
  } catch (err) {
    console.error('Update failed:', err.message);
    res.status(500).json({ error: err.message });
  }
};

export const removeMappingDonation = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteLogisticsRequest(id);
    res.json({ message: 'Mapping deleted successfully' });
  } catch (err) {
    console.error('Delete failed:', err.message);
    res.status(500).json({ error: err.message });
  }
};


