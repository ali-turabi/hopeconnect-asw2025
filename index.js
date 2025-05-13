import express from 'express';
import emergencyCampaignsRouter from './hopeconnect-backend/routes/emergencyCampaignsRouter.js';

const app = express();

app.use(express.json());
app.use('/', emergencyCampaignsRouter);

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
