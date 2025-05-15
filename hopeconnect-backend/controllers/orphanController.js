const db = require('../config/db');

exports.addOrphan = async (req, res) => {
    console.log('🔵 [addOrphan] Request received:', req.body);
    
    try {
        // 1. Validate required fields based on your table schema
        const requiredFields = [
            'name',
            'birth_date',
            'gender',
            'admission_date'
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            console.error('🔴 Missing fields:', missingFields);
            return res.status(400).json({
                error: 'Missing required fields',
                missing: missingFields
            });
        }

        // 2. Prepare the complete insert data
        const insertData = {
            orphanage_id: req.user.orphanage_id,
            name: req.body.name,
            birth_date: req.body.birth_date,
            gender: req.body.gender,
            health_condition: req.body.health_condition || null,
            education_level: req.body.education_level || null,
            school_name: req.body.school_name || null,
            admission_date: req.body.admission_date,
            photo_url: req.body.photo_url || null,
            is_sponsored: req.body.is_sponsored || 0,
            is_active: req.body.is_active !== undefined ? req.body.is_active : 1
        };

        console.log('🟢 Prepared insert data:', insertData);

        // 3. Execute the insert query
        const [result] = await db.query(
            `INSERT INTO orphans SET ?`,
            [insertData]
        );

        console.log('✅ Insert successful. ID:', result.insertId);
        return res.status(201).json({
            success: true,
            orphanId: result.insertId,
            message: 'Orphan added successfully'
        });

    } catch (err) {
        console.error('🔴 Database Error:', {
            message: err.message,
            code: err.code,
            sql: err.sql,
            sqlMessage: err.sqlMessage
        });
        
        return res.status(500).json({
            error: 'Database operation failed',
            details: process.env.NODE_ENV === 'development' ? {
                sqlError: err.sqlMessage,
                attemptedQuery: err.sql
            } : undefined
        });
    }
};