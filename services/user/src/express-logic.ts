import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import UserAPI from "./api/user-api";
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "./swagger.json";
import correlationIDMiddleware from "./middleware/correlation-middleware";
import { Channel } from "amqplib";
import HttpException from "./exceptions/HttpException";

const ExpressLogic = async (app: Express, channel: Channel | undefined) => {
  app.use(express.json({ limit: "1mb" }));
  app.use(cors());
  app.use(correlationIDMiddleware);
  app.use((req: Request, res: Response, next: NextFunction) => {
    if(channel) {
      // const formatDate = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      const message = `${new Date().toISOString()} [USERSERVICE] INFO ${req.method} ${req.url} Correlation: ${req.headers["x-correlation-id"] || "no-colleration-id"} - Endpoint called`;
      const exchange = 'my_logging_exchange';
      const routingKey = 'user-service';
      channel.publish(exchange, routingKey, Buffer.from(message));
      // console.log(`Message published to exchange "${exchange}" with routing key "${routingKey}"`);
    }
    next();
  })

  UserAPI(app);

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDoc, {
      swaggerOptions: {
        url: "/swagger.json",
      },
    })
  );
  app.use((  error: HttpException, req: Request, res: Response, next: NextFunction) => {
    let status = error.status || 500;
    let message = error.message || "Something went wrong";
    if(channel) {
      // const formatDate = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      const logMessage = `${new Date().toISOString()} [USERSERVICE] ${status >= 500 ? 'ERROR' : 'WARN'} ${req.method} ${req.url} Correlation: ${req.headers["x-correlation-id"] || "no-colleration-id"} - ${message} - ${status}`;
      const exchange = 'my_logging_exchange';
      const routingKey = 'user-service';
      channel.publish(exchange, routingKey, Buffer.from(logMessage));
    }
    res.status(status).send({
      message,
      status,
    });
  })
};

export default ExpressLogic;
