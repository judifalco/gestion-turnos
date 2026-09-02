import { z } from "zod";

/**
 * Esquema de validación para crear/actualizar un Médico
 * - documento: debe ser string (no número)
 * - especialidad: debe estar en Title Case/PascalCase
 * - disponible: booleano
 */
export const medicoSchema = z.object({
  id: z.number().int().positive("ID debe ser un número entero positivo"),
  nombre: z
    .string()
    .trim()
    .min(1, "Nombre es obligatorio")
    .min(3, "Nombre debe tener al menos 3 caracteres"),
  documento: z
    .string()
    .trim()
    .min(1, "Documento es obligatorio"),
  especialidad: z
    .string()
    .trim()
    .min(1, "Especialidad es obligatoria")
    .refine(
      (valor) => /^[A-Z][a-záéíóúñ\s]*$/.test(valor),
      "Especialidad debe estar en Title Case (ej: Pediatría, Odontología)"
    ),
  disponible: z.boolean(),
});

/**
 * Esquema para validar entrada (puede venir con tipos mixtos)
 */
export const medicoInputSchema = z.object({
  id: z
    .union([z.number(), z.string()])
    .transform((val) => (typeof val === "string" ? Number(val) : val))
    .refine((val) => Number.isInteger(val) && val > 0, "ID debe ser un número entero positivo"),
  nombre: z
    .string()
    .trim()
    .min(1, "Nombre es obligatorio")
    .min(3, "Nombre debe tener al menos 3 caracteres"),
  documento: z
    .union([z.number(), z.string()])
    .transform((val) => String(val).trim()),
  especialidad: z
    .string()
    .trim()
    .min(1, "Especialidad es obligatoria")
    .refine(
      (valor) => /^[A-Z][a-záéíóúñ\s]*$/.test(valor),
      "Especialidad debe estar en Title Case (ej: Pediatría, Odontología)"
    ),
  disponible: z
    .union([z.boolean(), z.string()])
    .transform((val) => {
      if (typeof val === "boolean") return val;
      return val === "true" || val === "si";
    })
    .optional()
    .default(true),
});

// Tipos derivados del esquema
export type MedicoInput = z.infer<typeof medicoInputSchema>;
export type Medico = z.infer<typeof medicoSchema>;