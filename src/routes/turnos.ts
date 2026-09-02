import { Router } from "express";
import {
  obtenerTodosLosController,
  obtenerPorIdController,
  crearTurnoController,
  actualizarTurnoController,
  eliminarTurnoController,
} from "../controllers/turnoController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateBody } from "../middlewares/validationMiddleware.js";
import { turnoInputSchema } from "../schemas/turnoSchema.js";


const router = Router();

// GET / — Obtener todos los turnos
router.get("/", asyncHandler(obtenerTodosLosController));

// GET /:id — Obtener un turno específico por ID
router.get("/:id", asyncHandler(obtenerPorIdController));

// POST / — Crear un nuevo turno
// Valida el body antes de llamar al controlador
router.post(
  "/",
  validateBody(turnoInputSchema),
  asyncHandler(crearTurnoController)
);

// PUT /:id — Actualizar un turno
// Valida el body antes de llamar al controlador
router.put(
  "/:id",
  validateBody(turnoInputSchema),
  asyncHandler(actualizarTurnoController)
);

// DELETE /:id — Eliminar un turno
router.delete("/:id", asyncHandler(eliminarTurnoController));

export default router;