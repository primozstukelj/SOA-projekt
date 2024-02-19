import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import HttpException, { HttpCode } from "../exceptions/HttpException";

function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.headers.authorization) {
      throw new HttpException(
        HttpCode.BAD_REQUEST,
        "Authorization header is not set"
      );
    }
    const token = req.headers.authorization.split(" ")[1];
    const tokenDecoded = jwt.decode(token);
    if (!tokenDecoded) {
      throw new HttpException(HttpCode.BAD_REQUEST, "Token is empty");
    }
    req.body.userId = (tokenDecoded as JwtPayload).id;
    next();
  } catch (error) {
    next(error);
  }
}

export default jwtMiddleware;
