import express from 'express';
import emergencyCampaignsRouter from './hopeconnect-backend/routes/emergencyCampaignsRouter.js';
import logisticsRouter from './hopeconnect-backend/routes/logisticsRouter.js';
import partnerRouter from './hopeconnect-backend/routes/partnershipsRouter.js';
import fs from 'fs';

const app = express();
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

app.use(express.json());
app.use('/', emergencyCampaignsRouter);
app.use('/', logisticsRouter);
app.use('/', partnerRouter);
app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});

console.log('.env exists:', fs.existsSync('./.env'));