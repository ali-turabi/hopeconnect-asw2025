const OrphanUpdate = require('../models/OrphanUpdate');

exports.createUpdate = async (req, res) => {
  try {
    const { orphan_id, title, description, photo_url } = req.body;
    const created_by = req.user.id; // Get user ID from verified token

    // Basic validation
    if (!orphan_id || !title || !description) {
      return res.status(400).json({ 
        success: false,
        message: 'Required fields: orphan_id, title, description' 
      });
    }

    // Validate IDs are numbers if they should be
    if (isNaN(orphan_id)) {
      return res.status(400).json({
        success: false,
        message: 'orphan_id must be a valid number'
      });
    }

    const updateId = await OrphanUpdate.create({
      orphan_id,
      title,
      description,
      photo_url: photo_url || null,
      created_by
    });

    res.status(201).json({
      success: true,
      message: 'Orphan update created successfully',
      updateId
    });
  } catch (error) {
    console.error('Error creating orphan update:', error);
    
    let statusCode = 500;
    let message = 'Server error while creating orphan update';
    
    if (error.message.includes('Orphan with ID') || error.message.includes('User with ID')) {
      statusCode = 404;
      message = error.message;
    } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      statusCode = 404;
      message = 'Referenced orphan not found';
    }

    res.status(statusCode).json({
      success: false,
      message
    });
  }
};

exports.getUpdatesByOrphanId = async (req, res) => {
  try {
    const { orphanId } = req.params;
    
    if (isNaN(orphanId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid orphan ID format'
      });
    }

    const updates = await OrphanUpdate.findByOrphanId(orphanId);
    
    res.status(200).json({
      success: true,
      message: 'Updates retrieved successfully',
      data: updates
    });
  } catch (error) {
    console.error('Error fetching orphan updates:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orphan updates'
    });
  }
};