import { z } from 'zod';

// Schema para creación de turno
export const turnoInputSchema = z.object({
    id: z.number().int().positive('ID debe ser un número positivo'),
    confirmado: z.boolean(),
  pacienteId: z.number().int().positive('pacienteId debe ser un número positivo'),
  medicoId: z.number().int().positive('medicoId debe ser un número positivo'),
  fecha: z.string()
    .refine(
      (date) => {
        const parsed = new Date(date);
        return !isNaN(parsed.getTime()) && parsed >= new Date();
      },
      'Fecha debe estar en ISO 8601 y ser futura'
    ),
  hora: z.string()
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Hora debe estar en formato HH:mm'),
  observaciones: z.string().optional(),
});

export type TurnoCreate = z.infer<typeof turnoInputSchema>;

// Schema para actualización (solo antes de confirmar)
export const turnoUpdateSchema = z.object({
    id: z.number().optional(),
    confirmado: z.boolean().optional(),
  fecha: z.string()
    .refine(
      (date) => {
        const parsed = new Date(date);
        return !isNaN(parsed.getTime()) && parsed >= new Date();
      },
      'Fecha debe estar en ISO 8601 y ser futura'
    )
    .optional(),
  hora: z.string()
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Hora debe estar en formato HH:mm')
    .optional(),
  observaciones: z.string().optional(),
});

export type TurnoUpdate = z.infer<typeof turnoUpdateSchema>;

// Schema para confirmar turno
export const turnoConfirmarSchema = z.object({
  confirmado: z.literal(true),
});