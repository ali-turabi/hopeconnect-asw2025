const PlatformBudget = require('../models/PlatformBudget');

exports.getBudget = async (req, res) => {
  try {
    const budget = await PlatformBudget.getBudget();
    res.status(200).json({ budget });
  } catch (error) {
    console.error('Error fetching budget:', error);
    res.status(500).json({ error: 'Failed to get platform budget' });
  }
};

exports.updateBudget = async (req, res) => {
  try {
    const { amount, operation } = req.body;
    
    // Validate input
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }
    
    if (!['add', 'subtract'].includes(operation)) {
      return res.status(400).json({ error: 'Operation must be either "add" or "subtract"' });
    }

    const success = await PlatformBudget.updateBudget(amount, operation);
    
    if (!success) {
      return res.status(500).json({ error: 'Failed to update budget' });
    }

    const updatedBudget = await PlatformBudget.getBudget();
    res.status(200).json({ 
      message: `Budget ${operation === 'add' ? 'increased' : 'decreased'} successfully`,
      newBudget: updatedBudget 
    });
  } catch (error) {
    console.error('Error updating budget:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};