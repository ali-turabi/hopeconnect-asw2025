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
exports.getOrphan = async (req, res) => {
    try {
        const orphanId = req.params.id;
        
        // Validate ID format (either numeric string or number)
        if (!/^\d+$/.test(orphanId)) {
            return res.status(400).json({ error: 'Invalid orphan ID format' });
        }

        const numericOrphanId = parseInt(orphanId, 10);
        const orphanageFilter = req.user.position === 'admin' ? null : req.user.orphanage_id;

        console.log(`🔍 Fetching orphan ${numericOrphanId} for ${req.user.position} ${req.user.id}`);
        
        const orphan = await orphanModel.getOrphanById(numericOrphanId, orphanageFilter);

        if (!orphan) {
            console.warn(`Orphan ${numericOrphanId} not found for requestor`);
            return res.status(404).json({ 
                error: 'Orphan not found',
                message: orphanageFilter 
                    ? 'Orphan not found in your orphanage' 
                    : 'Orphan does not exist',
                attemptedId: numericOrphanId,
                userOrphanage: orphanageFilter
            });
        }

        return res.status(200).json({
            success: true,
            data: orphan
        });

    } catch (err) {
        console.error('Error fetching orphan:', {
            error: err,
            params: req.params,
            user: req.user
        });
        return res.status(500).json({
            error: 'Failed to retrieve orphan',
            details: process.env.NODE_ENV === 'development' ? {
                message: err.message,
                stack: err.stack
            } : undefined
        });
    }
};
// Controller: Toggle Orphan Active Status
exports.toggleActiveStatus = async (req, res) => {
    try {
        const orphanId = parseInt(req.params.id);
        const { is_active } = req.body;

        if (isNaN(orphanId)) {
            return res.status(400).json({ error: 'Invalid orphan ID' });
        }

        if (typeof is_active !== 'boolean') {
            return res.status(400).json({ error: 'is_active must be boolean' });
        }

        const affectedRows = await orphanModel.toggleOrphanStatus(orphanId, is_active ? 1 : 0);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Orphan not found' });
        }

        return res.status(200).json({
            success: true,
            message: `Orphan ${is_active ? 'activated' : 'deactivated'} successfully`
        });

    } catch (err) {
        console.error('Toggle status error:', err);
        return res.status(500).json({
            error: 'Failed to update orphan status',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

// Controller: Delete Orphan
exports.deleteOrphan = async (req, res) => {
    try {
        const orphanId = parseInt(req.params.id);

        if (isNaN(orphanId)) {
            return res.status(400).json({ error: 'Invalid orphan ID' });
        }

        const affectedRows = await orphanModel.deleteOrphan(orphanId);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Orphan not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Orphan deleted successfully'
        });

    } catch (err) {
        console.error('Delete orphan error:', err);
        
        // Handle foreign key constraints
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                error: 'Cannot delete orphan',
                message: 'Orphan has related records in other tables'
            });
        }

        return res.status(500).json({
            error: 'Failed to delete orphan',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};
exports.updateOrphanAdmin = async (req, res) => {
    try {
        const orphanId = parseInt(req.params.id);
        if (isNaN(orphanId)) {
            return res.status(400).json({ error: 'Invalid orphan ID format' });
        }

        // Allowed fields for update
        const allowedFields = [
            'name',
            'birth_date',
            'gender',
            'health_condition',
            'education_level',
            'school_name',
            'photo_url',
            'is_active'
        ];

        // Filter out invalid fields
        const updateData = {};
        Object.keys(req.body).forEach(key => {
            if (allowedFields.includes(key)) {
                updateData[key] = req.body[key];
            }
        });

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ 
                error: 'No valid fields provided',
                allowedFields 
            });
        }

        const { affectedRows, changedFields } = 
            await orphanModel.updateOrphanAdmin(orphanId, updateData);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Orphan not found' });
        }

        res.json({
            success: true,
            message: 'Orphan updated successfully',
            updatedFields: changedFields,
            orphanId
        });

    } catch (err) {
        console.error('Admin update error:', err);
        res.status(500).json({
            error: 'Update failed',
            details: process.env.NODE_ENV === 'development' ? {
                message: err.message,
                sqlError: err.sqlMessage
            } : undefined
        });
    }
};
exports.getOrphan = async (req, res) => {
    try {
        // Debug: Log the incoming ID
        console.log('Received ID parameter:', req.params.id);
        
        // Validate ID exists
        if (!req.params.id) {
            return res.status(400).json({
                error: 'Missing orphan ID',
                message: 'Please provide an orphan ID in the URL'
            });
        }

        // Convert and validate ID
        const orphanId = parseInt(req.params.id, 10);
        if (isNaN(orphanId) || orphanId <= 0 || !Number.isInteger(orphanId)) {
            return res.status(400).json({
                error: 'Invalid orphan ID format',
                message: 'Orphan ID must be a positive whole number',
                received: req.params.id,
                expected: 'Example: 123'
            });
        }

        // Rest of your controller logic...
        const orphanageFilter = req.user.position === 'admin' ? null : req.user.orphanage_id;
        const orphan = await orphanModel.getOrphanById(orphanId, orphanageFilter);

        if (!orphan) {
            return res.status(404).json({ 
                error: 'Orphan not found',
                attemptedId: orphanId,
                existsInDatabase: await checkIfOrphanExists(orphanId) // Helper function
            });
        }

        res.json({ success: true, data: orphan });

    } catch (err) {
        console.error('Get orphan error:', {
            error: err,
            params: req.params,
            user: req.user
        });
        res.status(500).json({
            error: 'Server error during orphan lookup',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

// Helper function
async function checkIfOrphanExists(orphanId) {
    const [result] = await db.query(
        'SELECT 1 FROM orphans WHERE orphan_id = ? LIMIT 1', 
        [orphanId]
    );
    return result.length > 0;
}
// Add this new controller method
exports.getNonSponsoredOrphans = async (req, res) => {
    try {
        // Staff can only see orphans from their orphanage
        // Admins can see all orphans (no filter)
        const orphanageFilter = req.user && req.user.position === 'staff' ? req.user.orphanage_id : null;

        const orphans = await orphanModel.getNonSponsoredOrphans(orphanageFilter);

        return res.status(200).json({
            success: true,
            count: orphans.length,
            data: orphans
        });

    } catch (err) {
        console.error('Error fetching non-sponsored orphans:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve non-sponsored orphans',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};