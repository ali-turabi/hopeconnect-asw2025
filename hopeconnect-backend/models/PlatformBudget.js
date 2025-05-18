const db = require('../config/db');

class PlatformBudget {
  static async getBudget() {
    try {
      const [rows] = await db.execute('SELECT budget FROM platform_settings WHERE id = 1');
      return rows[0].budget;
    } catch (error) {
      throw error;
    }
  }

  static async updateBudget(amount, operation = 'add') {
    try {
      const operator = operation === 'add' ? '+' : '-';
      const [result] = await db.execute(
        `UPDATE platform_settings SET budget = budget ${operator} ? WHERE id = 1`,
        [amount]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PlatformBudget;