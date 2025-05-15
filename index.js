import express from 'express';
import emergencyCampaignsRouter from './hopeconnect-backend/routes/emergencyCampaignsRouter.js';
import logisticsRouter from './hopeconnect-backend/routes/logisticsRouter.js';

const app = express();

app.use(express.json());
app.use('/', emergencyCampaignsRouter);
app.use('/', logisticsRouter);

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
