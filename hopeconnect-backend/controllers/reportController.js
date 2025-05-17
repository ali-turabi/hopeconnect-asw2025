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

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.getAll();
    res.json({
      success: true,
      count: reports.length,
      reports
    });
  } catch (error) {
    console.error('Error getting reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports'
    });
  }
};

exports.getReportsByReceiver = async (req, res) => {
  try {
    const receiverId = req.params.receiverId;
    const reports = await Report.getByReceiver(receiverId);
    res.json({
      success: true,
      receiver_id: receiverId,
      count: reports.length,
      reports
    });
  } catch (error) {
    console.error('Error getting receiver reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch receiver reports'
    });
  }
};

exports.updateReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    const { content, image_url } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Content is required'
      });
    }

    const updated = await Report.update(reportId, { content, image_url });
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    const updatedReport = await Report.getById(reportId);
    res.json({
      success: true,
      message: 'Report updated successfully',
      report: updatedReport
    });
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update report'
    });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    const deleted = await Report.delete(reportId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }
    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete report'
    });
  }
};