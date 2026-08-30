import { Router } from "express";
import {
  obtenerTodosLosController,
  obtenerPorIdController,
  crearTurnoController,
  actualizarTurnoController,
  eliminarTurnoController,
} from "../controllers/turnoController.js";

const router = Router();

// GET / — Obtener todos los turnos
router.get("/", obtenerTodosLosController);

// GET /:id — Obtener un turno específico por ID
router.get("/:id", obtenerPorIdController);

// POST / — Crear un nuevo turno
router.post("/", crearTurnoController);

// PUT /:id — Actualizar un turno
router.put("/:id", actualizarTurnoController);

// DELETE /:id — Eliminar un turno
router.delete("/:id", eliminarTurnoController);

export default router;