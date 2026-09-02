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

// GET /medicos — Obtener todos o con filtros
export async function obtenerTodosMedicosController(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    // Verificar si hay query parameters de filtro
    const tieneEspecialidad = req.query.especialidad !== undefined;
    const tieneDisponible = req.query.disponible !== undefined;
  
    // Si hay al menos un filtro, usar la función con filtros
    if (tieneEspecialidad || tieneDisponible) {
      const filtros: FiltrosMedicos = {
        especialidad: req.query.especialidad as string | undefined,
        disponible: req.query.disponible === "true" ? true : req.query.disponible === "false" ? false : undefined,
      };
  
      const medicos = await obtenerMedicosConFiltrosService(filtros);
      res.status(200).json(medicos);
      return;
    }
  
    // Si no hay filtros, obtener todos
    const medicos = await obtenerTodosMedicosService();
    res.status(200).json(medicos);
  }

// GET /medicos/:id — Obtener por ID
export async function obtenerMedicosPorIdController(
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> {
  const id = Number(req.params.id);
  const medico = await obtenerMedicosPorIdService(id);
  res.status(200).json(medico);
}

// POST /medicos — Crear
export async function crearMedicoController(
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> {
  const nuevoMedico = await crearMedicoService(req.body);
  res.status(201).json(nuevoMedico);
}

// PUT /medicos/:id — Actualizar
export async function actualizarMedicoController(
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> {
  const id = Number(req.params.id);
  const medicoActualizado = await actualizarMedicoService(id, req.body);
  res.status(200).json(medicoActualizado);
}

// DELETE /medicos/:id — Eliminar
export async function eliminarMedicoController(
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> {
  const id = Number(req.params.id);
  const resultado = await eliminarMedicoService(id);
  res.status(204).send();  // 204 No Content (sin body)
}