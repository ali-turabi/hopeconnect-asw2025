const db = require('../config/db');

async function getAllPartners() {
  const [rows] = await db.query('SELECT * FROM partners');
  if (!rows || rows.length === 0) throw new Error('No partners found.');
  return rows;
}

async function getPartnerByName(name) {
  const [rows] = await db.query('SELECT * FROM partners WHERE name = ?', [name]);
  if (!rows || rows.length === 0) throw new Error('Partner not found.');
  return rows[0];
}

async function insertPartner(partner) {
  const { name, status } = partner;
  const [result] = await db.query('INSERT INTO partners (name, status) VALUES (?, ?)', [name, status]);
  return result.insertId;
}

async function updatePartnerByName(name, data) {
  const { status } = data;
  const [result] = await db.query('UPDATE partners SET status = ? WHERE name = ?', [status, name]);
  return result.affectedRows > 0;
}

async function deletePartnerByName(name) {
  const [result] = await db.query('DELETE FROM partners WHERE name = ?', [name]);
  return result.affectedRows > 0;
}

async function getPartnersByStatus(status) {
  const [rows] = await db.query('SELECT * FROM partners WHERE status = ?', [status]);
  return rows;
}

module.exports = {
  getAllPartners,
  getPartnerByName,
  insertPartner,
  updatePartnerByName,
  deletePartnerByName,
  getPartnersByStatus
};
