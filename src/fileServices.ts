import { readFile, writeFile } from "node:fs/promises";
import { TurnoCrudo, Turno } from "./models/models.js";


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
      // Convertir id a número y validar que sea positivo
      const id = Number(crudo.id);
      if (!Number.isInteger(id) || id <= 0) {
        console.warn(`⚠️ Turno con campo de ID inválido: ${crudo.id}`);
        return null;
      }
  
      // Limpiar espacios en blanco del paciente
      const paciente = crudo.paciente.trim();
      if (!paciente) {
        console.warn("⚠️ Turno con campo de Paciente vacío");
        return null;
      }
  
      // Convertir documento a string
      const documento = String(crudo.documento).trim();
      if (!documento) {
        console.warn("⚠️ Turno con campo de Documento vacío");
        return null;
      }
  
      // Normalizar especialidad a Title Case
      const especialidad = aTitleCase(crudo.especialidad);
  
      // Fecha y hora (validación básica)
      const fecha = String(crudo.fecha).trim();
      const hora = String(crudo.hora).trim();
      if (!fecha || !hora) {
        console.warn("⚠️ Turno con campo de Fecha u hora vacías");
        return null;
      }
  
      // Convertir confirmado a booleano
      const confirmado = typeof crudo.confirmado === "boolean"
        ? crudo.confirmado
        : crudo.confirmado === "si" || crudo.confirmado === "true";

      //Observaciones puede existir o no
      const observaciones = crudo.observaciones 
        ? String(crudo.observaciones).trim() 
        : undefined;
  
      // Retornar turno normalizado
      return {
        id,
        paciente,
        documento,
        especialidad,
        fecha,
        hora,
        confirmado,
        observaciones,
        // observaciones es opcional, no la incluimos por ahora
      };
    } catch (error) {
      console.warn(`⚠️ Error normalizando registro:`, error);
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