import { Turno, TurnoCrudo } from "../models/models.js";
import { leerTurnos } from "../fileServices.js";
import { guardarTurnos } from "../fileServices.js";
import { turnoEmitter } from "../events/turnoEmitter.js";
import { AppError } from "../utils/AppError.js";

// ========== INTERFAZ DE FILTROS ==========
export interface FiltrosTurnos {
fecha?: string;
medicoId?: number;
pacienteId?: number;
confirmado?: boolean;
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
  
  let resultado = turnos;
  
  if (filtros.fecha) {
  resultado = resultado.filter(
  t => t.fecha === filtros.fecha
  );
  }
  
  if (filtros.medicoId !== undefined) {
  resultado = resultado.filter(
  t => t.medicoId === filtros.medicoId
  );
  }
  
  if (filtros.pacienteId !== undefined) {
  resultado = resultado.filter(
  t => t.pacienteId === filtros.pacienteId
  );
  }
  
  if (filtros.confirmado !== undefined) {
  resultado = resultado.filter(
  t => t.confirmado === filtros.confirmado
  );
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
  if (
    datosDeTurno.id === undefined ||
    datosDeTurno.pacienteId === undefined ||
    datosDeTurno.medicoId === undefined ||
    !datosDeTurno.fecha ||
    !datosDeTurno.hora
    ) {
    throw new AppError(
    "Datos incompletos en la solicitud",
    400,
    "VALIDATION_ERROR",
    [
    {
    campos: [
    "id",
    "pacienteId",
    "medicoId",
    "fecha",
    "hora"
    ],
    mensaje: "Campos obligatorios faltantes"
    }
    ]
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
      pacienteId: Number(datosDeTurno.pacienteId),
      medicoId: Number(datosDeTurno.medicoId),
      fecha: datosDeTurno.fecha,
      hora: datosDeTurno.hora,
      confirmado:
      typeof datosDeTurno.confirmado === "boolean"
      ? datosDeTurno.confirmado
      : datosDeTurno.confirmado === "si" ||
      datosDeTurno.confirmado === "true",
      observaciones:
      datosDeTurno.observaciones,
      createdAt: new Date(),
      updatedAt: new Date(),
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
      pacienteId:
      datosDeTurno.pacienteId !== undefined
      ? Number(datosDeTurno.pacienteId)
      : turnoExistente.pacienteId,
      medicoId:
      datosDeTurno.medicoId !== undefined
      ? Number(datosDeTurno.medicoId)
      : turnoExistente.medicoId,
      fecha:
      datosDeTurno.fecha ??
      turnoExistente.fecha,
      hora:
      datosDeTurno.hora ??
      turnoExistente.hora,
      confirmado:
      datosDeTurno.confirmado !== undefined
      ? (
      typeof datosDeTurno.confirmado === "boolean"
      ? datosDeTurno.confirmado
      : datosDeTurno.confirmado === "si" ||
      datosDeTurno.confirmado === "true"
      )
      : turnoExistente.confirmado,
      observaciones:
      datosDeTurno.observaciones ??
      turnoExistente.observaciones,
      updatedAt: new Date(),
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