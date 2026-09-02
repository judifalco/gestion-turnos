import { Request, Response, NextFunction } from "express";
import {
  crearMedicoService,
  obtenerTodosMedicosService,
  obtenerMedicosPorIdService,
  actualizarMedicoService,
  eliminarMedicoService,
} from "../services/medicoService.js";

// GET /medicos — Obtener todos
export async function obtenerTodosMedicosController(
  _req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> {
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