const Orphan = require('../models/orphanModel');

class OrphanController {
    // Create new orphan (staff only)
    static async create(req, res) {
        try {
            const orphanageId = req.user.orphanage_id;
            
            if (!orphanageId) {
                return res.status(403).json({
                    success: false,
                    message: 'Staff member must be assigned to an orphanage'
                });
            }

            const orphanData = {
                ...req.body,
                orphanage_id: orphanageId
            };

            const orphanId = await Orphan.create(orphanData);
            const newOrphan = await Orphan.findById(orphanId);
            
            res.status(201).json({
                success: true,
                data: newOrphan,
                message: 'Orphan created successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get all orphans (admin or staff)
    static async getAll(req, res) {
        try {
            let orphans;
            
            if (req.user.role === 'admin') {
                orphans = await Orphan.findAll();
            } else {
                const orphanageId = req.user.orphanage_id;
                if (!orphanageId) {
                    return res.status(403).json({
                        success: false,
                        message: 'Staff member must be assigned to an orphanage'
                    });
                }
                orphans = await Orphan.findByOrphanage(orphanageId);
            }
            
            res.status(200).json({
                success: true,
                data: orphans
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get orphan by ID (admin or staff from same orphanage)
    static async getById(req, res) {
        try {
            const orphan = await Orphan.findById(req.params.id);
            
            if (!orphan) {
                return res.status(404).json({
                    success: false,
                    message: 'Orphan not found'
                });
            }

            if (req.user.role !== 'admin' && req.user.orphanage_id !== orphan.orphanage_id) {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized to access this orphan'
                });
            }
            
            res.status(200).json({
                success: true,
                data: orphan
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Update orphan (staff from same orphanage)
    static async update(req, res) {
        try {
            const { id } = req.params;
            const orphan = await Orphan.findById(id);
            
            if (!orphan) {
                return res.status(404).json({
                    success: false,
                    message: 'Orphan not found'
                });
            }

            if (req.user.role !== 'admin' && req.user.orphanage_id !== orphan.orphanage_id) {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized to update this orphan'
                });
            }

            const updates = req.body;
            delete updates.is_sponsored;
            delete updates.is_active;
            delete updates.orphanage_id;
            
            const affectedRows = await Orphan.update(id, updates);
            
            if (affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Orphan not found or no changes made'
                });
            }
            
            const updatedOrphan = await Orphan.findById(id);
            res.status(200).json({
                success: true,
                data: updatedOrphan,
                message: 'Orphan updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Set sponsored status (admin only)
    static async setSponsoredStatus(req, res) {
        try {
            const { id } = req.params;
            const { is_sponsored } = req.body;
            
            const affectedRows = await Orphan.setSponsoredStatus(id, is_sponsored);
            
            if (affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Orphan not found'
                });
            }
            
            const updatedOrphan = await Orphan.findById(id);
            res.status(200).json({
                success: true,
                data: updatedOrphan,
                message: `Orphan sponsorship status updated to ${is_sponsored ? 'sponsored' : 'not sponsored'}`
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Set active status (admin only)
    static async setActiveStatus(req, res) {
        try {
            const { id } = req.params;
            const { is_active } = req.body;
            
            const affectedRows = await Orphan.setActiveStatus(id, is_active);
            
            if (affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Orphan not found'
                });
            }
            
            const updatedOrphan = await Orphan.findById(id);
            res.status(200).json({
                success: true,
                data: updatedOrphan,
                message: `Orphan active status updated to ${is_active ? 'active' : 'inactive'}`
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Delete orphan (admin only)
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await Orphan.delete(id);
            
            if (affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Orphan not found'
                });
            }
            
            res.status(200).json({
                success: true,
                message: 'Orphan deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = OrphanController;