# Modelado de Pacientes y Turnos

## Introducción

Se incorporó un módulo de pacientes al sistema de turnos médicos con el objetivo de normalizar la información y evitar la duplicación de datos entre entidades.

La solución implementa relaciones entre Pacientes, Médicos y Turnos mediante identificadores únicos, permitiendo una estructura más mantenible y escalable.

---

# a) Explicación conceptual del modelado de datos

## Entidad Paciente

Representa a una persona que puede solicitar uno o varios turnos médicos.

### Estructura

```ts
interface Paciente {
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
```

### Responsabilidades

- Almacenar los datos personales del paciente.
- Identificar de manera única a cada paciente mediante su DNI.
- Relacionarse con múltiples turnos.

### Restricciones

- El DNI debe ser único.
- Nombre, apellido, email y teléfono son obligatorios.
- Un paciente puede tener varios turnos.

---

## Entidad Médico

Representa a un profesional disponible para la atención médica.

### Estructura

```ts
interface Medico {
  id: number;
  nombre: string;
  documento: string;
  especialidad: string;
  disponible: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Responsabilidades

- Gestionar información profesional.
- Indicar disponibilidad para la atención.
- Asociarse con múltiples turnos.

---

## Entidad Turno

Representa una reserva de atención médica.

### Estructura

```ts
interface Turno {
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
```

### Responsabilidades

- Vincular un paciente con un médico.
- Administrar fecha y horario de atención.
- Registrar el estado de confirmación.

---

## Relaciones entre entidades

### Paciente - Turno

Un paciente puede tener múltiples turnos.

```text
Paciente (1) ------ (*) Turno
```

---

### Médico - Turno

Un médico puede atender múltiples turnos.

```text
Médico (1) ------ (*) Turno
```

---

### Modelo completo

```text
Paciente (1)
*     |
      |
      v
    Turno
 *    ^
      |
      |
Médico (1)
`*`

---

## Beneficios del modelado*
- Elimina duplicación de datos.
-*Mejora la integridad de la informa*ión.
- Facilita búsquedas por paci*nte y médico.
- Permite futuras ex*ensiones como historia clínica o f*cturación.
- Mantiene las relacion*s entre entidades mediante identif*cadores.

---

# b) Endpoints REST*ul implementados

La aplicación fu* desarrollada siguiendo principios*de Clean Architecture, separando r*sponsabilidades entre rutas, contr*ladores, servicios y persistencia.*
## Arquitectura utilizada

Routes
   │
   ▼
Controllers
   │
   ▼
Services
   │
   ▼
File Services
   │
   ▼
JSON Storage
```


# Endpoints de Pacientes

## Obtener todos los pacientes

```http
GET /pacientes
```

Obtiene el listado completo de pacientes registrados.

---

## Obtener un paciente por ID

```http
GET /pacientes/:id
```
Ejemplo:

```http
GET /pacientes/1```

Devuelve la información completa de un paciente.

---

## Crear un paciente

```http
POST /pacientes
```

Body de ejemplo:

```json
{
* "nombre": "Juan",
  "apellido": "*érez",
  "dni": "40111222",
  "fec*aNacimiento": "1990-10-15",
  "ema*l": "juan@gmail.com",
  "telefono": "1133445566",
  "obraSocial": "OSDE"
}
```

Validaciones:

- DNI obl*gatorio.
- DNI único.
- Nombre obl*gatorio.
- Apellido obligatorio.
- Email obligatorio.
- Teléfono obli*atorio.

---

## Actualizar un paciente

```http
PUT /pacientes/:id
```

Ejemplo:

```http
PUT /pacientes/1
```

Body:

```json
{
  "telefono": "1144556677"
}
```

Permite modificar uno o varios campos del paciente.

---

## Eliminar un paciente

```http
DELETE /pacientes/:id
``*

Ejemplo:

```http
DELETE /pacientes/1
```

Elimina el paciente identificado por el ID recibido.

---

* Endpoints de Turnos

## Obtener todos los turnos

```http
GET /turnos
```

---

## Obtener un turno por ID

```http
GET /turnos/:id
```

-*-

## Crear un turno

```http
POST /turnos
```

Body:

```json
{
  "pacienteId": 1,
  "medicoId": 2,
  "*echa": "2026-10-10",
  "hora": "10*30",
  "observaciones": "Primera c*nsulta"
}
```

---

## Actualizar un turno

```http
PUT /turnos/:id
```

Body:

```json
{
  "fecha": "2026-10-15",
  "hora": "11:00"
}
```

---

## Eliminar un turno

```http
DELETE /turnos/:id
```

---

# Conclusión

La incorporación de la entidad Paciente permitió evolucionar el sistema hacia un modelo relacional más robusto. Los turnos ya no almacenan información redundante de pacientes o médicos, sino que utilizan referencias mediante identificadores, mejorando la consistencia de los datos y facilitando la escalabilidad futura de la aplicación.