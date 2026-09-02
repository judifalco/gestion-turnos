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

// GET /turnos — Obtener todos o con filtros
export async function obtenerTodosLosController(
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> {
  // Verificar si hay query parameters de filtro
  const tieneEspecialidad = req.query.especialidad !== undefined;
  const tieneFecha = req.query.fecha !== undefined;
  const tieneMedicoId = req.query.medicoId !== undefined;

  // Si hay al menos un filtro, usar la función con filtros
  if (tieneEspecialidad || tieneFecha || tieneMedicoId) {
    const filtros: FiltrosTurnos = {
      especialidad: req.query.especialidad as string | undefined,
      fecha: req.query.fecha as string | undefined,
      medicoId: req.query.medicoId ? Number(req.query.medicoId) : undefined,
    };

    const turnos = await obtenerTurnosConFiltrosService(filtros);
    res.status(200).json(turnos);
    return;
  }

  // Si no hay filtros, obtener todos
  const turnos = await obtenerTodosService();
  res.status(200).json(turnos);
}

// GET /turnos/:id — Obtener por ID
export async function obtenerPorIdController(
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> {
  const id = Number(req.params.id);
  const turno = await obtenerPorIdService(id);
  res.status(200).json(turno);
}

// POST /turnos — Crear
export async function crearTurnoController(
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> {
  const nuevoTurno = await crearTurnoService(req.body);
  res.status(201).json(nuevoTurno);
}

// PUT /turnos/:id — Actualizar
export async function actualizarTurnoController(
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> {
  const id = Number(req.params.id);
  const turnoActualizado = await actualizarTurnoService(id, req.body);
  res.status(200).json(turnoActualizado);
}

// DELETE /turnos/:id — Eliminar
export async function eliminarTurnoController(
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> {
  const id = Number(req.params.id);
  const resultado = await eliminarTurnoService(id);
  res.status(204).send();  // 204 No Content (sin body)
}