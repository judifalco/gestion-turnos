import { z } from 'zod';

// Schema para entrada (creación de paciente)
export const pacienteInputSchema = z.object({
    id: z.number(),
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  apellido: z.string().min(1, 'El apellido es obligatorio'),
  dni: z.string()
    .regex(/^\d{7,8}$/, 'DNI debe ser numérico, entre 7 y 8 dígitos'),
  fechaNacimiento: z.string()
    .refine(
      (date) => {
        const parsed = new Date(date);
        if (isNaN(parsed.getTime())) return false;
        
        // Validar que no sea fecha futura
        if (parsed > new Date()) return false;
        
        // Validar que no supere 120 años atrás
        const hoy = new Date();
        const edad = hoy.getFullYear() - parsed.getFullYear();
        return edad <= 120;
      },
      'Fecha debe estar en ISO 8601, no ser futura y representar edad ≤ 120 años'
    ),
  domicilio: z.string().optional(),
  email: z.string().email('Email inválido'),
  telefono: z.string().min(1, 'Teléfono es obligatorio'),
  obraSocial: z.string().optional(),
});

// Tipo TypeScript inferido automáticamente
export type PacienteCreate = z.infer<typeof pacienteInputSchema>;

// Schema para actualización (todos los campos opcionales excepto DNI)
export const pacienteUpdateSchema = z.object({
    id: z.number().optional(),
  nombre: z.string().optional(),
  apellido: z.string().optional(),
  domicilio: z.string().optional(),
  email: z.string().email().optional(),
  telefono: z.string().optional(),
  obraSocial: z.string().optional(),
});

export type PacienteUpdate = z.infer<typeof pacienteUpdateSchema>;