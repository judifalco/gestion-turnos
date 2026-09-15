import { Request, Response, NextFunction } from "express";
import {
  crearMedicoService,
  obtenerTodosMedicosService,
  obtenerMedicosConFiltrosService,
  obtenerMedicosPorIdService,
  actualizarMedicoService,
  eliminarMedicoService,
  FiltrosMedicos
} from "../services/medicoService.js";
import { medicoInputSchema } from "../schemas/medicoSchema.js";


// GET /medicos — Obtener todos o con filtros
export async function obtenerTodosMedicosController(
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<Response> {
  let status = 200;
  
  try {
    // 🔹 Verificar si hay query parameters de filtro
    const tieneEspecialidad = req.query.especialidad !== undefined;
    const tieneDisponible = req.query.disponible !== undefined;

    let medicos;

    // Si hay al menos un filtro, usar la función con filtros
    if (tieneEspecialidad || tieneDisponible) {
      const filtros: FiltrosMedicos = {
        especialidad: req.query.especialidad as string | undefined,
        disponible: req.query.disponible === "true" 
          ? true 
          : req.query.disponible === "false" 
            ? false 
            : undefined,
      };

      medicos = await obtenerMedicosConFiltrosService(filtros);
    } else {
      // Si no hay filtros, obtener todos
      medicos = await obtenerTodosMedicosService();
    }

    // 🔹 VALIDACIÓN POSTERIOR: ¿el servicio devolvió algo?
    if (!medicos || medicos.length === 0) {
      status = 200; // Igual devolvemos 200, pero con array vacío
      // (Alternativa: podrías hacer 204 si prefieres, pero 200 con [] es más común)
    }

    // 🔹 RESPUESTA EXITOSA
    return res.status(status).json({
      status,
      message: "Médicos obtenidos correctamente",
      data: medicos
    });

  } catch (error: any) {
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

// GET /medicos/:id — Obtener por ID
export async function obtenerMedicosPorIdController(
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

    // 🔹 Llamar al servicio
    const medico = await obtenerMedicosPorIdService(idNumerico);

    // 🔹 VALIDACIÓN POSTERIOR: ¿el servicio devolvió algo?
    if (!medico) {
      status = 404;
      throw new Error("Médico no encontrado");
    }

    // 🔹 RESPUESTA EXITOSA: estructura uniforme
    return res.status(status).json({
      status,
      message: "Médico obtenido correctamente",
      data: medico
    });
  } catch (error: any) {
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
// POST /medicos — Crear
export async function crearMedicoController(
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<Response> {
  let status = 201;
  
  try {
    // 🔹 VALIDACIÓN CON ZOD
    const resultado = medicoInputSchema.safeParse(req.body);
    const { success, data, error } = resultado;
    
    if (!success) {
      status = 400;
      throw new Error(`Validación fallida: ${error.issues[0].message}`);
    }

    // 🔹 Llamar servicio con datos validados
    const nuevoMedico = await crearMedicoService(data);

    // 🔹 RESPUESTA EXITOSA
    return res.status(status).json({
      status,
      message: "Médico creado correctamente",
      data: nuevoMedico
    });
  } catch (error: any) {
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

// PUT /medicos/:id — Actualizar
export async function actualizarMedicoController(
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
    const resultado = medicoInputSchema.safeParse(req.body);
    const { success, data, error } = resultado;
    
    if (!success) {
      status = 400;
      throw new Error(`Validación fallida: ${error.issues[0].message}`);
    }

    // 🔹 Llamar servicio con datos validados
    const medicoActualizado = await actualizarMedicoService(idNumerico, data);

    // 🔹 VALIDACIÓN POSTERIOR: ¿el servicio devolvió algo?
    if (!medicoActualizado) {
      status = 404;
      throw new Error("Médico no encontrado");
    }

    // 🔹 RESPUESTA EXITOSA
    return res.status(status).json({
      status,
      message: "Médico actualizado correctamente",
      data: medicoActualizado
    });
    
  } catch (error: any) {
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

// DELETE /medicos/:id — Eliminar
export async function eliminarMedicoController(
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
    const resultado = await eliminarMedicoService(idNumerico);

    // 🔹 VALIDACIÓN POSTERIOR: ¿el servicio encontró el médico?
    if (!resultado) {
      status = 404;
      throw new Error("Médico no encontrado");
    }

    // 🔹 RESPUESTA EXITOSA (204 NO DEVUELVE BODY)
    return res.status(status).send();
    
  } catch (error: any) {
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