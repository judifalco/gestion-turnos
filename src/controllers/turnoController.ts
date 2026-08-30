// src/controllers/turnoController.ts
import { Request, Response } from "express";
import {
  crearTurnoService,
  obtenerTodosService,
  obtenerPorIdService,
  actualizarTurnoService,
  eliminarTurnoService,
} from "../services/turnoService.js";

// GET /turnos — Obtener todos
export async function obtenerTodosLosController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const turnos = await obtenerTodosService();
    res.status(200).json(turnos);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Error desconocido" });
    }
  }
}

// GET /turnos/:id — Obtener por ID
export async function obtenerPorIdController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const turno = await obtenerPorIdService(id);
    if (!turno) {
      res.status(404).json({ error: "Turno no encontrado" });
      return;
    }
    res.status(200).json(turno);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Error desconocido" });
    }
  }
}

// POST /turnos — Crear
export async function crearTurnoController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const nuevoTurno = await crearTurnoService(req.body);
    res.status(201).json(nuevoTurno);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Error desconocido" });
    }
  }
}

// PUT /turnos/:id — Actualizar
export async function actualizarTurnoController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const turnoActualizado = await actualizarTurnoService(id, req.body);
    if (!turnoActualizado) {
      res.status(404).json({ error: "Turno no encontrado" });
      return;
    }
    res.status(200).json(turnoActualizado);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Error desconocido" });
    }
  }
}

// DELETE /turnos/:id — Eliminar
export async function eliminarTurnoController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const eliminado = await eliminarTurnoService(id);
    if (!eliminado) {
      res.status(404).json({ error: "Turno no encontrado" });
      return;
    }
    res.status(200).json({ mensaje: "Turno eliminado" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Error desconocido" });
    }
  }
}