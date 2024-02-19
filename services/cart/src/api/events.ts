import { Express, NextFunction, Request, Response } from "express";
import CartService from "../service/cart-service";

const Events = (app: Express) => {
  const service = new CartService();

  app.use(
    "/events",
    async (req: Request, res: Response, next: NextFunction) => {
      console.log("Event received");
      const { payload } = req.body;
      service.SubcribeEvents(payload);
      return res.status(200).json(payload);
    }
  );
};

export default Events;
