import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

// Middleware simple para capturar sorteoId y almacenarlo en una cookie o sesión
@Injectable()
export class SorteoIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { sorteoId } = req.query;

    if (sorteoId) {
      // Ejemplo almacenando en una cookie
      res.cookie('sorteoId', sorteoId, { httpOnly: true, sameSite: 'lax' });
    }
    next();
  }
}
