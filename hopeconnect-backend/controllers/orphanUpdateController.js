const OrphanUpdate = require('../models/OrphanUpdate');

exports.createUpdate = async (req, res) => {
  try {
    const { orphan_id, title, description, photo_url } = req.body;
    const created_by = req.user.id;

    if (!orphan_id || !title || !description) {
      return res.status(400).json({ 
        success: false,
        message: 'Required fields: orphan_id, title, description' 
      });
    }

    const updateId = await OrphanUpdate.create({
      orphan_id: parseInt(orphan_id),
      title,
      description,
      photo_url: photo_url || null,
      created_by
    });

    return res.status(201).json({
      success: true,
      message: 'Orphan update created successfully',
      updateId
    });
  } catch (error) {
    console.error('Error creating orphan update:', error);
    
    const statusCode = error.message.includes('not found') ? 404 : 500;
    const message = error.message.includes('not found') 
      ? error.message 
      : 'Server error while creating orphan update';

    return res.status(statusCode).json({
      success: false,
      message
    });
  }
};

exports.getUpdatesByOrphanId = async (req, res) => {
  try {
    const { orphanId } = req.params;
    
    if (!orphanId || isNaN(orphanId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid orphan ID is required'
      });
    }

    const updates = await OrphanUpdate.findByOrphanId(parseInt(orphanId));
    
    return res.status(200).json({
      success: true,
      message: updates.length ? 'Updates retrieved successfully' : 'No updates found for this orphan',
      data: updates
    });
  } catch (error) {
    console.error('Error fetching orphan updates:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching orphan updates'
    });
  }
};
exports.getAllUpdates = async (req, res) => {
  try {
    console.log('Fetching all updates without pagination...');
    const updates = await OrphanUpdate.getAllUpdates();
    
    return res.status(200).json({
      success: true,
      message: updates.length ? 'All updates retrieved successfully' : 'No updates found',
      data: updates
    });
  } catch (error) {
    console.error('Detailed error fetching all updates:', {
      message: error.message,
      stack: error.stack,
    });
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching updates',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
// At the end of orphanUpdateController.js, ensure all exports are listed
exports.getUpdateById = async (req, res) => {
  try {
    const { updateId } = req.params;
    
    if (!updateId || isNaN(updateId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid update ID is required'
      });
    }

    console.log(`Fetching update with ID: ${updateId}`); // Debug log
    
    const update = await OrphanUpdate.findById(parseInt(updateId));
    
    console.log('Update found:', update); // Debug log
    
    if (!update) {
      return res.status(404).json({
        success: false,
        message: 'Update not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Update retrieved successfully',
      data: update
    });
  } catch (error) {
    console.error('Detailed error fetching orphan update:', {
      message: error.message,
      stack: error.stack,
      ...error
    });
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching orphan update',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
exports.updateUpdate = async (req, res) => {
  try {
    const { updateId } = req.params;
    const { title, description, photo_url } = req.body;

    if (!updateId || isNaN(updateId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid update ID is required',
      });
    }

    const updated = await OrphanUpdate.update(parseInt(updateId), {
      title,
      description,
      photo_url,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Update not found or no fields updated',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Update updated successfully',
    });
  } catch (error) {
    console.error('Error updating orphan update:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating orphan update',
    });
  }
};
// controllers/orphanUpdateController.js



