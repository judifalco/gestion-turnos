import { Router } from "express";
import {
  obtenerTodosMedicosController,
  obtenerMedicosPorIdController,
  crearMedicoController,
  actualizarMedicoController,
  eliminarMedicoController,
} from "../controllers/medicoController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateBody } from "../middlewares/validationMiddleware.js";
import { medicoInputSchema } from "../schemas/medicoSchema.js";


const router = Router();

// GET / — Obtener todos los médicos
router.get("/", asyncHandler(obtenerTodosMedicosController));

// GET /:id — Obtener un médico específico por ID
router.get("/:id", asyncHandler(obtenerMedicosPorIdController));

// POST / — Crear un nuevo médico
// Valida el body antes de llamar al controlador
router.post(
    "/",
    validateBody(medicoInputSchema),
    asyncHandler(crearMedicoController)
  );


// PUT /:id — Actualizar un médico
// Valida el body antes de llamar al controlador
router.put(
    "/:id",
    validateBody(medicoInputSchema),
    asyncHandler(actualizarMedicoController)
  );
  
// DELETE /:id — Eliminar un médico
router.delete("/:id", asyncHandler(eliminarMedicoController));

export default router;