import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';
import { connectRabbit } from './config/rabbitmq.js';


const PORT = 3000;


await connectDB();
await connectRabbit();


app.listen(PORT, () => {
console.log(`🚀 API running on port ${PORT}`);
});