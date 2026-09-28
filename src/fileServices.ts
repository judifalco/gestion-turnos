import { readFile, writeFile } from "node:fs/promises";
import { TurnoCrudo, Turno, Medico, MedicoCrudo, PacienteCrudo, Paciente } from "./models/models.js";


/**
 * Normalizacion de mayusculas
 * Ejemplo: "PEDIATRÍA" → "Pediatría", "CLÍNICA MÉDICA" → "Clínica Médica"
 */
function aTitleCase(texto: string): string {
    return texto
      .toLowerCase()
      .split(" ")
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(" ");
  }
  
  /**
   * Normaliza y valida un registro crudo
   * Retorna un Turno válido o null si hay errores
   */
  function normalizarTurno(crudo: TurnoCrudo): Turno | null {
    try {
      const id = Number(crudo.id);
  
      if (!Number.isInteger(id) || id <= 0) {
        console.warn(`⚠️ Turno con ID inválido: ${crudo.id}`);
        return null;
      }
  
      const pacienteId = Number(crudo.pacienteId);
  
      if (!Number.isInteger(pacienteId) || pacienteId <= 0) {
        console.warn(`⚠️ Turno con pacienteId inválido`);
        return null;
      }
  
      const medicoId = Number(crudo.medicoId);
  
      if (!Number.isInteger(medicoId) || medicoId <= 0) {
        console.warn(`⚠️ Turno con medicoId inválido`);
        return null;
      }
  
      const fecha = crudo.fecha.trim();
  
      if (!fecha) {
        console.warn("⚠️ Turno con fecha vacía");
        return null;
      }
  
      const hora = crudo.hora.trim();
  
      if (!hora) {
        console.warn("⚠️ Turno con hora vacía");
        return null;
      }
  
      const confirmado =
        typeof crudo.confirmado === "boolean"
          ? crudo.confirmado
          : crudo.confirmado.toLowerCase() === "si" ||
            crudo.confirmado.toLowerCase() === "true";
  
      const observaciones = crudo.observaciones?.trim();
  
      return {
        id,
        pacienteId,
        medicoId,
        fecha,
        hora,
        confirmado,
        observaciones,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.warn("⚠️ Error normalizando turno:", error);
      return null;
    }
  }
  

  async function leerTurnos() {
    try {
      const datos = await readFile("./data/turnos.json", "utf-8");
      console.log("Archivo leído exitosamente");
      
      // Parseo JSON
      const turnosCrudos: TurnoCrudo[] = JSON.parse(datos);
      
      // Normalizo y cuento si tuvo exito
      const turnosNormalizados: Turno[] = [];
      let aceptados = 0;
      let rechazados = 0;
      
      for (const crudo of turnosCrudos) {
        const turnoNormalizado = normalizarTurno(crudo);
        if (turnoNormalizado) {
          turnosNormalizados.push(turnoNormalizado);
          aceptados++;
        } else {
          rechazados++;
        }
      }
      
      // 3. Informar por consola
      console.log(`✅ Registros aceptados: ${aceptados}`);
      console.log(`❌ Registros rechazados: ${rechazados}`);
      
      // 4. Retornar
      return turnosNormalizados;
    } catch (error) {
      console.error("Error al leer el archivo:", error);
      throw error;
    }
  }

/**
 * Ejemplo usando de uso con callback
 * 
 * 
 * import { readFile as readFileCallback } from "node:fs";
 * 
 * readFileCallback("./data/turnos.json", "utf-8", (error, datos) => {
 *   if (error) {
 *     console.error("Error:", error);
 *     return;
 *   }
 *   console.log("Datos:", datos);
 *   // Mas operaciones = Mas anidacion de callbacks
 * });
 * 
 * Usando promesas el codigo es mas legible al no anidarse
 */



/**
 * Guardar turnos en el archivo
 */

async function guardarTurnos(turnos: Turno[]): Promise<void> {
  try {
    await writeFile(
      "./data/turnos.json",
      JSON.stringify(turnos, null, 2),
      "utf-8"
    );
    console.log("✅ Turnos guardados exitosamente");
  } catch (error) {
    console.error("❌ Error al guardar turnos:", error);
    throw error;
  }
}

export { leerTurnos, guardarTurnos };

// ========== FUNCIONES ESPECÍFICAS PARA MÉDICOS ==========

/**
 * Normaliza y valida un registro crudo de Médico
 */
function normalizarMedico(crudo: MedicoCrudo): Medico | null {
  try {
    const id = Number(crudo.id);
    if (!Number.isInteger(id) || id <= 0) {
      console.warn(`⚠️ Médico con campo de ID inválido: ${crudo.id}`);
      return null;
    }

    const nombre = crudo.nombre.trim();
    if (!nombre) {
      console.warn("⚠️ Médico con campo de Nombre vacío");
      return null;
    }

    const documento = String(crudo.documento).trim();
    if (!documento) {
      console.warn("⚠️ Médico con campo de Documento vacío");
      return null;
    }

    const especialidad = aTitleCase(crudo.especialidad);

    const disponible = typeof crudo.disponible === "boolean"
      ? crudo.disponible
      : crudo.disponible === "si" || crudo.disponible === "true";

    return {
      id,
      nombre,
      documento,
      especialidad,
      disponible,
      createdAt: crudo.createdAt
                ? new Date(crudo.createdAt)
                : new Date(),
      updatedAt: crudo.updatedAt
                ? new Date(crudo.updatedAt)
                : new Date(),
    };
  } catch (error) {
    console.warn(`⚠️ Error normalizando médico:`, error);
    return null;
  }
}

/**
 * Leer y normalizar médicos desde el archivo JSON
 */
export async function leerMedicos(): Promise<Medico[]> {
  try {
    const datos = await readFile("./data/medicos.json", "utf-8");
    console.log("✅ Archivo de médicos leído exitosamente");

    const medicosCrudos: MedicoCrudo[] = JSON.parse(datos);

    const medicosNormalizados: Medico[] = [];
    let aceptados = 0;
    let rechazados = 0;

    for (const crudo of medicosCrudos) {
      const medicoNormalizado = normalizarMedico(crudo);
      if (medicoNormalizado) {
        medicosNormalizados.push(medicoNormalizado);
        aceptados++;
      } else {
        rechazados++;
      }
    }

    console.log(`✅ Registros de médicos aceptados: ${aceptados}`);
    console.log(`❌ Registros de médicos rechazados: ${rechazados}`);

    return medicosNormalizados;
  } catch (error) {
    console.error("❌ Error al leer médicos:", error);
    throw error;
  }
}

/**
 * Guardar médicos en el archivo JSON
 */
export async function guardarMedicos(medicos: Medico[]): Promise<void> {
  try {
    await writeFile(
      "./data/medicos.json",
      JSON.stringify(medicos, null, 2),
      "utf-8"
    );
    console.log("✅ Médicos guardados exitosamente");
  } catch (error) {
    console.error("❌ Error al guardar médicos:", error);
    throw error;
  }
}

/////////////////Funciones de Pacientes////////////////

function normalizarPaciente(crudo: PacienteCrudo): Paciente | null {
  try {
    const id = Number(crudo.id);

    if (!Number.isInteger(id) || id <= 0) {
    console.warn("⚠️ Paciente con ID inválido");
    return null;
    }

    const nombre = crudo.nombre.trim();

    if (!nombre) {
      console.warn("⚠️ Paciente con nombre vacío");
      return null;
    }

    const apellido = crudo.apellido.trim();

    if (!apellido) {
      console.warn("⚠️ Paciente con apellido vacío");
      return null;
    }

    const dni = String(crudo.dni).trim();

    if (!dni) {
      console.warn("⚠️ Paciente con DNI vacío");
      return null;
    }

    const fechaNacimiento = String(
      crudo.fechaNacimiento
    ).trim();

    if (!fechaNacimiento) {
      console.warn("⚠️ Paciente con fecha de nacimiento vacía");
      return null;
    }

    const email = crudo.email.trim();

    if (!email) {
      console.warn("⚠️ Paciente con email vacío");
      return null;
    }

    const telefono = crudo.telefono.trim();

    if (!telefono) {
      console.warn("⚠️ Paciente con teléfono vacío");
      return null;
    }

    const domicilio = crudo.domicilio?.trim();
    const obraSocial = crudo.obraSocial?.trim();

    return {
      id,
      nombre,
      apellido,
      dni,
      fechaNacimiento,
      domicilio,
      email,
      telefono,
      obraSocial,
      createdAt: new Date(),
      updatedAt: new Date(),
      };
  } catch (error) {
    console.warn("⚠️ Error normalizando paciente:", error);
    return null;
  }
}

export async function leerPacientes(): Promise<Paciente[]> {
  try {
    const datos = await readFile(
      "./data/pacientes.json",
      "utf-8"
    );

    console.log(
      "✅ Archivo de pacientes leído exitosamente"
    );

    const pacientesCrudos: PacienteCrudo[] =
      JSON.parse(datos);

    const pacientesNormalizados: Paciente[] = [];

    let aceptados = 0;
    let rechazados = 0;

    for (const crudo of pacientesCrudos) {
      const pacienteNormalizado =
        normalizarPaciente(crudo);

      if (pacienteNormalizado) {
        pacientesNormalizados.push(
          pacienteNormalizado
        );
        aceptados++;
      } else {
        rechazados++;
      }
    }

    console.log(
      `✅ Registros de pacientes aceptados: ${aceptados}`
    );

    console.log(
      `❌ Registros de pacientes rechazados: ${rechazados}`
    );

    return pacientesNormalizados;
  } catch (error) {
    console.error(
      "❌ Error al leer pacientes:",
      error
    );

    throw error;
  }
}

export async function guardarPacientes(
  pacientes: Paciente[]
): Promise<void> {
  try {
    await writeFile(
      "./data/pacientes.json",
      JSON.stringify(
        pacientes,
        null,
        2
      ),
      "utf-8"
    );

    console.log(
      "✅ Pacientes guardados exitosamente"
    );
  } catch (error) {
    console.error(
      "❌ Error al guardar pacientes:",
      error
    );

    throw error;
  }
}