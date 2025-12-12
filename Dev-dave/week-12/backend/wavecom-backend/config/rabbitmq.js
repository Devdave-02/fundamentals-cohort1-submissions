import amqp from 'amqplib';


let channel;


export async function connectRabbit() {
const connection = await amqp.connect(process.env.RABBITMQ_URL);
channel = await connection.createChannel();
await channel.assertQueue('notifications', { durable: true });
return channel;
}


export function getChannel() {
if (!channel) throw new Error('RabbitMQ channel not initialized');
return channel;
}