import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import LogAPI from "./api/log-api";
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "./swagger.json";
import axios from "axios";
import config from "./config";

const ExpressLogic = async (app: Express) => {
  app.use(express.json({ limit: "1mb" }));
  app.use(cors());
  app.use( async (req: Request, res: Response, next: NextFunction) => {
    await axios.post(config.STATS_URL, {klicanaStoritev: req.url}).catch((err) => console.log(err));    
    next();
  });

  LogAPI(app);

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDoc, {
      swaggerOptions: {
        url: "/swagger.json",
      },
    })
  );

  app.use("/", (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({ msg: "Log service response" });
  });
};

export default ExpressLogic;
