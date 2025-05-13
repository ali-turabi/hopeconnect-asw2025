import {Router} from 'express'
import { getAllCampaigns,getCampaignById,insertCampaign,getOrganizationId} from '../models/emergencyCampaignModel.js';
const router = Router();

    router.get('/emergancyCampings', async(req,res)=>{
        try {
            const campaigns = await getAllCampaigns();
            res.json(campaigns);
          } catch (err) {
            res.status(500).json({ message: err.message });
          }
    });

    router.get('/emergancyCampings/:id', async (req, res) => {        try {
            const campaign = await getCampaignById(req.params.id);
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
          const {
            title,
            description,
            goal_amount,
            start_date,
            end_date,
            organization_id
          } = req.body;
          const missingFields = [];
          if (!title) missingFields.push('title');
          if (!description) missingFields.push('description');
          if (!goal_amount) missingFields.push('goal_amount');
          if (!start_date) missingFields.push('start_date');
          if (!end_date) missingFields.push('end_date');
          if (!organization_id) missingFields.push('organization_id');
      
          if (missingFields.length > 0) {
            return res.status(400).json({
              message: `Missing required fields: ${missingFields.join(', ')}`
            });
          }
          if (isNaN(goal_amount) || Number(goal_amount) <= 0) {
            return res.status(400).json({ message: 'goal_amount must be a positive number' });
          }

          if (!Number.isInteger(Number(organization_id))) {
            return res.status(400).json({ message: 'organization_id must be an integer' });
          }
          const start = new Date(start_date);
          const end = new Date(end_date);
          if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ message: 'Invalid start_date or end_date format' });
          }
          if (start >= end) {
            return res.status(400).json({ message: 'start_date must be before end_date' });
          }
          const orgExists = await getOrganizationId(organization_id);
          if (!orgExists) {
            return res.status(404).json({ message: 'Organization not found' });
          }
          const result = await insertCampaign(title, description, goal_amount, start_date, end_date, organization_id);
          const newCampaign = {
            id: result.insertId, 
            title: title.trim(),
            description: description.trim(),
            goal_amount,
            start_date,
            end_date,
            status: 'active',
            organization_id
          };
      
          res.status(201).json({
            message: 'Campaign created successfully',
            campaign: newCampaign
          });
      
        } catch (err) {
          console.error('Error creating campaign:', err);
          res.status(500).json({ message: err.message });
        }
      });
      
    export default router;