import config from "../config";
import { Log } from "../database/models/Log";
import amqp from "amqplib";

class LogService {
  constructor() {}

  GetLogs = async () => {
    const log = await Log.find();
    return log;
  };

  CreateLog = async () => {
    const rabbitMQUrl = config.RABBITMQ_URL;
    const exchange = 'my_logging_exchange';
    try {
      const connection = await amqp.connect(rabbitMQUrl);
      const channel = await connection.createChannel();
      // Ensure the exchange exists
      await channel.assertExchange(exchange, 'topic', {
        durable: true // Change to true if you want the exchange to survive broker restarts
      });

      await channel.consume('logging_queue', async function(msg) {
        const content = msg.content.toString();
        const [timestamp, ...rest] = content.split(' ');
        const log = new Log({
          timestamp: new Date(timestamp),
          message: rest.join(' ')
        });

        await log.save();
      }, {  noAck: true });
      } catch (error) {
          throw new Error(`Error connecting to RabbitMQ: ${error}`);
      }
  };

  GetLogsByDate = async (fromDate: string, toDate: string) => {
    const log = await Log.find({ timestamp: { $gte: fromDate, $lte: toDate } });
    return log;
  };

  DeleteLogs = async () => {
    const log = await Log.remove();
    return log;
  };
}

export default LogService;
