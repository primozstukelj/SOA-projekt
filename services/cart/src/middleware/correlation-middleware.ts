import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

function correlationIDMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const correlationId = req.get("X-Correlation-ID") || uuidv4();
  const requestId = uuidv4();
  res.set("X-Correlation-ID", correlationId);
  res.set("X-Request-ID", requestId);
  next();
}

export default correlationIDMiddleware;
