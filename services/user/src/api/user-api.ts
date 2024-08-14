import { Express, NextFunction, Request, Response } from "express";
import HttpException, { HttpCode } from "../exceptions/HttpException";
import jwtMiddleware from "../middleware/jwt-middleware";
import UserService from "../service/user-service";

const UserAPI = (app: Express) => {
  const userService = new UserService();
  app.get(
    "/user",
    jwtMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { userId } = req.body;
        const result = await userService.GetUser(userId);
        return res.status(200).json({ result });
      } catch (error) {
        next(error);
      }
    }
  );

  app.put(
    "/user",
    jwtMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      const { userId, ...payload } = req.body;
      try {
        await userService.UpdateUser(userId, payload);
        return res.status(200).json({ msg: "User information was updated" });
      } catch (error) {
        next(error);
      }
    }
  );

  app.delete(
    "/user",
    jwtMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      const { userId } = req.body;
      try {
        await userService.DeleteUser(userId);
        return res.status(200).json({ msg: "User was sucessfuly deleted" });
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/user/list",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await userService.GetUserList();
        return res.status(200).json({ result });
      } catch (error) {
        next(error);
      }
    }
  );

  app.post(
    "/user/signup",
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;
      try {
        const result = await userService.CreateUser({
          email,
          password,
        });
        return res.status(200).json({ result });
      } catch (error) {
        next(error);
      }
    }
  );

  app.post(
    "/user/signin",
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;
      try {
        const result = await userService.LoginUser({ email, password });
        return res.status(200).json({ result });
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/user/auth",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.headers.authorization) {
          throw new HttpException(
            HttpCode.BAD_REQUEST,
            "Authorization header is not set"
          );
        }
        const token = req.headers.authorization.split(" ")[1];
        console.log("token", token);
        const userId = await userService.AuthUser(token);
        return res.status(200).json({ authorized: true, userId });
      } catch (error) {
        next(error);
      }
    }
  );
};

export default UserAPI;
