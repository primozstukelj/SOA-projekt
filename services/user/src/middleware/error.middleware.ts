import { NextFunction, Request, Response } from "express";
import HttpException, { HttpCode } from "../exceptions/HttpException";

function errorMiddleware(
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction
) {
  let status = error.status || 500;
  let message = error.message || "Something went wrong";
  
  response.status(status).send({
    message,
    status,
  });
}

export default errorMiddleware;
