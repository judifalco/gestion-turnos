import { Request, Response, NextFunction } from "express";

import {
  obtenerTodosPacientesService,
  obtenerPacientePorIdService,
  crearPacienteService,
  actualizarPacienteService,
  eliminarPacienteService,
} from "../services/pacienteService.js";

import {
  pacienteInputSchema,
  pacienteUpdateSchema,
} from "../schemas/pacienteSchema.js";

//GET Pacientes
export async function obtenerTodosPacientesController(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response> {
    try {
      const pacientes =
        await obtenerTodosPacientesService();
  
      return res.status(200).json({
        status: 200,
        message: "Pacientes obtenidos correctamente",
        data: pacientes,
      });
    } catch (error: any) {
      return res.status(error.status || 500).json({
        status: error.status || 500,
        message:
          error.message ||
          "Error interno del servidor",
        code:
          error.code ||
          "INTERNAL_SERVER_ERROR",
        details: error.details || [],
        data: null,
      });
    }
  }

  //GET Pacientes:id
  export async function obtenerPacientePorIdController(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response> {
  
    try {
  
      const id = Number(req.params.id);
  
      if (
        Number.isNaN(id) ||
        id <= 0
      ) {
        return res.status(400).json({
          status: 400,
          message:
            "El ID debe ser un número positivo",
        });
      }
  
      const paciente =
        await obtenerPacientePorIdService(id);
  
      return res.status(200).json({
        status: 200,
        message:
          "Paciente obtenido correctamente",
        data: paciente,
      });
  
    } catch (error: any) {
  
      return res.status(error.status || 500).json({
        status: error.status || 500,
        message:
          error.message ||
          "Error interno del servidor",
        code:
          error.code ||
          "INTERNAL_SERVER_ERROR",
        details: error.details || [],
        data: null,
      });
  
    }
  }

  // POST /pacientes
  export async function crearPacienteController(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response> {
  
    try {
  
      const resultado =
        pacienteInputSchema.safeParse(
          req.body
        );
  
      if (!resultado.success) {
  
        return res.status(400).json({
          status: 400,
          message:
            resultado.error.issues[0].message,
        });
  
      }
  
      const nuevoPaciente =
        await crearPacienteService(
          resultado.data
        );
  
      return res.status(201).json({
        status: 201,
        message:
          "Paciente creado correctamente",
        data: nuevoPaciente,
      });
  
    } catch (error: any) {
  
      return res.status(error.status || 500).json({
        status: error.status || 500,
        message:
          error.message ||
          "Error interno del servidor",
        code:
          error.code ||
          "INTERNAL_SERVER_ERROR",
        details: error.details || [],
        data: null,
      });
  
    }
  }

  //PUT Pacientes:id
  export async function actualizarPacienteController(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response> {
  
    try {
  
      const id = Number(req.params.id);
  
      if (
        Number.isNaN(id) ||
        id <= 0
      ) {
        return res.status(400).json({
          status: 400,
          message:
            "El ID debe ser un número positivo",
        });
      }
  
      const resultado =
        pacienteUpdateSchema.safeParse(
          req.body
        );
  
      if (!resultado.success) {
  
        return res.status(400).json({
          status: 400,
          message:
            resultado.error.issues[0].message,
        });
  
      }
  
      const pacienteActualizado =
        await actualizarPacienteService(
          id,
          resultado.data
        );
  
      return res.status(200).json({
        status: 200,
        message:
          "Paciente actualizado correctamente",
        data: pacienteActualizado,
      });
  
    } catch (error: any) {
  
      return res.status(error.status || 500).json({
        status: error.status || 500,
        message:
          error.message ||
          "Error interno del servidor",
        code:
          error.code ||
          "INTERNAL_SERVER_ERROR",
        details: error.details || [],
        data: null,
      });
  
    }
  }

  //Delete Pacientes:id
  export async function eliminarPacienteController(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response> {
  
    try {
  
      const id = Number(req.params.id);
  
      if (
        Number.isNaN(id) ||
        id <= 0
      ) {
  
        return res.status(400).json({
          status: 400,
          message:
            "El ID debe ser un número positivo",
        });
  
      }
  
      await eliminarPacienteService(id);
  
      return res.status(204).send();
  
    } catch (error: any) {
  
      return res.status(error.status || 500).json({
        status: error.status || 500,
        message:
          error.message ||
          "Error interno del servidor",
        code:
          error.code ||
          "INTERNAL_SERVER_ERROR",
        details: error.details || [],
        data: null,
      });
  
    }
  
  }