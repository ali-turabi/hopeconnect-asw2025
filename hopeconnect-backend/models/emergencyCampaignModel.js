import db from '../db/db.js';


export async function getAllCampaigns() {
  const [rows] = await db.query('SELECT * FROM emergencyCampaign');
  return rows;
}

export async function getCampaignByTitle(title) {
    const [rows] = await db.execute('SELECT * FROM emergencyCampaign WHERE title = ?', [title]);
  return rows[0];
}
export async function getOrganizationId(id) {
    const [rows] = await db.execute('SELECT * FROM orphanages WHERE orphanage_id = ?', [id]);
    return rows[0];
}
export async function checkOrphanageExists(orphanageId) {
    const [rows] = await db.execute(
        'SELECT 1 FROM Orphanages WHERE orphanage_id = ?', 
        [orphanageId]
    );
    return rows.length > 0; 
}

export async function insertCampaign(orphanageId, title, description, type, goalAmount) {
    const [result] = await db.execute(
        `INSERT INTO emergencyCampaign 
            (orphanageId, title, description, type, goalAmount)
         VALUES (?, ?, ?, ?, ?)`,
        [
            orphanageId,
            title.trim(),
            description.trim(),
            type || null,
            goalAmount
        ]
    );
    return result;
}

export async function assignUserToCampaign(user_name, campaign_title) {
  try {

    const [userResult] = await db.execute('SELECT user_id FROM users WHERE name = ?', [user_name]);

    if (userResult.length === 0) {
      throw new Error('User not found');
    }
    const user_id = userResult[0].user_id;
    const [campaignResult] = await db.execute('SELECT id FROM emergencyCampaign WHERE title = ?', [campaign_title]);
    
    if (campaignResult.length === 0) {
      throw new Error('Campaign not found');
    }

    const campaign_id = campaignResult[0].id;

    const insertQuery = `
      INSERT INTO user_emergency_campaigns (user_id, campaign_id)
      VALUES (?, ?)
    `;
    
    const [insertResult] = await db.execute(insertQuery, [user_id, campaign_id]);
    return insertResult; 

  } catch (err) {
    console.error(err);
    throw err;  
  }
}
