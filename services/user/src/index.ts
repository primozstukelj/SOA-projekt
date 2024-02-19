import express from "express";
import dbConnection from "./database/connection";
import ExpressLogic from "./express-logic";
import config from "./config";
import amqp from 'amqplib';


// Async function to connect to RabbitMQ
async function connectToRabbitMQ() {
  // RabbitMQ connection settings
  const rabbitMQUrl = config.RABBITMQ_URL;
  const exchange = 'my_logging_exchange';
  try {
    const connection = await amqp.connect(rabbitMQUrl);
        const channel = await connection.createChannel();
        // Ensure the exchange exists
        await channel.assertExchange(exchange, 'topic', {
          durable: true // Change to true if you want the exchange to survive broker restarts
        });
        return channel;
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
    }
}

const Start = async () => {
  console.log(`Running server in mode: ${config.NODE_ENV}`);
  const app = express();
  const rabbitmqChannel = await connectToRabbitMQ();
  await dbConnection();

  await ExpressLogic(app, rabbitmqChannel);

  app
    .listen(config.PORT, () => {
      console.log(`User service running at port ${config.PORT}`);
    })
    .on("error", (err: Error) => {
      console.log(err);
      process.exit();
    });
};

Start();
