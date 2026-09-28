import {
    Paciente,
    PacienteCrudo,
  } from "../models/models.js";
  
  import {
    leerPacientes,
    guardarPacientes,
  } from "../fileServices.js";
  
  import { AppError } from "../utils/AppError.js";

  //Obtener todos los pacientes
  export async function obtenerTodosPacientesService(): Promise<Paciente[]> {
    return await leerPacientes();
  }


//Obtener pacientes por ID
  export async function obtenerPacientePorIdService(
    id: number
  ): Promise<Paciente> {
  
    const pacientes =
      await leerPacientes();
  
    const paciente = pacientes.find(
      p => p.id === id
    );
  
    if (!paciente) {
      throw new AppError(
        "Paciente no encontrado",
        404,
        "RESOURCE_NOT_FOUND",
        [
          {
            id,
            mensaje:
              "El paciente solicitado no existe",
          },
        ]
      );
    }
  
    return paciente;
  }

  //Crear paciente
  export async function crearPacienteService(
    datos: PacienteCrudo
  ): Promise<Paciente> {
  
    const pacientes =
      await leerPacientes();
  
    const dniExiste =
      pacientes.some(
        p => p.dni === datos.dni
      );
  
    if (dniExiste) {
      throw new AppError(
        "Ya existe un paciente con ese DNI",
        409,
        "RESOURCE_CONFLICT",
        [
          {
            dni: datos.dni,
            mensaje:
              "DNI ya registrado",
          },
        ]
      );
    }
  
    const nuevoId =
      pacientes.length > 0
        ? Math.max(
            ...pacientes.map(
              p => p.id
            )
          ) + 1
        : 1;
  
    const ahora = new Date();
  
    const nuevoPaciente: Paciente = {
      id: Number(datos.id),
  
      nombre:
        datos.nombre.trim(),
  
      apellido:
        datos.apellido.trim(),
  
      dni:
        String(datos.dni).trim(),
  
      fechaNacimiento:
        datos.fechaNacimiento,
  
      domicilio:
        datos.domicilio,
  
      email:
        datos.email.trim(),
  
      telefono:
        datos.telefono.trim(),
  
      obraSocial:
        datos.obraSocial,
  
      createdAt: ahora,
      updatedAt: ahora,
    };
  
    await guardarPacientes([
      ...pacientes,
      nuevoPaciente,
    ]);
  
    return nuevoPaciente;
  }

  //Actualizar paciente
  export async function actualizarPacienteService(
    id: number,
    datos: Partial<PacienteCrudo>
  ): Promise<Paciente> {
  
    const pacientes =
      await leerPacientes();
  
    const paciente =
      pacientes.find(
        p => p.id === id
      );
  
    if (!paciente) {
      throw new AppError(
        "Paciente no encontrado",
        404,
        "RESOURCE_NOT_FOUND",
        [
          {
            id,
            mensaje:
              "No existe un paciente con ese ID",
          },
        ]
      );
    }
  
    if (datos.dni) {
  
      const dniDuplicado =
        pacientes.some(
          p =>
            p.id !== id &&
            p.dni === datos.dni
        );
  
      if (dniDuplicado) {
        throw new AppError(
          "DNI duplicado",
          409,
          "RESOURCE_CONFLICT",
          [
            {
              dni: datos.dni,
              mensaje:
                "Otro paciente ya posee ese DNI",
            },
          ]
        );
      }
    }
  
    const pacienteActualizado: Paciente = {
      ...paciente,
  
      nombre:
        datos.nombre?.trim() ??
        paciente.nombre,
  
      apellido:
        datos.apellido?.trim() ??
        paciente.apellido,
  
      dni:
        datos.dni ??
        paciente.dni,
  
      fechaNacimiento:
        datos.fechaNacimiento ??
        paciente.fechaNacimiento,
  
      domicilio:
        datos.domicilio ??
        paciente.domicilio,
  
      email:
        datos.email?.trim() ??
        paciente.email,
  
      telefono:
        datos.telefono?.trim() ??
        paciente.telefono,
  
      obraSocial:
        datos.obraSocial ??
        paciente.obraSocial,
  
      updatedAt: new Date(),
    };
  
    const actualizados =
      pacientes.map(
        p =>
          p.id === id
            ? pacienteActualizado
            : p
      );
  
    await guardarPacientes(
      actualizados
    );
  
    return pacienteActualizado;
  }

  //Eliminar paciente
  export async function eliminarPacienteService(
    id: number
  ): Promise<{ id: number }> {
  
    const pacientes =
      await leerPacientes();
  
    const existe =
      pacientes.some(
        p => p.id === id
      );
  
    if (!existe) {
      throw new AppError(
        "Paciente no encontrado",
        404,
        "RESOURCE_NOT_FOUND",
        [
          {
            id,
            mensaje:
              "No existe un paciente con ese ID",
          },
        ]
      );
    }
  
    const actualizados =
      pacientes.filter(
        p => p.id !== id
      );
  
    await guardarPacientes(
      actualizados
    );
  
    return { id };
  }