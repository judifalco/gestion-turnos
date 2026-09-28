// ============ MÉDICO ============
export interface MedicoCrudo {
  id: string | number;
  nombre: string;
  documento: string | number;
  especialidad: string;
  disponible: boolean | string;
  createdAt?: string;
  updatedAt?: string;
  }

export interface Medico {
  id: number;
  nombre: string;
  documento: string;
  especialidad: string;
  disponible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============ TURNO ============
export interface TurnoCrudo {
  id: string | number;
  pacienteId: string | number;
  medicoId: string | number;
  fecha: string;
  hora: string;
  confirmado: string | boolean;
  observaciones?: string;
}

export interface Turno {
  id: number;
  pacienteId: number;
  medicoId: number;
  fecha: string;
  hora: string;
  confirmado: boolean;
  observaciones?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============ PACIENTE ============
export interface PacienteCrudo {
  id: string | number;
  nombre: string;
  apellido: string;
  dni: string;
  fechaNacimiento: string;
  domicilio?: string;
  email: string;
  telefono: string;
  obraSocial?: string;
}

export interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  fechaNacimiento: string;
  domicilio?: string;
  email: string;
  telefono: string;
  obraSocial?: string;
  createdAt: Date;
  updatedAt: Date;
}