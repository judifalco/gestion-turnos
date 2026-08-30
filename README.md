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
Edita .env con tus valores (generalmente no necesita cambios para desarrollo local).

4. Compilar TypeScript
npm run build
5. Ejecutar el servidor
Modo desarrollo (con recarga automática):

npm run dev
Modo producción (desde código compilado):

npm run build
npm start
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