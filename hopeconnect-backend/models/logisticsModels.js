import db from '../db/db.js';
export async function getAllDonations() {
const [rows] = await db.query('SELECT * FROM donations');

    if (!rows) {
      return res.status(404).json({ message: 'No donations found.' });
    }  
return rows;
}
export const deleteDonationById = async (id) => {
  const [result] = await db.query(`DELETE FROM donations WHERE id = ?`, [id]);

  if (result.affectedRows === 0) {
    throw new Error('Donation not found or already deleted');
  }

  return result;
};

export const createLogisticsRequest = async ({ donation_id, assigned_id }) => {

  const [users] = await db.query(`
    SELECT user_type FROM users WHERE user_id = ? AND user_type IN ('staff', 'volunteer')
  `, [assigned_id]);

  if (users.length === 0) {
    throw new Error('Assigned user must be a volunteer or staff');
  }

  
  const [donations] = await db.query(`
    SELECT type FROM donations WHERE id = ?
  `, [donation_id]);

  if (donations.length === 0) {
    throw new Error('Donation not found');
  }

  if (donations[0].type !== 'physical') {
    throw new Error('Logistics can only be assigned for physical donations');
  }

  // ✅ Create logistics request
  const [result] = await db.query(`
    INSERT INTO logistics_requests (donation_id, assigned_to)
    VALUES (?, ?)
  `, [donation_id, assigned_id]);

  return result.insertId;
};

export async function getAllMappingDonations() {
const [rows] = await db.query('SELECT * FROM logistics_requests');

    if (!rows) {
      return res.status(404).json({ message: 'No mapping donations found.' });
    }  
return rows;
}

export const updateLogisticsStatus = async ({ id, status, current_location, signature }) => {
  let query = `
    UPDATE logistics_requests
    SET status = ?, current_location = ?, last_updated = NOW()
  `;
  const params = [status, current_location];

  if ((status === 'delivered' || status === 'completed') && signature) {
    query += `, signature = ?`;
    params.push(signature);
  }

  query += ` WHERE id = ?`;
  params.push(id);

  const [result] = await db.query(query, params);

  if (result.affectedRows === 0) {
    throw new Error('Logistics request not found');
  }

  return result;
};

export const deleteLogisticsRequest = async (id) => {
  const [result] = await db.query(`
    DELETE FROM logistics_requests WHERE id = ?
  `, [id]);
  
  if (result.affectedRows === 0) {
    throw new Error('No logistics mapping found with the provided ID');
  }
  return result;
};


export const getLogisticsTrackingInfo = async (logisticsId) => {
const [rows] = await db.query(`
    SELECT status, current_location, last_updated
    FROM logistics_requests
    WHERE id = ?
  `, [logisticsId]);

  if (rows.length === 0) {
    throw new Error('Logistics request not found');
  }

  return rows[0];

};