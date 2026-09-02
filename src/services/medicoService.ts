import { Medico, MedicoCrudo } from "../models/models.js";
import { leerMedicos, guardarMedicos } from "../fileServices.js";
import { AppError } from "../utils/AppError.js";

// GET /medicos — Obtener todos
export async function obtenerTodosMedicosService(): Promise<Medico[]> {
  const medicos = await leerMedicos();
  return medicos;
}

// GET /medicos/:id — Obtener por ID
export async function obtenerMedicosPorIdService(id: number): Promise<Medico> {
  const medicos = await leerMedicos();
  const medico = medicos.find(m => m.id === id);

  if (!medico) {
    throw new AppError(
      "Médico no encontrado",
      404,
      "RESOURCE_NOT_FOUND",
      [{ id, mensaje: "El médico solicitado no existe" }]
    );
  }

  return medico;
}

// POST /medicos — Crear
export async function crearMedicoService(datosDeMedico: MedicoCrudo): Promise<Medico> {
  // Validaciones básicas
  if (!datosDeMedico.nombre || !datosDeMedico.especialidad) {
    throw new AppError(
      "Datos incompletos en la solicitud",
      400,
      "VALIDATION_ERROR",
      [{ campos: ["nombre", "especialidad"], mensaje: "Campos obligatorios faltantes" }]
    );
  }

  const medicosExistentes = await leerMedicos();

  const medicoYaExiste = medicosExistentes.some(
    m => m.id === Number(datosDeMedico.id)
  );

  if (medicoYaExiste) {
    throw new AppError(
      "El médico ya existe",
      409,
      "RESOURCE_CONFLICT",
      [{ id: datosDeMedico.id, mensaje: "Un médico con este ID ya está registrado" }]
    );
  }

  const nuevoMedico: Medico = {
    id: Number(datosDeMedico.id),
    nombre: datosDeMedico.nombre.trim(),
    documento: String(datosDeMedico.documento),
    especialidad: datosDeMedico.especialidad,
    disponible: typeof datosDeMedico.disponible === "boolean"
      ? datosDeMedico.disponible
      : datosDeMedico.disponible === "si" || datosDeMedico.disponible === "true",
  };

  const medicosActualizados = [...medicosExistentes, nuevoMedico];
  await guardarMedicos(medicosActualizados);

  return nuevoMedico;
}

// PUT /medicos/:id — Actualizar
export async function actualizarMedicoService(
  id: number,
  datosDeMedico: Partial<MedicoCrudo>
): Promise<Medico> {
  const medicos = await leerMedicos();
  const medicoExistente = medicos.find(m => m.id === id);

  if (!medicoExistente) {
    throw new AppError(
      "Médico no encontrado",
      404,
      "RESOURCE_NOT_FOUND",
      [{ id, mensaje: "No hay médico con ese ID para actualizar" }]
    );
  }

  const medicoActualizado: Medico = {
    ...medicoExistente,
    nombre: datosDeMedico.nombre?.trim() || medicoExistente.nombre,
    documento: String(datosDeMedico.documento) || medicoExistente.documento,
    especialidad: datosDeMedico.especialidad || medicoExistente.especialidad,
    disponible: datosDeMedico.disponible !== undefined
      ? typeof datosDeMedico.disponible === "boolean"
        ? datosDeMedico.disponible
        : datosDeMedico.disponible === "si" || datosDeMedico.disponible === "true"
      : medicoExistente.disponible,
  };

  const medicosActualizados = medicos.map(m => m.id === id ? medicoActualizado : m);
  await guardarMedicos(medicosActualizados);

  return medicoActualizado;
}

// DELETE /medicos/:id — Dar de baja (eliminar)
export async function eliminarMedicoService(id: number): Promise<{ id: number }> {
  const medicos = await leerMedicos();
  const existe = medicos.some(m => m.id === id);

  if (!existe) {
    throw new AppError(
      "Médico no encontrado",
      404,
      "RESOURCE_NOT_FOUND",
      [{ id, mensaje: "No hay médico con ese ID para eliminar" }]
    );
  }

  const medicosActualizados = medicos.filter(m => m.id !== id);
  await guardarMedicos(medicosActualizados);

  return { id };
}