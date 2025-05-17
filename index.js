import express from 'express';
import emergencyCampaignsRouter from './hopeconnect-backend/routes/emergencyCampaignsRouter.js';
import logisticsRouter from './hopeconnect-backend/routes/logisticsRouter.js';
import partnerRouter from './hopeconnect-backend/routes/partnershipsRouter.js';
import fs from 'fs';
import errorHandler from './hopeconnect-backend/middleware/errorHandler.js';


const app = express();
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

app.use(express.json());
app.use('/', emergencyCampaignsRouter);
app.use('/', logisticsRouter);
app.use('/', partnerRouter);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
console.log('.env exists:', fs.existsSync('./.env'));