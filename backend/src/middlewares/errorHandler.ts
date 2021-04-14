import { ValidationError } from 'class-validator';
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

export default class HttpException extends Error {
  status: number;
  message: any;
  constructor(status: number, message: any) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export const errorHandler: ErrorRequestHandler = (
  err: HttpException,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (
    Array.isArray(err) &&
    err.length > 0 &&
    err[0] instanceof ValidationError
  ) {
    res.status(400).json({
      status: 400,
      error: Object.fromEntries(
        err.map(e => [
          e.property,
          Object.values(e.constraints)
            .map(m => (m as String)[0].toUpperCase() + (m as String).substr(1))
            .join('. '),
        ]),
      ),
    });
  } else {
    res.status(err.status || 500).json({
      status: err.status || 500,
      error: err.message || 'Something went wrong',
    });
  }
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) => (req: Request, res: Response, next: NextFunction) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};
