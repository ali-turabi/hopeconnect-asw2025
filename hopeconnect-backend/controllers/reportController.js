const Report = require('../models/reportModel');
import { sendEmail } from '../utils/emailService.js'; 
import db from '../config/db.js';
exports.createReport = async (req, res) => {
  try {
    const { receiver_user_id, content, image_url } = req.body;
    const sender_user_id = req.user.user_id;

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

    // ✅ Fetch receiver's email
    const [[receiver]] = await db.execute(
      'SELECT email, name FROM users WHERE user_id = ?',
      [receiver_user_id]
    );

    if (!receiver) {
      console.warn('Receiver email not found');
    } else {
      // ✅ Fetch all reports for this receiver
      const allReports = await Report.getByReceiver(receiver_user_id);

      // ✅ Format reports as HTML
      const htmlContent = `
        <h2>📋 Reports Sent to You</h2>
        <p>Hello ${receiver.name}, you have received a new report. Here are all your reports:</p>
        <table border="1" cellspacing="0" cellpadding="6">
          <thead>
            <tr>
              <th>ID</th>
              <th>Sender</th>
              <th>Content</th>
              <th>Image</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${allReports.map(report => `
              <tr>
                <td>${report.id}</td>
                <td>${report.sender_name}</td>
                <td>${report.content}</td>
                <td>${report.image_url ? `<a href="${report.image_url}">View Image</a>` : 'No image'}</td>
                <td>${new Date(report.report_date).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;

      // ✅ Send the email
      await sendEmail(receiver.email, 'New Report Notification', htmlContent);
    }

    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      report: newReport
    });

  } catch (error) {
    console.error('Error creating report:', {
      message: error.message,
      stack: error.stack,
      sql: error.sql
    });

    res.status(500).json({
      success: false,
      message: error.message.includes('foreign key')
        ? 'Invalid user ID provided'
        : 'Failed to create report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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

    const [[receiver]] = await db.execute(
      'SELECT email, name FROM users WHERE user_id = ?',
      [updatedReport.receiver_user_id]
    );

    if (receiver) {
      const allReports = await Report.getByReceiver(updatedReport.receiver_user_id);

      const htmlContent = `
        <h2>📋 Reports Sent to You (Updated)</h2>
        <p>Hello ${receiver.name}, a report has been <b>updated</b>. Here is the updated report and all your reports:</p>
        <h3>📌 Updated Report:</h3>
        <p><strong>From:</strong> ${updatedReport.sender_name}</p>
        <p><strong>Content:</strong> ${updatedReport.content}</p>
        <p><strong>Image:</strong> ${updatedReport.image_url ? `<a href="${updatedReport.image_url}">View Image</a>` : 'No image'}</p>
        <p><strong>Date:</strong> ${new Date(updatedReport.report_date).toLocaleString()}</p>
        
        <hr/>
        <h3>📚 All Reports:</h3>
        <table border="1" cellspacing="0" cellpadding="6">
          <thead>
            <tr>
              <th>ID</th>
              <th>Sender</th>
              <th>Content</th>
              <th>Image</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${allReports.map(report => `
              <tr>
                <td>${report.id}</td>
                <td>${report.sender_name}</td>
                <td>${report.content}</td>
                <td>${report.image_url ? `<a href="${report.image_url}">View</a>` : 'No image'}</td>
                <td>${new Date(report.report_date).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      await sendEmail(receiver.email, 'Report Updated Notification', htmlContent);
    }

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
  }};