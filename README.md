# TurnosRed - API REST de Gestión de Turnos

## 📋 Descripción

TurnosRed es una API RESTful desarrollada con **Node.js**, **TypeScript** y **Express** para gestionar turnos de centros ambulatorios (clínica médica, pediatría, odontología y nutrición). 

La aplicación procesa datos heterogéneos de múltiples sedes, normaliza registros, expone endpoints REST y retransmite eventos en tiempo real mediante **Socket.IO** sin necesidad de recargar la página.

**Contexto:** El sistema atiende aproximadamente 420 personas diarias y 9.000 turnos mensuales.

---

## ✅ Requisitos previos

- **Node.js** versión LTS (18.x o superior)
- **npm** (incluido con Node.js)
- **Git** (para clonar el repositorio)
- **Visual Studio Code** o editor de texto similar (opcional, para desarrollo)

**Verificar instalación:**

```bash
node --version
npm --version
git --version


🚀 Instalación


1. Clonar el repositorio
git clone https://github.com/tu-usuario/turnos-red.git
cd turnos-red

2. Instalar dependencias
npm install

3. Configurar variables de entorno
Copia .env.example a .env:

cp .env.example .env
Edita .env con tus valores

4. Compilar TypeScript
npm run compilar

5. Ejecutar el servidor
Modo desarrollo (con recarga automática):

npm run dev

Modo producción (desde código compilado):

npm run compilar
npm iniciar
El servidor se iniciará en http://localhost:3000.

🔧 Variables de entorno

Crea un archivo .env en la raíz con los siguientes valores:

Variable	Tipo	Descripción	Ejemplo

PORT	número	Puerto en el que escucha el servidor	3000
DATA_FILE	string	Ruta del archivo JSON con datos de turnos	./data/turnos.json

Archivo .env.example:

PORT=3000
DATA_FILE=./data/turnos.json

📦 Scripts npm disponibles

Script	Comando	Descripción
dev	ts-node src/server.ts	Ejecuta el servidor en modo desarrollo
compilar	tsc	Compila TypeScript a JavaScript (en dist/)
iniciar	node dist/server.js	Ejecuta el servidor compilado
lint	eslint . --ext .ts	Valida el código con ESLint
format	prettier --write src/	Formatea el código con Prettier

Ejemplos de uso:

npm run dev      # Desarrollo con recarga automática
npm run compilar    # Compilar
npm iniciar        # Ejecutar compilado
npm run lint     # Validar código
npm run format   # Formatear código

📁 Estructura de carpetas
turnos-red/
├── src/
│   ├── events/
│   │   └── turnoEmitter.ts          # Bus de eventos internos
│   ├── routes/
│   │   └── turnos.ts                # Definición de rutas
│   ├── controllers/
│   │   └── turnoController.ts       # Controladores (reciben solicitudes)
│   ├── services/
│   │   └── turnoService.ts          # Lógica de negocio
│   ├── models.ts                    # Interfaces TypeScript
│   ├── fileServices.ts              # Lectura/escritura de archivos
│   └── server.ts                    # Configuración de Express y Socket.IO
├── data/
│   └── turnos.json                  # Base de datos (archivo JSON)
├── public/
│   └── index.html                   # Cliente de prueba (Socket.IO)
├── dist/                            # Código compilado (se genera con `npm run build`)
├── .env                             # Variables de entorno (NO se sube a GitHub)
├── .env.example                     # Ejemplo de variables de entorno
├── .gitignore                       # Archivos a ignorar en Git
├── .eslintrc.json                   # Configuración ESLint
├── .prettierrc.json                 # Configuración Prettier
├── tsconfig.json                    # Configuración TypeScript
├── package.json                     # Dependencias del proyecto
├── package-lock.json                # Lock de dependencias
└── README.md                        # Este archivo
Descripción de directorios principales:

src/ — Código fuente TypeScript
data/ — Datos persistidos en JSON
public/ — Archivos estáticos (HTML, CSS, JS para clientes)
dist/ — Código compilado a JavaScript (generado automáticamente)

## 🔌 Endpoints REST

### Base URL
- **Desarrollo:** `http://localhost:3000`
- **Mock Server (pruebas):** `https://ae66ffdf-ffbe-4e77-b757-26709091504c.mock.pstmn.io`

### Turnos

