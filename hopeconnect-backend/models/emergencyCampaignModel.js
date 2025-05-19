const db = require('../config/db');

async function getAllEmergencyCampaigns() {
  const [rows] = await db.query('SELECT * FROM emergency_campaigns ORDER BY createdAt DESC');
  return rows;
}

async function getEmergencyCampaignById(id) {
  const [rows] = await db.execute('SELECT * FROM emergency_campaigns WHERE id = ?', [id]);
  return rows[0];
}

async function createEmergencyCampaign({ orphanage_id, title, description, type, goal_amount, deadline }) {
  const [result] = await db.execute(
    `INSERT INTO emergency_campaigns 
    (orphanage_id, title, description, type, goal_amount, deadline, collected_amount, is_active, created_at) 
    VALUES (?, ?, ?, ?, ?, ?, 0, 1, CURRENT_TIMESTAMP)`,
    [orphanage_id, title, description, type, goal_amount, deadline]
  );
  return result;
}

async function deleteEmergencyCampaignById(id) {
  const [result] = await db.execute('DELETE FROM emergency_campaigns WHERE id = ?', [id]);
  return result;
}

async function checkUserExistsByName(user_name) {
  const [rows] = await db.execute('SELECT user_id, user_type, email FROM users WHERE name = ?', [user_name]);
  return rows[0] || null;
}

async function checkCampaignExistsById(id) {
  const [rows] = await db.execute('SELECT id, title, description FROM emergency_campaigns WHERE id = ?', [id]);
  return rows[0] || null;
}

async function joinEmergencyCampaign(user_id, campaign_id) {
  return db.execute(
    'INSERT INTO user_emergency_campaigns (user_id, campaign_id) VALUES (?, ?)',
    [user_id, campaign_id]
  );
}

async function donateToCampaign(campaign_id, { donor_id, amount, method, quantity, description, pickup_address, delivery_address }) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Insert donation record
    await conn.execute(
      `INSERT INTO donations (campaign_id, donor_id, amount, method, quantity, description, pickup_address, delivery_address, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [campaign_id, donor_id, amount, method, quantity, description, pickup_address, delivery_address]
    );

    if (method === 'money' && amount > 0) {
      await conn.execute(
        'UPDATE emergency_campaigns SET collected_amount = collected_amount + ? WHERE id = ?',
        [amount, campaign_id]
      );
    }

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

async function getUsersWithCampaigns() {
  const [rows] = await db.query(`
    SELECT u.user_id, u.name AS user_name, u.user_type,
           ec.id AS campaign_id, ec.title AS campaign_title
    FROM users u
    JOIN user_emergency_campaigns uec ON u.user_id = uec.user_id
    JOIN emergency_campaigns ec ON uec.campaign_id = ec.id
    ORDER BY u.user_id
  `);
  return rows;
}

async function getActiveEmergencyCampaigns() {
  const [rows] = await db.query('SELECT * FROM emergency_campaigns WHERE is_active = 1');
  return rows;
}

async function updateEmergencyCampaign(id, data) {
  const allowedFields = ['orphanage_id', 'title', 'description', 'type', 'goal_amount', 'collected_amount', 'is_active', 'deadline'];
  const fields = [];
  const values = [];

  for (const field of allowedFields) {
    if (field in data) {
      fields.push(`${field} = ?`);
      values.push(data[field]);
    }
  }

  if (fields.length === 0) throw new Error('No valid fields to update');

  values.push(id);

  const sql = `UPDATE emergency_campaigns SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

  const [result] = await db.execute(sql, values);
  return result;
}

module.exports = {
  getAllEmergencyCampaigns,
  getEmergencyCampaignById,
  createEmergencyCampaign,
  deleteEmergencyCampaignById,
  checkUserExistsByName,
  checkCampaignExistsById,
  joinEmergencyCampaign,
  donateToCampaign,
  getUsersWithCampaigns,
  getActiveEmergencyCampaigns,
  updateEmergencyCampaign,
};
