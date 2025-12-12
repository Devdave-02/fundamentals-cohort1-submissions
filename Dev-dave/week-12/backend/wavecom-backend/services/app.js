import express from 'express';
import notificationRoutes from './routes/notification.routes.js';

const app = express();
app.use(express.json());
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => res.json({ ok: true, service: 'wavecom-backend' }));

export default app;