| Método | Endpoint | Descripción | Estado |
|--------|----------|-------------|--------|
| GET | `/turnos` | Obtener todos los turnos | 200 |
| GET | `/turnos?especialidad=Pediatría` | Filtrar por especialidad | 200 |
| GET | `/turnos?fecha=2026-07-15` | Filtrar por fecha | 200 |
| GET | `/turnos?especialidad=Pediatría&fecha=2026-07-15` | Filtrar por especialidad y fecha | 200 |
| GET | `/turnos/:id` | Obtener un turno por ID | 200 / 404 |
| POST | `/turnos` | Crear un nuevo turno | 201 / 400 |
| PUT | `/turnos/:id` | Actualizar un turno | 200 / 404 / 400 |
| DELETE | `/turnos/:id` | Eliminar un turno | 204 / 404 |

### Médicos

| Método | Endpoint | Descripción | Estado |
|--------|----------|-------------|--------|
| GET | `/medicos` | Obtener todos los médicos | 200 |
| GET | `/medicos?especialidad=Pediatría` | Filtrar por especialidad | 200 |
| GET | `/medicos?disponible=true` | Filtrar por disponibilidad | 200 |
| GET | `/medicos?especialidad=Pediatría&disponible=true` | Filtrar por especialidad y disponibilidad | 200 |
| GET | `/medicos/:id` | Obtener un médico por ID | 200 / 404 |
| POST | `/medicos` | Crear un nuevo médico | 201 / 400 |
| PUT | `/medicos/:id` | Actualizar un médico | 200 / 404 / 400 |
| DELETE | `/medicos/:id` | Eliminar un médico | 204 / 404 |
Sección 2: Ejemplos de Solicitudes
## 📝 Ejemplos de Solicitudes

### GET /turnos (Listar todos)

