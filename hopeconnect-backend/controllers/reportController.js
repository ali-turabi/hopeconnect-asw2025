const Report = require('../models/reportModel');

exports.createReport = async (req, res) => {
  try {
    const { receiver_user_id, content, image_url } = req.body;
    const sender_user_id = req.user.id; // Using req.user.id from your JWT

    if (!receiver_user_id || !content) {
      return res.status(400).json({
        success: false,
        message: 'Receiver ID and content are required'
      });
    }

    const reportId = await Report.create({
      sender_user_id,
      receiver_user_id,
      content,
      image_url: image_url || null
    });

    const newReport = await Report.getById(reportId);

    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      report: newReport
    });

  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({
      success: false,
      message: error.message.includes('foreign key') 
        ? 'Invalid user ID provided' 
        : 'Failed to create report'
    });
  }
};