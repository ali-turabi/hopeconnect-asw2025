import db from '../db/db.js'; // adjust path if needed


export async function getAllCampaigns() {
  const [rows] = await db.query('SELECT * FROM emergencyCampaigns');
  return rows;
}

export async function getCampaignById(id) {
    const [rows] = await db.execute('SELECT * FROM emergencyCampaigns WHERE id = ?', [id]);
  return rows[0];
}
export async function getOrganizationId(id) {
    const [rows] = await db.execute('SELECT * FROM orphanages WHERE orphanage_id = ?', [id]);
    return rows[0];
}

export async function insertCampaign(title, description, goal_amount, start_date, end_date, organization_id) {
    const [result] = await db.execute(
      `INSERT INTO emergencyCampaigns 
        (title, description, goalAmount, startDate, endDate, status, orphanagesId)
       VALUES (?, ?, ?, ?, ?, 'active', ?)`,
      [title.trim(), description.trim(), goal_amount, start_date, end_date, organization_id]
    );
    return result; 
  }

