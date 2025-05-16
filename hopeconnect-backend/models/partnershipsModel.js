import db from '../db/db.js';

export async function getAllPartners() {
  const [rows] = await db.query('SELECT * FROM partners');
  
  if (!rows || rows.length === 0) {
    throw new Error('No partners found.');
  }

  return rows;
}

export async function getPartnerByName(name) {
  const [rows] = await db.query('SELECT * FROM partners WHERE name = ?', [name]);

  if (!rows || rows.length === 0) {
    throw new Error('Partner not found.');
  }

  return rows[0];
}

export async function insertPartner(partner) {
  const sql = `
    INSERT INTO partners (name, contact_info, partnership_type, status, description, activity)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [
    partner.name,
    partner.contact_info,
    partner.partnership_type,
    partner.status || 'active',
    partner.description,
    partner.activity
  ];
  const [result] = await db.query(sql, values);
  return result.insertId;
}

export async function updatePartnerByName(name, updates) {
  const fields = [];
  const values = [];

  if (updates.contact_info) {
    fields.push('contact_info = ?');
    values.push(updates.contact_info);
  }

  if (updates.description) {
    fields.push('description = ?');
    values.push(updates.description);
  }

  if (updates.activity) {
    fields.push('activity = ?');
    values.push(updates.activity);
  }

  if (fields.length === 0) {
    throw new Error('No valid fields provided for update.');
  }

  const sql = `UPDATE partners SET ${fields.join(', ')} WHERE name = ?`;
  values.push(name);

  const [result] = await db.query(sql, values);

  if (result.affectedRows === 0) {
    throw new Error('Partner not found.');
  }

  return result;
}

export async function deletePartnerByName(name) {
  const sql = 'DELETE FROM partners WHERE name = ?';
  const [result] = await db.query(sql, [name]);

  if (result.affectedRows === 0) {
    throw new Error('Partner not found.');
  }

  return result;
}

export async function getPartnersByStatus(status) {
  const sql = 'SELECT * FROM partners WHERE status = ?';
  const [rows] = await db.query(sql, [status]);

  if (!rows || rows.length === 0) {
    throw new Error('No partners found with this status.');
  }

  return rows;
}