**Solicitud:**
```bash
curl -X GET http://localhost:3000/turnos
Respuesta (200 OK):

[
  {
    "id": 1,
    "paciente": "Carlos López",
    "documento": "12345678",
    "especialidad": "Pediatría",
    "fecha": "2026-07-15",
    "hora": "10:00",
    "confirmado": true,
    "observaciones": "Paciente puntual"
  }
]
GET /turnos?especialidad=Pediatría (Filtrar por especialidad)
Solicitud:

curl -X GET "http://localhost:3000/turnos?especialidad=Pediatría"
Respuesta (200 OK):

[
  {
    "id": 1,
    "paciente": "Carlos López",
    "documento": "12345678",
    "especialidad": "Pediatría",
    "fecha": "2026-07-15",
    "hora": "10:00",
    "confirmado": true
  }
]
GET /turnos?fecha=2026-07-15&especialidad=Pediatría (Filtros múltiples)
Solicitud:

curl -X GET "http://localhost:3000/turnos?fecha=2026-07-15&especialidad=Pediatría"
Respuesta (200 OK):

[
  {
    "id": 1,
    "paciente": "Carlos López",
    "documento": "12345678",
    "especialidad": "Pediatría",
    "fecha": "2026-07-15",
    "hora": "10:00",
    "confirmado": true
  }
]
GET /turnos/:id (Obtener uno por ID)
Solicitud:

curl -X GET http://localhost:3000/turnos/1
Respuesta (200 OK):

{
  "id": 1,
  "paciente": "Carlos López",
  "documento": "12345678",
  "especialidad": "Pediatría",
  "fecha": "2026-07-15",
  "hora": "10:00",
  "confirmado": true,
  "observaciones": "Paciente puntual"
}
Respuesta (404 Not Found):

{
  "status": 404,
  "message": "Turno no encontrado",
  "code": "RESOURCE_NOT_FOUND",
  "details": [
    {
      "id": 9999,
      "mensaje": "El turno solicitado no existe"
    }
  ]
}
POST /turnos (Crear)
Solicitud:

curl -X POST http://localhost:3000/turnos \
  -H "Content-Type: application/json" \
  -d '{
    "id": 5,
    "paciente": "Juan Pérez",
    "documento": "55555555",
    "especialidad": "Clínica Médica",
    "fecha": "2026-08-10",
    "hora": "09:15"
  }'
Respuesta (201 Created):

{
  "id": 5,
  "paciente": "Juan Pérez",
  "documento": "55555555",
  "especialidad": "Clínica Médica",
  "fecha": "2026-08-10",
  "hora": "09:15",
  "confirmado": false
}
Respuesta (400 Bad Request - Validación fallida):

{
  "status": 400,
  "message": "Error de validación en los datos ingresados",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "campo": "especialidad",
      "mensaje": "Especialidad debe estar en Title Case (ej: Pediatría, Clínica Médica)",
      "tipo": "custom"
    }
  ]
}
PUT /turnos/:id (Actualizar)
Solicitud:

curl -X PUT http://localhost:3000/turnos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "paciente": "Carlos López",
    "documento": "12345678",
    "especialidad": "Odontología",
    "fecha": "2026-07-20",
    "hora": "15:00"
  }'
Respuesta (200 OK):

{
  "id": 1,
  "paciente": "Carlos López",
  "documento": "12345678",
  "especialidad": "Odontología",
  "fecha": "2026-07-20",
  "hora": "15:00",
  "confirmado": true
}
DELETE /turnos/:id (Eliminar)
Solicitud:

curl -X DELETE http://localhost:3000/turnos/1
Respuesta (204 No Content):

(sin contenido en el body)

GET /medicos (Listar todos)
Solicitud:

curl -X GET http://localhost:3000/medicos
Respuesta (200 OK):

[
  {
    "id": 1,
    "nombre": "Dr. López",
    "documento": "12345678",
    "especialidad": "Pediatría",
    "disponible": true
  },
  {
    "id": 2,
    "nombre": "Dra. García",
    "documento": "87654321",
    "especialidad": "Odontología",
    "disponible": true
  }
]
GET /medicos?especialidad=Pediatría (Filtrar por especialidad)
Solicitud:

curl -X GET "http://localhost:3000/medicos?especialidad=Pediatría"
Respuesta (200 OK):

[
  {
    "id": 1,
    "nombre": "Dr. López",
    "documento": "12345678",
    "especialidad": "Pediatría",
    "disponible": true
  }
]
GET /medicos?disponible=true (Filtrar por disponibilidad)
Solicitud:

curl -X GET "http://localhost:3000/medicos?disponible=true"
Respuesta (200 OK):

[
  {
    "id": 1,
    "nombre": "Dr. López",
    "documento": "12345678",
    "especialidad": "Pediatría",
    "disponible": true
  },
  {
    "id": 2,
    "nombre": "Dra. García",
    "documento": "87654321",
    "especialidad": "Odontología",
    "disponible": true
  }
]
GET /medicos?especialidad=Pediatría&disponible=true (Filtros múltiples)
Solicitud:

curl -X GET "http://localhost:3000/medicos?especialidad=Pediatría&disponible=true"
Respuesta (200 OK):

[
  {
    "id": 1,
    "nombre": "Dr. López",
    "documento": "12345678",
    "especialidad": "Pediatría",
    "disponible": true
  }
]
GET /medicos/:id (Obtener uno por ID)
Solicitud:

curl -X GET http://localhost:3000/medicos/1
Respuesta (200 OK):

{
  "id": 1,
  "nombre": "Dr. López",
  "documento": "12345678",
  "especialidad": "Pediatría",
  "disponible": true
}
POST /medicos (Crear)
Solicitud:

curl -X POST http://localhost:3000/medicos \
  -H "Content-Type: application/json" \
  -d '{
    "id": 5,
    "nombre": "Dra. Fernández",
    "documento": "66666666",
    "especialidad": "Nutrición",
    "disponible": true
  }'
Respuesta (201 Created):

{
  "id": 5,
  "nombre": "Dra. Fernández",
  "documento": "66666666",
  "especialidad": "Nutrición",
  "disponible": true
}
PUT /medicos/:id (Actualizar)
Solicitud:

curl -X PUT http://localhost:3000/medicos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "nombre": "Dr. López",
    "documento": "12345678",
    "especialidad": "Clínica Médica",
    "disponible": false
  }'
Respuesta (200 OK):

{
  "id": 1,
  "nombre": "Dr. López",
  "documento": "12345678",
  "especialidad": "Clínica Médica",
  "disponible": false
}
DELETE /medicos/:id (Eliminar)
Solicitud:

curl -X DELETE http://localhost:3000/medicos/1
Respuesta (204 No Content):

(sin contenido en el body)
Sección 3: Formato de Respuestas de Error
## ⚠️ Manejo de Errores

Todos los errores siguen una estructura uniforme JSON:

```json
{
  "status": <número HTTP>,
  "message": "<descripción del error>",
  "code": "<código de error>",
  "details": [<información adicional>]
}
Códigos de Error Comunes
Código	Estado HTTP	Descripción
VALIDATION_ERROR	400	Error en validación de datos (Zod)
RESOURCE_NOT_FOUND	404	Recurso no encontrado
RESOURCE_CONFLICT	409	Recurso ya existe (duplicado)
INTERNAL_SERVER_ERROR	500	Error interno del servidor
Ejemplos
400 Bad Request - Datos inválidos:

