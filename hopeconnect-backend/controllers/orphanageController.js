const Orphanage = require('../models/orphanageModel');
const { generateToken } = require('../middleware/auth');

class OrphanageController {
    // Orphanage signup (public)
    static async signup(req, res) {
        try {
            const orphanageData = {
                ...req.body,
                is_active: false, // New orphanages are inactive by default
                is_approved: false
            };
            
            const orphanageId = await Orphanage.create(orphanageData);
            const orphanage = await Orphanage.findById(orphanageId);
            
            res.status(201).json({
                success: true,
                data: orphanage,
                message: 'Orphanage registered successfully. Waiting for admin approval.'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get all orphanages (admin only)
    static async getAll(req, res) {
        try {
            const orphanages = await Orphanage.findAll();
            res.status(200).json({
                success: true,
                data: orphanages
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get orphanage by ID (authenticated users)
    static async getById(req, res) {
        try {
            const orphanage = await Orphanage.findById(req.params.id);
            if (!orphanage) {
                return res.status(404).json({
                    success: false,
                    message: 'Orphanage not found'
                });
            }
            res.status(200).json({
                success: true,
                data: orphanage
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Update orphanage (orphanage can update their own info)
    static async update(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            
            // Remove fields that only admin can update
            delete updates.is_approved;
            delete updates.approved_by;
            delete updates.approval_date;
            delete updates.is_active;
            
            const affectedRows = await Orphanage.update(id, updates);
            
            if (affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Orphanage not found'
                });
            }
            
            const updatedOrphanage = await Orphanage.findById(id);
            res.status(200).json({
                success: true,
                data: updatedOrphanage,
                message: 'Orphanage updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Admin approves an orphanage
    static async approve(req, res) {
        try {
            const { id } = req.params;
            
            const affectedRows = await Orphanage.approve(id);
            
            if (affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Orphanage not found'
                });
            }
            
            const approvedOrphanage = await Orphanage.findById(id);
            res.status(200).json({
                success: true,
                data: approvedOrphanage,
                message: 'Orphanage approved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Admin activates/deactivates an orphanage
    static async setActiveStatus(req, res) {
        try {
            const { id } = req.params;
            const { is_active } = req.body;
            
            const affectedRows = await Orphanage.update(id, { is_active });
            
            if (affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Orphanage not found'
                });
            }
            
            const updatedOrphanage = await Orphanage.findById(id);
            res.status(200).json({
                success: true,
                data: updatedOrphanage,
                message: `Orphanage ${is_active ? 'activated' : 'deactivated'} successfully`
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Delete orphanage (admin only)
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await Orphanage.delete(id);
            
            if (affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Orphanage not found'
                });
            }
            
            res.status(200).json({
                success: true,
                message: 'Orphanage deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
        static async addToBudget(req, res) {
        try {
            const { id } = req.params;
            const { amount } = req.body;

            if (!amount || isNaN(amount)) {
                return res.status(400).json({
                    success: false,
                    message: 'Valid amount is required'
                });
            }

            const affectedRows = await Orphanage.updateBudget(id, parseFloat(amount), 'add');
            
            if (affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Orphanage not found'
                });
            }

            const updatedOrphanage = await Orphanage.findById(id);
            res.status(200).json({
                success: true,
                data: updatedOrphanage,
                message: `Added ${amount} to orphanage budget successfully`
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Subtract from orphanage budget (admin only)
    static async subtractFromBudget(req, res) {
        try {
            const { id } = req.params;
            const { amount } = req.body;

            if (!amount || isNaN(amount)) {
                return res.status(400).json({
                    success: false,
                    message: 'Valid amount is required'
                });
            }

            const affectedRows = await Orphanage.updateBudget(id, parseFloat(amount), 'subtract');
            
            if (affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Orphanage not found'
                });
            }

            const updatedOrphanage = await Orphanage.findById(id);
            res.status(200).json({
                success: true,
                data: updatedOrphanage,
                message: `Subtracted ${amount} from orphanage budget successfully`
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = OrphanageController;