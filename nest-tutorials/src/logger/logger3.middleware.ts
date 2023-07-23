import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export function Logger3Middleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log('request3...');
  next();
}
