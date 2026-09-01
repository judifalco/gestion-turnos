import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Si es un error conocido (AppError)
  if (err instanceof AppError) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
      code: err.code,
      details: err.details,
    });
    return;
  }

  // Si es un error desconocido, no exponer detalles en producción
  console.error('Error no controlado:', err);
  res.status(500).json({
    status: 500,
    message: 'Error interno del servidor',
    code: 'INTERNAL_SERVER_ERROR',
    details: [],
  });
}