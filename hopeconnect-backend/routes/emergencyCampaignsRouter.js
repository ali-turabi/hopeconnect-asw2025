import {Router} from 'express'
import { getAllCampaigns,getCampaignByTitle,insertCampaign,checkOrphanageExists,assignUserToCampaign} from '../models/emergencyCampaignModel.js';
const router = Router();

    router.get('/emergancyCampings', async(req,res)=>{
        try {
            const campaigns = await getAllCampaigns();
            res.json(campaigns);
          } catch (err) {
            res.status(500).json({ message: err.message });
          }
    });

    router.get('/emergancyCampings/:title', async (req, res) => {        try {
            const campaign = await getCampaignByTitle(req.params.title);
            if (!campaign) {
              return res.status(404).json({ message: 'there are no Campaign founded' });
            }
            res.json(campaign);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    router.post('/emergencyCampaigns', async (req, res) => {
    try {
        const { orphanageId, title, description, type, goalAmount } = req.body;

        
        const missingFields = [];
        if (!orphanageId) missingFields.push('orphanageId');
        if (!title) missingFields.push('title');
        if (!description) missingFields.push('description');
        if (!goalAmount) missingFields.push('goalAmount');

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        if (isNaN(goalAmount) || Number(goalAmount) <= 0) {
            return res.status(400).json({ message: 'goalAmount must be a positive number' });
        }

        if (!Number.isInteger(Number(orphanageId))) {
            return res.status(400).json({ message: 'orphanageId must be an integer' });
        }

        const orphanageExists = await checkOrphanageExists(orphanageId);
        if (!orphanageExists) {
            return res.status(404).json({ message: 'Orphanage not found' });
        }

        const result = await insertCampaign(
            orphanageId,
            title,
            description,
            type,
            goalAmount
        );

        const newCampaign = {
            id: result.insertId,
            orphanageId,
            title: title.trim(),
            description: description.trim(),
            type: type || null,
            goalAmount,
            collectedAmount: 0.00,
            isActive: true
        };

        res.status(201).json({
            message: 'Emergency campaign created successfully',
            campaign: newCampaign
        });

    } catch (err) {
        console.error('Error creating emergency campaign:', err);
        res.status(500).json({ 
            message: 'Failed to create emergency campaign',
            error: err.message 
        });
    }
    });

    router.post('/joinEmergencyCampaigns',async(req,res)=>{
        const { user_name, campaign_title } = req.body;
        try {
        const result = await assignUserToCampaign(user_name, campaign_title);
        res.status(200).json({ message: 'User successfully assigned to the emergency campaign', result });
        } catch (err) {
         res.status(500).json({ message: err.message });
        }  
    });
export default router;