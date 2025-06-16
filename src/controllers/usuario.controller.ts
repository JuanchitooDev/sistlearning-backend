import { Request, Response } from "express"
import UsuarioService from "../services/usuario.service"
import AlumnoService from "../services/alumno.service"
import { IUsuario } from '../interfaces/usuarioInterface'
import { IAlumno } from "../interfaces/alumnoInterface"
import Perfil from "../models/perfil.models"
import { ITemporal } from "../interfaces/temporalInterface"
import Temporal from "../models/temporal.models"

class UsuarioController {
    async getUsuarios(req: Request, res: Response) {
        const response = await UsuarioService.getUsuarios()

        const { result } = response

        if (result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }

    async getUsuariosPorEstado(req: Request, res: Response) {
        const { estado } = req.params

        const estadoParam: boolean = estado === 'true'

        const response = await UsuarioService.getUsuariosPorEstado(estadoParam)

        const { result, error } = response

        if (result) {
            res.status(200).json(response)
        } else {
            if (error) {
                res.status(500).json(response)
            } else {
                res.status(200).json(response)
            }
        }
    }

    async getUsuarioPorId(req: Request, res: Response) {
        const { id } = req.params

        const response = await UsuarioService.getUsuarioPorId(+id)

        const { result, error } = response

        if (result) {
            res.status(200).json(response)
        } else {
            if (error) {
                res.status(500).json(response)
            } else {
                res.status(200).json(response)
            }
        }
    }

    async createUsuario(req: Request, res: Response) {
        const response = await UsuarioService.createUsuario(req.body);

        const { result, error } = response

        if (result) {
            res.status(201).json(response);
        } else {
            if (error) {
                res.status(500).json(response);
            } else {
                res.status(200).json(response);
            }
        }
    }

    async updateUsuario(req: Request, res: Response) {
        const { id } = req.params;

        const response = await UsuarioService.updateUsuario(+id, req.body);

        const { result, error } = response

        if (result) {
            res.status(200).json(response);
        } else {
            if (error) {
                res.status(500).json(response);
            } else {
                res.status(200).json(response);
            }
        }
    }

    async updateEstado(req: Request, res: Response) {
        const { id } = req.params

        const { estado } = req.body

        if (typeof estado !== 'boolean') {
            res.status(400).json({
                result: false,
                message: 'Tipo de dato incorrecto'
            })
        }

        const response = await UsuarioService.updateEstado(+id, estado)

        const { result, error } = response

        if (result) {
            res.status(200).json(response)
        } else {
            if (error) {
                res.status(500).json(response)
            } else {
                res.status(200).json(response)
            }
        }
    }

    async deleteUsuario(req: Request, res: Response) {
        const { id } = req.params;

        const response = await UsuarioService.deleteUsuario(+id);

        const { result, error } = response

        if (result) {
            res.status(200).json(response);
        } else {
            if (error) {
                res.status(500).json(response);
            } else {
                res.status(200).json(response);
            }
        }
    }

    async loadData(req: Request, res: Response) {
        const documentos: { id_tipodocumento: number, numero_documento: string, perfil: string }[] = req.body

        if (!Array.isArray(documentos)) {
            res.status(400).json(
                {
                    result: false,
                    message: 'El parámetro debe ser un arreglo'
                }
            )
        }

        const resultados = []

        for (const doc of documentos) {
            const { id_tipodocumento, numero_documento, perfil } = doc

            try {

                // Obteniendo la respuesta de consultar un alumno por tipo de documento y número de documento
                const responseAlumnoExiste = await AlumnoService.getAlumnoPorIdTipoDocNumDoc(id_tipodocumento, numero_documento)

                const { result, data } = responseAlumnoExiste

                // Validando si existe un alumno
                if (result && data) {
                    const { id } = data as IAlumno

                    const idAlumno = id as number

                    // Obteniendo la respuesta de consultar un usuario por alumno y perfil
                    const responseUsuarioExiste = await UsuarioService.getUsuarioPorIdAlumnoPerfil(idAlumno, perfil)

                    // Validando si existe un usuario
                    if (!responseUsuarioExiste.result) {
                        let usuario: IUsuario = {}

                        const getPerfil = await Perfil.findOne({
                            where: {
                                nombre: perfil
                            }
                        })

                        if (!getPerfil) {
                            continue
                        }

                        usuario.id_perfil = getPerfil.id

                        if (perfil === 'Estudiante') {
                            usuario.id_alumno = id
                        } else if (perfil === 'Instructor') {
                            usuario.id_instructor = id
                        } else if (perfil === 'Administrador') {
                            usuario.id_trabajador = id
                        }

                        // Obteniendo una respuesta del registro de un usuario
                        const responseUsuarioCreate = await UsuarioService.createUsuario(usuario)

                        // Validando respuesta
                        if (responseUsuarioCreate.result) {
                            resultados.push(
                                {
                                    id_tipodocumento,
                                    numero_documento,
                                    tabla: "usuario",
                                    status: "Creado"
                                }
                            )
                        } else {
                            const dataTemporal: ITemporal = {
                                id_usuario: id,
                                id_perfil: getPerfil.id,
                                id_tipodocumento,
                                numero_documento,
                                tabla: "usuario"
                            }

                            await Temporal.create(dataTemporal as any)

                            resultados.push(
                                {
                                    id_tipodocumento,
                                    numero_documento,
                                    tabla: "usuario",
                                    status: "Error al crear. Insertado en temporal"
                                }
                            )
                        }
                    } else {
                        resultados.push(
                            {
                                id_tipodocumento,
                                numero_documento,
                                tabla: "usuario",
                                status: "Ya existe"
                            }
                        )
                        continue
                    }

                }
            } catch (error) {
                await Temporal.create(
                    {
                        id_tipodocumento,
                        numero_documento,
                        tabla: 'usuario'
                    }
                )

                resultados.push(
                    {
                        numero_documento,
                        tabla: "usuario",
                        status: "Error inesperado. Insertado en temporal"
                    }
                )
            }
        }

        res.status(200).json(
            {
                result: true,
                data: resultados
            }
        )
    }
}

export default new UsuarioController()