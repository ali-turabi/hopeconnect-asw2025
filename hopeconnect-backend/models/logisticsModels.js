import db from '../config/dbConfig.js';
import { sendEmail } from '../utils/emailServices.js'; 

export async function getAllDonations() {
const [rows] = await db.query('SELECT * FROM donations');

    if (!rows) {
      return res.status(404).json({ message: 'No donations found.' });
    }  
return rows;
}

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

export const deleteDonationById = async (id) => {
  const [result] = await db.query(`DELETE FROM donations WHERE id = ?`, [id]);

  if (result.affectedRows === 0) {
    throw new Error('Donation not found or already deleted');
  }

  return result;
};

export const createLogisticsRequest = async ({ donation_id, assigned_id }) => {
  const [users] = await db.query(`
    SELECT name, email, user_type FROM users
    WHERE user_id = ? AND user_type IN ('staff', 'volunteer')
  `, [assigned_id]);

  if (users.length === 0) {
    throw new Error('Assigned user must be a volunteer or staff');
  }

  const assignedUser = users[0];

  const [donations] = await db.query(`
    SELECT id, type, quantity, description, pickup_address, pickup_time, delivery_address
    FROM donations
    WHERE id = ?
  `, [donation_id]);

  if (donations.length === 0) {
    throw new Error('Donation not found');
  }

  const donation = donations[0];

  if (donation.type !== 'physical') {
    throw new Error('Logistics can only be assigned for physical donations');
  }

  const [result] = await db.query(`
    INSERT INTO logistics_requests (donation_id, assigned_to)
    VALUES (?, ?)
  `, [donation_id, assigned_id]);

  const subject = `You’ve been assigned a pickup for donation #${donation.id}`;
  const htmlContent = `
    <h3>Hello ${assignedUser.name},</h3>
    <p>You have been assigned a new logistics task.</p>
    <ul>
      <li><strong>Donation ID:</strong> ${donation.id}</li>
      <li><strong>Quantity:</strong> ${donation.quantity} items</li>
      <li><strong>Pickup Address:</strong> ${donation.pickup_address}</li>
      <li><strong>Pickup Time:</strong> ${donation.pickup_time}</li>
      <li><strong>Delivery Address:</strong> ${donation.delivery_address}</li>
    </ul>
    ${donation.description ? `<p><em>${donation.description}</em></p>` : ''}
    <p>Please check your dashboard for more details.</p>
    <p>Thank you for supporting HopeConnect</p>
  `;
  const textContent = `You've been assigned a donation pickup for donation ID #${donation.id} at ${donation.pickup_address} on ${donation.pickup_time}.`;

  try {
    await sendEmail(assignedUser.email, subject, htmlContent, textContent);
    console.log(`Email sent to ${assignedUser.email} for donation #${donation.id}`);
  } catch (emailErr) {
    console.error(`Failed to send email to ${assignedUser.email}:`, emailErr.message);
  }

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


