import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import turnosRouter from "./routes/turnos.js";
import { turnoEmitter } from "./events/turnoEmitter.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Conectar las rutas
app.use("/turnos", turnosRouter);


//Uso de public
app.use(express.static("public"));

//Manejar conexiones de Socket.IO
io.on("connection", (socket) => {
    console.log(`✅ Cliente conectado: ${socket.id}`);
  
    socket.on("disconnect", () => {
      console.log(`❌ Cliente desconectado: ${socket.id}`);
    });
  });
  
// Conectar EventEmitter con Socket.IO
turnoEmitter.on("turno:creado", (turno) => {
    console.log(`📢 [EVENTO] Turno creado: ${turno.paciente} (ID: ${turno.id})`);
    io.emit("turno:creado", turno);
  });
  
  turnoEmitter.on("turno:actualizado", (turno) => {
    console.log(`📢 [EVENTO] Turno actualizado: ${turno.paciente} (ID: ${turno.id})`);
    io.emit("turno:actualizado", turno);
  });
  
  turnoEmitter.on("turno:eliminado", (data) => {
    console.log(`📢 [EVENTO] Turno eliminado: ID ${data.id}`);
    io.emit("turno:eliminado", data);
  });
  
// Middleware de errores
app.use(errorHandler);

// Iniciar el servidor
httpServer.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  });