import { Request, Response, NextFunction } from "express";

// GET / — Bienvenida
export async function welcomeController(
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<Response> {
  let status = 200;
  
  try {
    return res.status(status).json({
      status,
      message: "Bienvenido a TurnosMed API 3 - Refactorizado con Clean Architecture",
      data: null
    });
  } catch (error: any) {
    status = 500;
    return res.status(status).json({
      status,
      message: error.message || "Error interno del servidor",
      data: null
    });
  }
}

// Middleware para rutas no encontradas — 404
export async function notFoundController(
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<Response> {
  let status = 404;
  
  try {
    return res.status(status).json({
      status,
      message: `La ruta ${req.method} ${req.originalUrl} no existe`,
      data: null
    });
  } catch (error: any) {
    status = 500;
    return res.status(status).json({
      status,
      message: error.message || "Error interno del servidor",
      data: null
    });
  }
}