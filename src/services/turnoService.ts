import { Turno, TurnoCrudo } from "../models/models.js";
import { leerTurnos } from "../fileServices.js";
import { guardarTurnos } from "../fileServices.js";
import { turnoEmitter } from "../events/turnoEmitter.js";

// GET /turnos — Obtener todos
export async function obtenerTodosService(): Promise<Turno[]> {
  const turnos = await leerTurnos();
  return turnos;
}

// GET /turnos/:id — Obtener por ID
export async function obtenerPorIdService(id: number): Promise<Turno | null> {
  const turnos = await leerTurnos();
  return turnos.find(t => t.id === id) || null;
}

// POST /turnos — Crear
export async function crearTurnoService(datosDeTurno: TurnoCrudo): Promise<Turno> {
  if (!datosDeTurno.paciente || !datosDeTurno.especialidad) {
    throw new Error("Datos incompletos");
  }

  const turnosExistentes = await leerTurnos();

  console.log("=== DEBUG ===");
  console.log("Turnos existentes en archivo:", turnosExistentes.map(t => ({ id: t.id, tipo: typeof t.id })));
  console.log("ID que intento crear:", datosDeTurno.id, "Tipo:", typeof datosDeTurno.id);
  console.log("ID convertido a número:", Number(datosDeTurno.id));
  
  const turnoYaExiste = turnosExistentes.some(
    t => {
      const comparacion = t.id === Number(datosDeTurno.id);
      console.log(`Comparando: ${t.id} (${typeof t.id}) === ${Number(datosDeTurno.id)} → ${comparacion}`);
      return comparacion;
    }
  );
  
  console.log("¿El turno ya existe?", turnoYaExiste);
  console.log("=== FIN DEBUG ===");
  
  if (turnoYaExiste) {
    throw new Error("El turno ya existe");
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
  
    console.log("=== DEBUG ACTUALIZAR ===");
    console.log("ID a actualizar:", id);
    console.log("Turno existente:", turnoExistente);
    console.log("Datos a actualizar:", datosDeTurno);
  
    if (!turnoExistente) {
      console.log("Turno NO encontrado");
      return null;
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
  
    console.log("Turno actualizado:", turnoActualizado);

    //Guardo el turno en el archivo
    const turnosActualizados = turnos.map(t => t.id === id ? turnoActualizado : t);
    await guardarTurnos(turnosActualizados);

    //Emito Evento
    turnoEmitter.emit("turno:actualizado", turnoActualizado);
  
    console.log("=== FIN DEBUG ===");
  
    return turnoActualizado;
  }

// DELETE /turnos/:id — Eliminar
export async function eliminarTurnoService(id: number): Promise<boolean> {
    const turnos = await leerTurnos();
    const existe = turnos.some(t => t.id === id);
  
    if (!existe) {
      return false;
    }
  
    //Filtrar el turno a eliminar
    const turnosActualizados = turnos.filter(t => t.id !== id);
    await guardarTurnos(turnosActualizados);
  
    //Emitir evento
    turnoEmitter.emit("turno:eliminado", { id });
  
    return true;
  }