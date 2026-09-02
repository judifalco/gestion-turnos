import { Router } from "express";
import {
  obtenerTodosMedicosController,
  obtenerMedicosPorIdController,
  crearMedicoController,
  actualizarMedicoController,
  eliminarMedicoController,
} from "../controllers/medicoController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// GET / — Obtener todos los médicos
router.get("/", asyncHandler(obtenerTodosMedicosController));

// GET /:id — Obtener un médico específico por ID
router.get("/:id", asyncHandler(obtenerMedicosPorIdController));

// POST / — Crear un nuevo médico
router.post("/", asyncHandler(crearMedicoController));

// PUT /:id — Actualizar un médico
router.put("/:id", asyncHandler(actualizarMedicoController));

// DELETE /:id — Eliminar un médico
router.delete("/:id", asyncHandler(eliminarMedicoController));

export default router;