const Expenditure = require('../models/Expenditure');
const db = require('../config/db');
const { validationResult } = require('express-validator');

exports.createExpenditure = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { orphanage_id, amount, category, description, receipt_url, date_spent } = req.body;
        const verified_by = req.user.user_id;

        // 1. تحقق من وجود الميزانية في orphanage
        const [rows] = await db.execute(
            'SELECT current_budget FROM orphanages WHERE orphanage_id = ?',
            [orphanage_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Orphanage not found' });
        }

        const currentBudget = parseFloat(rows[0].current_budget);

        // 2. تحقق من كفاية الميزانية
        if (currentBudget < amount) {
            return res.status(400).json({ error: 'Insufficient orphanage budget' });
        }

        // 3. تحديث الميزانية
        await db.execute(
            'UPDATE orphanages SET current_budget = current_budget - ? WHERE orphanage_id = ?',
            [amount, orphanage_id]
        );

        // 4. إدخال expenditure جديد
        const expenditureId = await Expenditure.create({
            orphanage_id,
            amount,
            category,
            description,
            receipt_url,
            date_spent,
            verified_by
        });

        res.status(201).json({
            success: true,
            data: { expenditureId },
            message: 'Expenditure created and orphanage budget updated'
        });

    } catch (err) {
        next(err);
    }
};

exports.getOrphanageExpenditures = async (req, res, next) => {
    try {
        const { id } = req.params;
        const expenditures = await Expenditure.findByOrphanage(id);

        res.status(200).json({
            success: true,
            data: expenditures
        });
    } catch (err) {
        next(err);
    }
};