{
  "status": 400,
  "message": "Error de validación en los datos ingresados",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "campo": "especialidad",
      "mensaje": "Especialidad debe estar en Title Case",
      "tipo": "custom"
    }
  ]
}
404 Not Found - Recurso no existe:

{
  "status": 404,
  "message": "Turno no encontrado",
  "code": "RESOURCE_NOT_FOUND",
  "details": [
    {
      "id": 9999,
      "mensaje": "El turno solicitado no existe"
    }
  ]
}
409 Conflict - Recurso duplicado:

{
  "status": 409,
  "message": "El turno ya existe",
  "code": "RESOURCE_CONFLICT",
  "details": [
    {
      "id": 1,
      "mensaje": "Un turno con este ID ya está registrado"
    }
  ]
}

## 🧪 Pruebas con Postman

### Importar Colección

1. Abre Postman
2. Ve a **File → Import** (o Ctrl+O)
3. Selecciona el archivo `./turnos-red.postman_collection.json` desde la raíz del proyecto
4. La colección se importará con todas las solicitudes y tests automatizados

### Variables de Entorno

La colección incluye las siguientes variables de colección:
- `base_url` = `http://localhost:3000`
- `turno_id_creado` (se llena automáticamente después de POST /turnos)
- `medico_id_creado` (se llena automáticamente después de POST /medicos)

Estas variables permiten que las solicitudes se encadenen automáticamente.

### Mock Server (para pruebas sin servidor real)

URL del Mock Server: `https://ae66ffdf-ffbe-4e77-b757-26709091504c.mock.pstmn.io`

Puedes cambiar la variable `base_url` a esta URL para probar sin ejecutar tu servidor local.

### Estructura de la Colección
📁 Turnos (Colección Principal)
 │ ├── 📁 Flujo Completo de Turnos 
 │ ├── 1. POST /turnos (crear) 
 │ │ └── Tests: Verifica 201, guarda turno_id_creado 
 │ ├── 2. GET /turnos/:id (consultar) 
 │ │ └── Tests: Verifica 200, valida estructura 
 │ ├── 3. PUT /turnos/:id (actualizar) 
 │ │ └── Tests: Verifica 200, valida cambios 
 │ ├── 4. DELETE /turnos/:id (eliminar) 
 │ │ └── Tests: Verifica 204 
 │ └── 5. GET /turnos/:id (verifica eliminación) 
 │ └── Tests: Verifica 404 
 │ ├── 📁 Flujo Completo de Médicos 
 │ ├── 1. POST /medicos (crear) 
 │ │ └── Tests: Verifica 201, guarda medico_id_creado 
 │ ├── 2. GET /medicos/:id (consultar) 
 │ │ └── Tests: Verifica 200, valida estructura 
 │ ├── 3. PUT /medicos/:id (actualizar) 
 │ │ └── Tests: Verifica 200, valida cambios 
 │ ├── 4. DELETE /medicos/:id (eliminar) 
 │ │ └── Tests: Verifica 204 
 │ └── 5. GET /medicos/:id (verifica eliminación) 
 │ └── Tests: Verifica 404 
 │ ├── 📁 Casos de Error - Turnos 
 │ ├── GET /turnos/9999 (no existe) 
 │ ├── POST /turnos (datos inválidos) 
 │ ├── PUT /turnos/9999 (no existe) 
 │ └── DELETE /turnos/9999 (no existe) 
 │ ├── 📁 Casos de Error - Médicos 
 │ ├── GET /medicos/9999 (no existe) 
 │ ├── POST /medicos (datos inválidos) 
 │ ├── PUT /medicos/9999 (no existe) 
 │ └── DELETE /medicos/9999 (no existe) 
 └──Archivos de pruebas individuales (...)   

### Ejecutar un Flujo Completo

**Para probar el flujo de Turnos:**
1. En Postman, selecciona la carpeta **"Flujo Completo de Turnos"**
2. Haz clic en el botón **"▶ Run"** (o "Run collection")
3. Postman ejecuta las 5 solicitudes en orden automáticamente
4. Verás un resumen de qué tests pasaron ✅ y cuáles fallaron ❌

**Para probar el flujo de Médicos:**
1. En Postman, selecciona la carpeta **"Flujo Completo de Médicos"**
2. Haz clic en **"▶ Run"**
3. Observa los resultados

### Pruebas Incluidas

