const orphanModel = require('../models/orphanModel');

// Utility: Validate required fields
const validateFields = (body, fields) => {
    return fields.filter(field => !body[field]);
};

// Controller: Add Orphan
exports.addOrphan = async (req, res) => {
    console.log('🔵 [addOrphan] Request received:', req.body);

    try {
        // Step 1: Required fields
        const requiredFields = ['name', 'birth_date', 'gender', 'admission_date'];
        const missingFields = validateFields(req.body, requiredFields);

        if (missingFields.length > 0) {
            console.error('🔴 Missing fields:', missingFields);
            return res.status(400).json({
                error: 'Missing required fields',
                missing: missingFields
            });
        }

        // Step 2: Prepare insert data
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

        // Step 3: Insert using the model
        const orphanId = await orphanModel.insertOrphan(insertData);

        console.log('✅ Insert successful. ID:', orphanId);
        return res.status(201).json({
            success: true,
            orphanId,
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
// Controller: Get All Orphans
exports.getAllOrphans = async (req, res) => {
    console.log('🔵 [getAllOrphans] Request received');

    try {
        // Staff can only see orphans from their orphanage
        // Admins can see all orphans (no filter)
        const orphanageFilter = req.user.position === 'staff' ? req.user.orphanage_id : null;

        const orphans = await orphanModel.getAllOrphans(orphanageFilter);

        console.log(`✅ Retrieved ${orphans.length} orphans`);
        return res.status(200).json({
            success: true,
            count: orphans.length,
            data: orphans
        });

    } catch (err) {
        console.error('🔴 Database Error:', {
            message: err.message,
            code: err.code,
            sql: err.sql,
            sqlMessage: err.sqlMessage
        });

        return res.status(500).json({
            error: 'Failed to retrieve orphans',
            details: process.env.NODE_ENV === 'development' ? {
                sqlError: err.sqlMessage,
                attemptedQuery: err.sql
            } : undefined
        });
    }
};