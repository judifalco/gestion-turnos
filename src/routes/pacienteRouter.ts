import { Router } from "express";

import {
  obtenerTodosPacientesController,
  obtenerPacientePorIdController,
  crearPacienteController,
  actualizarPacienteController,
  eliminarPacienteController,
} from "../controllers/pacienteController.js";

import { asyncHandler } from "../utils/asyncHandler.js";

import { validateBody } from "../middlewares/validationMiddleware.js";

import {
  pacienteInputSchema,
  pacienteUpdateSchema,
} from "../schemas/pacienteSchema.js";

const router = Router();

// GET / — Obtener todos los pacientes
router.get(
  "/",
  asyncHandler(obtenerTodosPacientesController)
);

// GET /:id — Obtener paciente por ID
router.get(
  "/:id",
  asyncHandler(obtenerPacientePorIdController)
);

// POST / — Crear paciente
router.post(
  "/",
  validateBody(pacienteInputSchema),
  asyncHandler(crearPacienteController)
);

// PUT /:id — Actualizar paciente
router.put(
  "/:id",
  validateBody(pacienteUpdateSchema),
  asyncHandler(actualizarPacienteController)
);

// DELETE /:id — Eliminar paciente
router.delete(
  "/:id",
  asyncHandler(eliminarPacienteController)
);

export default router;