import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { AppError } from "../utils/AppError.js";

/**
 * Middleware factory para validar req.body con un esquema Zod
 * @param schema - Esquema Zod para validar
 * @returns Middleware que valida y pasa al siguiente, o lanza AppError
 */
export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Intenta validar el body con el esquema
      const datosValidados = schema.parse(req.body);
      
      // Si es válido, reemplaza req.body con los datos validados y transformados
      req.body = datosValidados;
      
      // Pasa al siguiente middleware/controlador
      next();
    } catch (err: unknown) {
      // Si falla, captura el error de Zod
      if (err instanceof ZodError) {
        // Extrae los detalles del error de Zod
        const detalles = err.issues.map((issue) => ({
          campo: issue.path.join("."),
          mensaje: issue.message,
          tipo: issue.code,
        }));

        // Lanza un AppError con estructura uniforme
        throw new AppError(
          "Error de validación en los datos ingresados",
          400,
          "VALIDATION_ERROR",
          detalles
        );
      }

      // Si es otro tipo de error, relanza
      throw err;
    }
  };
}