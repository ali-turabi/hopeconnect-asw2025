import db from '../config/dbConfig.js';


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
export async function deleteCampaignByTitle(title) {
    const [result] = await db.execute(
        'DELETE FROM emergencyCampaign WHERE title = ?',
        [title]
    );
    return result;
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
    const [userResult] = await db.execute(
      'SELECT user_id, user_type FROM users WHERE name = ?',
      [user_name]
    );

    if (userResult.length === 0) {
      throw new Error('User not found');
    }

    const user = userResult[0];

    if (user.user_type !== 'staff' && user.user_type !== 'volunteer'&& user.user_type!=='donor') {
      throw new Error('Only staff or volunteer users can join campaigns');
    }

    const user_id = user.user_id;

    const [campaignResult] = await db.execute(
      'SELECT id FROM emergencyCampaign WHERE title = ?',
      [campaign_title]
    );

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

export async function donateToCampaignByName(user_name, campaign_title, type, amount, quantity, description, pickup_address, delivery_address) {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Get user_id
        const [userRows] = await connection.execute(
            'SELECT user_id FROM users WHERE name = ?',
            [user_name]
        );
        if (userRows.length === 0) {
            throw new Error('User not found');
        }
        const user_id = userRows[0].user_id;

        // Get campaign_id
        const [campaignRows] = await connection.execute(
            'SELECT id FROM emergencyCampaign WHERE title = ?',
            [campaign_title]
        );
        if (campaignRows.length === 0) {
            throw new Error('Campaign not found');
        }
        const campaign_id = campaignRows[0].id;

        // Insert donation
        await connection.execute(
            `INSERT INTO donations 
                (user_id, category, type, status, amount, quantity, description, pickup_address, delivery_address)
             VALUES (?, 'emergency', ?, 'pending', ?, ?, ?, ?, ?)`,
            [user_id, type, amount || null, quantity || null, description, pickup_address, delivery_address]
        );

        // Update emergencyCampaign if it's a money donation
        if (type === 'money' && amount > 0) {
            await connection.execute(
                'UPDATE emergencyCampaign SET collectedAmount = collectedAmount + ? WHERE id = ?',
                [amount, campaign_id]
            );
        }

        await connection.commit();
        return { success: true };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

export async function getUsersWithEmergencyCampaigns() {
  const [rows] = await db.query(`
    SELECT 
      u.user_id, u.name AS user_name, u.user_type,
      ec.id AS campaign_id, ec.title AS campaign_title
    FROM users u
    INNER JOIN user_emergency_campaigns uec ON u.user_id = uec.user_id
    INNER JOIN emergencyCampaign ec ON uec.campaign_id = ec.id
    ORDER BY u.user_id
  `);

  return rows;
}
