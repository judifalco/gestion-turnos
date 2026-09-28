import { z } from "zod";

/**
 * Esquema de validación para crear/actualizar un Turno
 * - documento: debe ser string (no número)
 * - especialidad: debe estar en Title Case/PascalCase
 */
export const turnoSchema = z.object({
  id: z.number().int().positive("ID debe ser un número entero positivo"),
  paciente: z
    .string()
    .trim()
    .min(1, "Paciente es obligatorio")
    .min(3, "Paciente debe tener al menos 3 caracteres"),
  documento: z
    .string()
    .trim()
    .min(1, "Documento es obligatorio"),
  especialidad: z
    .string()
    .trim()
    .min(1, "Especialidad es obligatoria")
    .refine(
        (valor) => /^[A-Z][a-záéíóúñ]*(\s[A-Z][a-záéíóúñ]*)*$/.test(valor),
        "Especialidad debe estar en Title Case (ej: Pediatría, Clínica Médica)"
      ),
  fecha: z
    .string()
    .trim()
    .min(1, "Fecha es obligatoria"),
  hora: z
    .string()
    .trim()
    .min(1, "Hora es obligatoria"),
  confirmado: z
    .boolean()
    .optional()
    .default(false),
  observaciones: z
    .string()
    .trim()
    .optional(),
});

/**
 * Esquema para validar entrada (puede venir con tipos mixtos)
 */
export const turnoInputSchema = z.object({
  id: z
    .union([z.number(), z.string()])
    .transform((val) => (typeof val === "string" ? Number(val) : val))
    .refine((val) => Number.isInteger(val) && val > 0, "ID debe ser un número entero positivo"),
  paciente: z
    .string()
    .trim()
    .min(1, "Paciente es obligatorio")
    .min(3, "Paciente debe tener al menos 3 caracteres"),
  documento: z
    .union([z.number(), z.string()])
    .transform((val) => String(val).trim()),
  especialidad: z
    .string()
    .trim()
    .min(1, "Especialidad es obligatoria")
    .refine(
        (valor) => /^[A-Z][a-záéíóúñ]*(\s[A-Z][a-záéíóúñ]*)*$/.test(valor),
        "Especialidad debe estar en Title Case (ej: Pediatría, Clínica Médica)"
      ),
  fecha: z
    .string()
    .trim()
    .min(1, "Fecha es obligatoria"),
  hora: z
    .string()
    .trim()
    .min(1, "Hora es obligatoria"),
  confirmado: z
    .union([z.boolean(), z.string()])
    .transform((val) => {
      if (typeof val === "boolean") return val;
      return val === "true" || val === "si";
    })
    .optional()
    .default(false),
  observaciones: z
    .string()
    .trim()
    .optional(),
});

// Tipo derivado del esquema (para usar en TypeScript)
export type TurnoInput = z.infer<typeof turnoInputSchema>;
export type Turno = z.infer<typeof turnoSchema>;