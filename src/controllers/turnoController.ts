// src/controllers/turnoController.ts
import { Request, Response, NextFunction } from "express";
import {
  crearTurnoService,
  obtenerTodosService,
  obtenerTurnosConFiltrosService,
  obtenerPorIdService,
  actualizarTurnoService,
  eliminarTurnoService,
  FiltrosTurnos
} from "../services/turnoService.js";
import { turnoInputSchema } from "../schemas/turnoSchema.js";

// GET /turnos — Obtener todos o con filtros
export async function obtenerTodosLosController(
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<Response> {
  let status = 200;
  
  try {
    // 🔹 Verificar si hay query parameters de filtro
   // const tieneEspecialidad = req.query.especialidad !== undefined;
    const tieneFecha = req.query.fecha !== undefined;
    const tieneMedicoId = req.query.medicoId !== undefined;

    let turnos;

    // Si hay al menos un filtro, usar la función con filtros
    if (tieneFecha || tieneMedicoId) {
      const filtros: FiltrosTurnos = {
       /* especialidad: req.query.especialidad as string | undefined,*/
        fecha: req.query.fecha as string | undefined,
        medicoId: req.query.medicoId ? Number(req.query.medicoId) : undefined,
      };

      turnos = await obtenerTurnosConFiltrosService(filtros);
    } else {
      // Si no hay filtros, obtener todos
      turnos = await obtenerTodosService();
    }

    // 🔹 VALIDACIÓN POSTERIOR
    if (!turnos || turnos.length === 0) {
      status = 200; // Devolvemos 200 con array vacío
    }

    // 🔹 RESPUESTA EXITOSA
    return res.status(status).json({
      status,
      message: "Turnos obtenidos correctamente",
      data: turnos
    });

  } catch (error: any) {
    // 🔹 Extraer el status del error si es AppError
    const errorStatus = error.status || 500;
    
    return res.status(errorStatus).json({
      status: errorStatus,
      message: error.message || "Error interno del servidor",
      code: error.code || "INTERNAL_SERVER_ERROR",
      details: error.details || [],
      data: null
    });
  }
}

// GET /turnos/:id — Obtener por ID
export async function obtenerPorIdController(
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<Response> {
  let status = 200;
  
  try {
    // 🔹 VALIDACIÓN PREVIA 1: ¿el ID existe?
    const { id } = req.params;
    if (!id) {
      status = 400;
      throw new Error("El ID es requerido");
    }

    // 🔹 VALIDACIÓN PREVIA 2: ¿el ID es un número válido?
    const idNumerico = Number(id);
    if (isNaN(idNumerico) || idNumerico <= 0) {
      status = 400;
      throw new Error("El ID debe ser un número positivo");
    }

    // 🔹 Llamar servicio
    // 🔹 Si no existe, el servicio lanza AppError automáticamente
    const turno = await obtenerPorIdService(idNumerico);

    // 🔹 RESPUESTA EXITOSA
    return res.status(status).json({
      status,
      message: "Turno obtenido correctamente",
      data: turno
    });

  } catch (error: any) {
    // 🔹 Extraer el status del error si es AppError
    const errorStatus = error.status || 500;
    
    return res.status(errorStatus).json({
      status: errorStatus,
      message: error.message || "Error interno del servidor",
      code: error.code || "INTERNAL_SERVER_ERROR",
      details: error.details || [],
      data: null
    });
  }
}

// POST /turnos — Crear
export async function crearTurnoController(
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<Response> {
  let status = 201;
  
  try {
    // 🔹 VALIDACIÓN PREVIA: ¿el body no está vacío?
    if (!req.body || Object.keys(req.body).length === 0) {
      status = 400;
      throw new Error("El cuerpo de la solicitud no puede estar vacío");
    }

    // 🔹 VALIDACIÓN CON ZOD 
     const resultado = turnoInputSchema.safeParse(req.body);
     const { success, data, error } = resultado;
     if (!success) {
       status = 400;
       throw new Error(`Validación fallida: ${error.issues[0].message}`);
     }

    // 🔹 Llamar servicio con datos validados
    const nuevoTurno = await crearTurnoService(data);
    

    // 🔹 RESPUESTA EXITOSA
    return res.status(status).json({
      status,
      message: "Turno creado correctamente",
      data: nuevoTurno
    });

  } catch (error: any) {
    // 🔹 Extraer el status del error si es AppError
    const errorStatus = error.status || 500;
    
    return res.status(errorStatus).json({
      status: errorStatus,
      message: error.message || "Error interno del servidor",
      code: error.code || "INTERNAL_SERVER_ERROR",
      details: error.details || [],
      data: null
    });
  }
}

// PUT /turnos/:id — Actualizar
export async function actualizarTurnoController(
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<Response> {
  let status = 200;
  
  try {
    // 🔹 VALIDACIÓN PREVIA 1: ¿el ID existe y es válido?
    const { id } = req.params;
    if (!id) {
      status = 400;
      throw new Error("El ID es requerido");
    }

    const idNumerico = Number(id);
    if (isNaN(idNumerico) || idNumerico <= 0) {
      status = 400;
      throw new Error("El ID debe ser un número positivo");
    }

    // 🔹 VALIDACIÓN PREVIA 2: ¿el body no está vacío?
    if (!req.body || Object.keys(req.body).length === 0) {
      status = 400;
      throw new Error("El cuerpo de la solicitud no puede estar vacío");
    }

    // 🔹 VALIDACIÓN CON ZOD
     const resultado = turnoInputSchema.safeParse(req.body);
     const { success, data, error } = resultado;
     if (!success) {
       status = 400;
       throw new Error(`Validación fallida: ${error.issues[0].message}`);
     }

    // 🔹 Llamar servicio con datos validados
    const turnoActualizado = await actualizarTurnoService(idNumerico, data);


    // 🔹 VALIDACIÓN POSTERIOR: ¿el servicio devolvió algo?
    if (!turnoActualizado) {
      status = 404;
      throw new Error("Turno no encontrado");
    }

    // 🔹 RESPUESTA EXITOSA
    return res.status(status).json({
      status,
      message: "Turno actualizado correctamente",
      data: turnoActualizado
    });

  } catch (error: any) {
    // 🔹 Extraer el status del error si es AppError
    const errorStatus = error.status || 500;
    
    return res.status(errorStatus).json({
      status: errorStatus,
      message: error.message || "Error interno del servidor",
      code: error.code || "INTERNAL_SERVER_ERROR",
      details: error.details || [],
      data: null
    });
  }
}
// DELETE /turnos/:id — Eliminar
export async function eliminarTurnoController(
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<Response> {
  let status = 204;
  
  try {
    // 🔹 VALIDACIÓN PREVIA 1: ¿el ID existe?
    const { id } = req.params;
    if (!id) {
      status = 400;
      throw new Error("El ID es requerido");
    }

    // 🔹 VALIDACIÓN PREVIA 2: ¿el ID es un número válido?
    const idNumerico = Number(id);
    if (isNaN(idNumerico) || idNumerico <= 0) {
      status = 400;
      throw new Error("El ID debe ser un número positivo");
    }

    // 🔹 Llamar servicio
    const resultado = await eliminarTurnoService(idNumerico);

    // 🔹 VALIDACIÓN POSTERIOR: ¿el servicio encontró el turno?
    if (!resultado) {
      status = 404;
      throw new Error("Turno no encontrado");
    }

    // 🔹 RESPUESTA EXITOSA (204 NO DEVUELVE BODY)
    return res.status(status).send();
    
  } catch (error: any) {
    // 🔹 Extraer el status del error si es AppError
    const errorStatus = error.status || 500;
    
    return res.status(errorStatus).json({
      status: errorStatus,
      message: error.message || "Error interno del servidor",
      code: error.code || "INTERNAL_SERVER_ERROR",
      details: error.details || [],
      data: null
    });
  }
}