Cada solicitud tiene tests automatizados que verifican:
- ✅ Código de estado HTTP correcto (200, 201, 204, 400, 404)
- ✅ Estructura JSON de la respuesta
- ✅ Tipos de datos correctos (string, number, boolean)
- ✅ Campos obligatorios presentes
- ✅ Validaciones de Zod (Title Case, tipos)
- ✅ Encadenamiento de datos entre solicitudes

### Casos de Error Automatizados

La colección incluye pruebas de error que verifican:
- ❌ Recursos no encontrados (404)
- ❌ Datos inválidos (400 - validación de Zod)
- ❌ Duplicados (409 - conflicto)
- ❌ Estructura de error uniforme

### Documentación Adicional

Para más detalles sobre cómo usar Postman:
- [Documentación oficial de Postman](https://learning.postman.com/)
- [Trabajar con Tests en Postman](https://learning.postman.com/docs/writing-scripts/test-scripts/)
- [Automatizar flujos en Postman](https://learning.postman.com/docs/running-collections/intro-to-collection-runs/)

## 🤖 Tabla de Uso de IA

| # | Tarea | Herramienta | Prompt | Respuesta | Ajuste Manual |
|---|-------|-------------|--------|-----------|--------------|
| 1 | Estructura de capas (routes, controllers, services) | ChatGPT | "¿Cómo estructura un proyecto Node.js con arquitectura en capas?" | Patrón MVC con capas separadas en Express | Adaptación a TypeScript strict mode |
| 2 | Interfaz de Turno | ChatGPT | "Crea interfaz TypeScript para normalizar datos heterogéneos de turnos" | Interfaces Turno y TurnoCrudo | Ajuste de campos opcionales |
| 3 | Función normalizarTurno | ChatGPT | "Función que normalice datos de turnos con validación" | Función con conversión de tipos | Agregadas validaciones de ID positivo y espacios en blanco |
| 4 | Middleware errorHandler | ChatGPT | "Crea middleware de Express para manejar errores de forma uniforme en JSON" | errorHandler con estructura JSON | Integración con Zod y tipado correcto |
| 5 | Clase AppError | ChatGPT | "Crea clase de error personalizada que herede de Error con status, code y details" | Clase AppError | Validación de tipos para details array |
| 6 | asyncHandler wrapper | ChatGPT | "¿Cómo envolver controladores async en Express para capturar promesas rechazadas?" | Función que usa Promise.resolve().catch(next) | Agregada firma correcta de NextFunction |
| 7 | Validación con Zod (inicial) | ChatGPT | "Crea esquemas Zod para validar datos de turnos y médicos" | Esquemas turnoInputSchema y medicoInputSchema | Separación entre Input y Output schemas |
| 8 | Regex Title Case (v1) | Gemini | "Regex que valide Title Case con minúsculas después de primera mayúscula" | `/^[A-Z][a-záéíóúñ\s]*$/` | ❌ Falla: acepta "Pediatría" pero rechaza "Clínica Médica" |
| 9 | Regex Title Case (v2) | Claude | "Regex para Title Case con múltiples palabras, cada una iniciando con mayúscula" | `/^[A-Z][a-záéíóúñ]*(\s[A-Z][a-záéíóúñ]*)*$/` | ✅ Funciona correctamente |
| 10 | Middleware validateBody | ChatGPT | "Crea middleware factory que valide req.body con Zod y lance errores estructurados" | validateBody con try/catch para ZodError | Cambio de `error.errors` a `err.issues` |
| 11 | CRUD Médicos | ChatGPT | "Crea servicios CRUD para Médico, idénticos a Turno" | medicoService.ts completo | Adaptación de campos específicos (nombre, disponible) |
| 12 | Filtros Query Parameters | ChatGPT | "¿Cómo implementar filtros opcionales en GET con query params en Express?" | Función obtenerTurnosConFiltrosService | Filtros encadenados con verificación de !== undefined |
| 13 | Interfaz FiltrosTurnos | Manual | N/A | Interfaz con propiedades opcionales | Creada basándose en patrón |
| 14 | Interfaz FiltrosMedicos | Manual | N/A | Interfaz con propiedades opcionales | Creada basándose en patrón |
| 15 | Mock Server Postman | Postman (nativo) | N/A | URL generada automáticamente por Postman | Guardado de ejemplos en 8 solicitudes |
| 16 | Ejemplos de respuesta | Manual | N/A | Ejemplos JSON para cada endpoint | Validados en Postman |
| 17 | README.md | Manual | N/A | Documentación técnica completa | Estructura con secciones de endpoints, ejemplos y errores |
| 18 | Tabla de uso de IA | Manual | N/A | Este registro | Documentación del proceso de desarrollo |

---
