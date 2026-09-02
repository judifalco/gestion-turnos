import { Turno, TurnoCrudo } from "../models/models.js";
import { leerTurnos } from "../fileServices.js";
import { guardarTurnos } from "../fileServices.js";
import { turnoEmitter } from "../events/turnoEmitter.js";
import { AppError } from "../utils/AppError.js";

// ========== INTERFAZ DE FILTROS ==========
export interface FiltrosTurnos {
  especialidad?: string;
  fecha?: string;
  medicoId?: number;
}

// GET /turnos — Obtener todos
export async function obtenerTodosService(): Promise<Turno[]> {
  const turnos = await leerTurnos();
  return turnos;
}

// GET /turnos — Obtener con filtros opcionales
export async function obtenerTurnosConFiltrosService(
  filtros: FiltrosTurnos
): Promise<Turno[]> {
  const turnos = await leerTurnos();

  // Aplicar filtros de forma encadenada
  let resultado = turnos;

  // Filtrar por especialidad (case-insensitive)
  if (filtros.especialidad) {
    resultado = resultado.filter(
      t => t.especialidad.toLowerCase() === filtros.especialidad!.toLowerCase()
    );
  }

  // Filtrar por fecha
  if (filtros.fecha) {
    resultado = resultado.filter(t => t.fecha === filtros.fecha);
  }

  // Filtrar por medicoId (si ese campo existiera en Turno)
  // Por ahora lo dejamos documentado para futuro
  if (filtros.medicoId) {
    // TODO: Implementar cuando Turno tenga relación con Médico
    console.warn("⚠️ Filtro medicoId aún no implementado en Turno");
  }

  return resultado;
}

// GET /turnos/:id — Obtener por ID
export async function obtenerPorIdService(id: number): Promise<Turno | null> {
  const turnos = await leerTurnos();
  const turno = turnos.find(t => t.id ===id);

  if (!turno) {
    throw new AppError(
      "Turno no encontrado",
      404,
      "RESOURCE_NOT_FOUND",
      [{id,mensaje: "El turno solicitado no existe"}]

    )
  }

  return turno;
}

// POST /turnos — Crear
export async function crearTurnoService(datosDeTurno: TurnoCrudo): Promise<Turno> {
  if (!datosDeTurno.paciente || !datosDeTurno.especialidad) {
    throw new AppError(
      "Datos incompletos en la solicitud",
      400,
      "VALIDATION_ERROR",
      [{campos: ["paciente","especialidad"], mensaje:"Campos obligatorios faltantes"}]
    );
  }

  const turnosExistentes = await leerTurnos();

  const turnoYaExiste = turnosExistentes.some(
    t=> t.id === Number(datosDeTurno.id)
  );

  
  if (turnoYaExiste){
    throw new AppError(
      "El turno ya existe",
      409,
      "RESOURCE_CONFLICT",
      [{id:datosDeTurno.id,mensaje:"Un turno con este ID ya se registró"}]
    );
  }
  
  const nuevoTurno: Turno = {
    id: Number(datosDeTurno.id),
    paciente: datosDeTurno.paciente.trim(),
    documento: String(datosDeTurno.documento),
    especialidad: datosDeTurno.especialidad,
    fecha: String(datosDeTurno.fecha),
    hora: String(datosDeTurno.hora),
    confirmado: false,
    observaciones: datosDeTurno.observaciones,
  };

  //Guardo el turno
  const turnosActualizados = [...turnosExistentes, nuevoTurno];
  await guardarTurnos(turnosActualizados);

  // Emito evento
  turnoEmitter.emit("turno:creado", nuevoTurno);

  return nuevoTurno;
}


// PUT /turnos/:id actualizar turno
export async function actualizarTurnoService(
    id: number,
    datosDeTurno: Partial<TurnoCrudo>
  ): Promise<Turno | null> {
    const turnos = await leerTurnos();
    const turnoExistente = turnos.find(t => t.id === id);
  
    if (!turnoExistente) {
      throw new AppError(
        "Turno no encontrado",
        404,
        "RESOURCE_NOT_FOUND",
        [{ id, mensaje: "No hay turno con ese ID para actualizar" }]
      );
    }
  
    const turnoActualizado: Turno = {
      ...turnoExistente,
      paciente: datosDeTurno.paciente?.trim() || turnoExistente.paciente,
      documento: String(datosDeTurno.documento) || turnoExistente.documento,
      especialidad: datosDeTurno.especialidad || turnoExistente.especialidad,
      fecha: String(datosDeTurno.fecha) || turnoExistente.fecha,
      hora: String(datosDeTurno.hora) || turnoExistente.hora,
      confirmado: datosDeTurno.confirmado !== undefined 
        ? Boolean(datosDeTurno.confirmado) 
        : turnoExistente.confirmado,
    };


    //Guardo el turno en el archivo
    const turnosActualizados = turnos.map(t => t.id === id ? turnoActualizado : t);
    await guardarTurnos(turnosActualizados);

    //Emito Evento
    turnoEmitter.emit("turno:actualizado", turnoActualizado);
  
    return turnoActualizado;
  }

// DELETE /turnos/:id — Eliminar
export async function eliminarTurnoService(id: number): Promise< {id:number}> {
    const turnos = await leerTurnos();
    const existe = turnos.some(t => t.id === id);
  
    if (!existe) {
      throw new AppError(
        "Turno no encontrado",
        404,
        "RESOURCE_NOT_FOUND",
        [{ id, mensaje: "No hay turno con ese ID para eliminar" }]
      );
    }
  
    //Filtrar el turno a eliminar
    const turnosActualizados = turnos.filter(t => t.id !== id);
    await guardarTurnos(turnosActualizados);
  
    //Emitir evento
    turnoEmitter.emit("turno:eliminado", { id });
  
    return {id};
  }