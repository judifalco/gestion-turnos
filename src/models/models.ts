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