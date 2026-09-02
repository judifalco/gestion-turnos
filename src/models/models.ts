// Interfaz para datos crudos (si vinieran desde JSON con formatos inconsistentes)
export interface MedicoCrudo {
  id: string | number;
  nombre: string;
  documento: string | number;
  especialidad: string;
  disponible: boolean | string;  // Podría venir como "si"/"no" o true/false
}

interface TurnoCrudo {
    id: string | number;
    paciente: string;
    documento: string | number;
    especialidad: string;
    fecha: string;
    hora: string;
    confirmado: string | boolean;
    observaciones?: string;
  }
  

  // Interfaz normalizada
export interface Medico {
  id: number;
  nombre: string;
  documento: string;
  especialidad: string;  // Title Case: "Pediatría", "Odontología"
  disponible: boolean;
}


  interface Turno {
    id: number;
    paciente: string;
    documento: string;
    especialidad: string;
    fecha: string;
    hora: string;
    confirmado: boolean;
    observaciones?: string;
  }
  
  export { TurnoCrudo, Turno };