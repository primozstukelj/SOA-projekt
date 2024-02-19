import { Express, NextFunction, Request, Response } from "express";
import LogService from "../service/log-service";

const LogAPI = (app: Express) => {
  const logService = new LogService();

  app.get("/logs", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const logs = await logService.GetLogs();
      return res.status(200).json({ logs });
    } catch (error) {
      next(error);
    }
  });

  app.post("/logs", async (req: Request, res: Response, next: NextFunction) => {
    try {
      await logService.CreateLog();
      return res.status(200).json({ msg: "Log saved"});
    } catch (error) {
      next(error);
    }
  });

  app.delete(
    "/logs",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const logs = await logService.DeleteLogs();
        return res.status(200).json({ logs });
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/logs/:fromDate/:toDate",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { fromDate, toDate } = req.params;
        const logs = await logService.GetLogsByDate(fromDate, toDate);
        return res.status(200).json({ logs });
      } catch (error) {
        next(error);
      }
    }
  );
};

export default LogAPI;
