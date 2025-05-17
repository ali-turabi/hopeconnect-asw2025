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
