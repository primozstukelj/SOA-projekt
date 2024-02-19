import { NextFunction, Request, Response } from "express";
import { CallUserServiceAuth } from "../util";
import axios from "axios";
import HttpException, { HttpCode } from "../exceptions/HttpException";

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const response = await CallUserServiceAuth({
      headers: req.headers,
    }).catch((err) => {
      const correlationHeader =
        err?.response?.headers["x-correlation-id"] ?? null;
      if (correlationHeader) {
        res.set("X-Correlation-ID", correlationHeader);
      }
      if (axios.isAxiosError(err) && err.response) {
        return {
          status: err.response.status,
          data: err.response.data.message,
        };
      }
      throw new HttpException(HttpCode.INTERNAL_SERVER_ERROR, err.toString());
    });
    if (response.status !== HttpCode.OK) {
      throw new HttpException(response.status, response.data);
    }
    req.body.authUserId = response.data.userId;
    next();
  } catch (error) {
    next(error);
  }
}

export default authMiddleware;
