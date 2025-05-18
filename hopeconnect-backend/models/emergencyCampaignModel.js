import db from '../config/dbConfig.js';
import { sendEmail } from '../utils/emailServices.js'; 
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

export async function getEmergencyCampaignById(id) {
  const [rows] = await db.execute('SELECT * FROM emergencyCampaign WHERE id = ?', [id]);
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
    `INSERT INTO emergencyCampaign (orphanageId, title, description, type, goalAmount, collectedAmount, isActive)
     VALUES (?, ?, ?, ?, ?, 0, 1)`,
    [orphanageId, title, description, type, goalAmount]
  );
  return result;
}

export const getUsersToNotify = async () => {
  const [users] = await db.execute(
    `SELECT email FROM users 
     WHERE user_type IN ('volunteer', 'staff', 'donor')`,
  );
  return users;
};

export const createCampaign = async (req, res) => {
  try {
    const { orphanageId, title, description, type, goalAmount } = req.body;

    const missingFields = [];
    if (!orphanageId) missingFields.push('orphanageId');
    if (!title) missingFields.push('title');
    if (!description) missingFields.push('description');
    if (!goalAmount) missingFields.push('goalAmount');

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    if (isNaN(goalAmount) || Number(goalAmount) <= 0) {
      return res.status(400).json({ message: 'goalAmount must be a positive number' });
    }

    if (!Number.isInteger(Number(orphanageId))) {
      return res.status(400).json({ message: 'orphanageId must be an integer' });
    }

    const orphanageExists = await checkOrphanageExists(orphanageId);
    if (!orphanageExists) {
      return res.status(404).json({ message: 'Orphanage not found' });
    }

    const result = await insertCampaign(orphanageId, title, description, type, goalAmount);

    const newCampaign = {
      id: result.insertId,
      orphanageId,
      title: title.trim(),
      description: description.trim(),
      type: type || null,
      goalAmount,
      collectedAmount: 0.00,
      isActive: true
    };


    const usersToNotify = await getUsersToNotify();
    const subject = `🚨 New Emergency Campaign: ${title}`;
    const htmlContent = `
      <h2>${orphanageExists.name}</h2>
      <p>${description}</p>
      <p><strong>Goal:</strong> $${goalAmount}</p>
      <p>Please support or share this campaign ❤️</p>
    `;

    for (const user of usersToNotify) {
      await sendEmail(user.email, subject, htmlContent, `${title}: ${description}`);
    }

    res.status(201).json({
      message: 'Emergency campaign created successfully and notifications sent',
      campaign: newCampaign
    });

  } catch (err) {
    res.status(500).json({ message: 'Failed to create emergency campaign', error: err.message });
  }
};

export async function assignUserToCampaign(user_name, campaign_title) {
  try {
    const [userResult] = await db.execute(
      'SELECT user_id, user_type, email FROM users WHERE name = ?',
      [user_name]
    );

    if (userResult.length === 0) {
      throw new Error('User not found');
    }

    const user = userResult[0];

    if (!['staff', 'volunteer', 'donor'].includes(user.user_type)) {
      throw new Error('Only staff, volunteer, or donor users can join campaigns');
    }

    const user_id = user.user_id;

    const [campaignResult] = await db.execute(
      'SELECT id, title, description FROM emergencyCampaign WHERE title = ?',
      [campaign_title]
    );

    if (campaignResult.length === 0) {
      throw new Error('Campaign not found');
    }

    const campaign = campaignResult[0];

    const insertQuery = `
      INSERT INTO user_emergency_campaigns (user_id, campaign_id)
      VALUES (?, ?)
    `;

    const [insertResult] = await db.execute(insertQuery, [user_id, campaign.id]);

    // ✅ Send thank-you email after joining
    const subject = `Thank you for joining the "${campaign.title}" campaign`;
    const htmlContent = `
      <h3>Hi ${user_name},</h3>
      <p>Thank you for joining our emergency campaign: <strong>${campaign.title}</strong>.</p>
      <p>${campaign.description}</p>
      <p>Your support means a lot to us and the people we serve.</p>
      <p>With gratitude,<br/>HopeConnect Team</p>
    `;

    await sendEmail(user.email, subject, htmlContent, `Thank you for joining the "${campaign.title}" campaign.`);

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

    const [userRows] = await connection.execute(
      'SELECT user_id, email FROM users WHERE name = ?',
      [user_name]
    );
    if (userRows.length === 0) {
      throw new Error('User not found');
    }
    const user = userRows[0];

    const [campaignRows] = await connection.execute(
      'SELECT id FROM emergencyCampaign WHERE title = ?',
      [campaign_title]
    );
    if (campaignRows.length === 0) {
      throw new Error('Campaign not found');
    }
    const campaign_id = campaignRows[0].id;

    await connection.execute(
      `INSERT INTO donations 
          (user_id, category, type, status, amount, quantity, description, pickup_address, delivery_address)
       VALUES (?, 'emergency', ?, 'pending', ?, ?, ?, ?, ?)`,
      [
        user.user_id,
        type,
        amount || null,
        quantity || null,
        description,
        pickup_address,
        delivery_address
      ]
    );

    if (type === 'money' && amount > 0) {
      await connection.execute(
        'UPDATE emergencyCampaign SET collectedAmount = collectedAmount + ? WHERE id = ?',
        [amount, campaign_id]
      );
    }

    await connection.commit();

    const subject = `🙏 Thank you for your ${type === 'money' ? 'monetary' : 'physical'} donation to "${campaign_title}"`;
    const htmlContent = `
      <h3>Dear ${user_name},</h3>
      <p>Thank you for supporting the <strong>${campaign_title}</strong> campaign.</p>
      <p>Your ${type === 'money' ? `donation of <strong>$${amount}</strong>` : `donation of <strong>${quantity}</strong> items`} means a lot to us.</p>
      ${description ? `<p><em>${description}</em></p>` : ''}
      <p>Together, we can make a difference. ❤️</p>
      <p>With appreciation,<br/>HopeConnect Team</p>
    `;

    await sendEmail(user.email, subject, htmlContent, `Thank you for donating to "${campaign_title}".`);

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

export async function getActiveCampaigns() {
  const [rows] = await db.query('SELECT * FROM emergencyCampaign WHERE isActive = 1');
  return rows;
}

export async function updateEmergencyCampaign(campaignId, updatedData) {
  try {
    const existing = await getEmergencyCampaignById(campaignId);
    if (!existing) {
      const error = new Error(`Campaign with ID ${campaignId} not found.`);
      error.status = 404;
      throw error;
    }

    const allowedFields = [
      'orphanageId', 'title', 'description', 'type',
      'goalAmount', 'collectedAmount', 'isActive'
    ];

    const fields = [];
    const values = [];

    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(updatedData, key)) {
        fields.push(`${key} = ?`);
        values.push(updatedData[key]);
      }
    }

    if (fields.length === 0) {
      const error = new Error('No valid fields provided for update.');
      error.status = 400;
      throw error;
    }

    fields.push(`updatedAt = CURRENT_TIMESTAMP`);

    const sql = `
      UPDATE emergencyCampaign
      SET ${fields.join(', ')}
      WHERE id = ?
    `;

    values.push(campaignId);

    await db.execute(sql, values);

    const updatedCampaign = await getEmergencyCampaignById(campaignId);

    return updatedCampaign;
  } catch (err) {
    console.error('Model Error - updateEmergencyCampaign:', err.message);
    if (!err.status) err.status = 500;
    throw err;
  }
}