import { Router } from "express";
import {
  obtenerTodosLosController,
  obtenerPorIdController,
  crearTurnoController,
  actualizarTurnoController,
  eliminarTurnoController,
} from "../controllers/turnoController.js";
import { errorHandler } from "../middlewares/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// GET / — Obtener todos los turnos
router.get("/", asyncHandler(obtenerTodosLosController));

// GET /:id — Obtener un turno específico por ID
router.get("/:id", asyncHandler(obtenerPorIdController));

// POST / — Crear un nuevo turno
router.post("/", asyncHandler(crearTurnoController));

// PUT /:id — Actualizar un turno
router.put("/:id", asyncHandler(actualizarTurnoController));

// DELETE /:id — Eliminar un turno
router.delete("/:id", asyncHandler(eliminarTurnoController));

export default router;