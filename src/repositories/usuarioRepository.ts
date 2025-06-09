import { IUsuario, UsuarioResponse } from "../interfaces/usuarioInterface";
import Usuario from "../models/usuario.models"
import Trabajador from "../models/trabajador.models"
import Instructor from "../models/instructor.models";
import Alumno from "../models/alumno.models";
import Perfil from "../models/perfil.models"
import bcrypt from 'bcryptjs';

class UsuarioRepository {
    async getAll(): Promise<UsuarioResponse> {
        try {
            const usuarios = await Usuario.findAll({
                attributes: [
                    'id',
                    'id_trabajador',
                    'id_instructor',
                    'id_alumno',
                    'id_perfil',
                    'username',
                    'estado'
                ],
                include: [
                    {
                        model: Trabajador,
                        attributes: [
                            'id',
                            'numero_documento',
                            'apellido_paterno',
                            'apellido_materno',
                            'nombres'
                        ]
                    },
                    {
                        model: Instructor,
                        attributes: [
                            'id',
                            'numero_documento',
                            'apellido_paterno',
                            'apellido_materno',
                            'nombres'
                        ]
                    },
                    {
                        model: Alumno,
                        attributes: [
                            'id',
                            'numero_documento',
                            'apellido_paterno',
                            'apellido_materno',
                            'nombres'
                        ]
                    },
                    {
                        model: Perfil,
                        attributes: [
                            'id',
                            'nombre'
                        ]
                    }
                ],
                order: [
                    ['username', 'ASC']
                ]
            })

            return { result: true, data: usuarios as IUsuario[], status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllByEstado(estado: boolean): Promise<UsuarioResponse> {
        try {
            const usuarios = await Usuario.findAll({
                where: {
                    activo: estado
                },
                attributes: [
                    'id',
                    'id_trabajador',
                    'id_instructor',
                    'id_alumno',
                    'id_perfil',
                    'username',
                    'estado'
                ],
                include: [
                    {
                        model: Trabajador,
                        attributes: [
                            'id',
                            'numero_documento',
                            'apellido_paterno',
                            'apellido_materno',
                            'nombres'
                        ]
                    },
                    {
                        model: Instructor,
                        attributes: [
                            'id',
                            'numero_documento',
                            'apellido_paterno',
                            'apellido_materno',
                            'nombres'
                        ]
                    },
                    {
                        model: Alumno,
                        attributes: [
                            'id',
                            'numero_documento',
                            'apellido_paterno',
                            'apellido_materno',
                            'nombres'
                        ]
                    },
                    {
                        model: Perfil,
                        attributes: [
                            'id',
                            'nombre'
                        ]
                    }
                ],
                order: [
                    ['id', 'DESC']
                ]
            })

            return { result: true, data: usuarios as IUsuario[], status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getById(id: number): Promise<UsuarioResponse> {
        try {
            const usuario = await Usuario.findByPk(id, {
                attributes: [
                    'id',
                    'id_trabajador',
                    'id_instructor',
                    'id_alumno',
                    'id_perfil',
                    'username',
                    'estado'
                ],
                include: [
                    {
                        model: Trabajador,
                        attributes: [
                            'id',
                            'numero_documento',
                            'apellido_paterno',
                            'apellido_materno',
                            'nombres'
                        ]
                    },
                    {
                        model: Instructor,
                        attributes: [
                            'id',
                            'numero_documento',
                            'apellido_paterno',
                            'apellido_materno',
                            'nombres'
                        ]
                    },
                    {
                        model: Alumno,
                        attributes: [
                            'id',
                            'numero_documento',
                            'apellido_paterno',
                            'apellido_materno',
                            'nombres'
                        ]
                    },
                    {
                        model: Perfil,
                        attributes: [
                            'id',
                            'nombre'
                        ]
                    }
                ],
            })
            if (!usuario) {
                return { result: false, data: [], message: 'Usuario no encontrado', status: 200 }
            }
            return { result: true, data: usuario as IUsuario, message: 'Usuario encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async create(data: IUsuario): Promise<UsuarioResponse> {
        try {
            const password = data.password as string
            const hashedPassword = await bcrypt.hash(password, 10)
            data.password = hashedPassword

            let newUsuario = await Usuario.create(data as any)

            if (newUsuario.id) {
                return { result: true, message: 'Usuario registrado con éxito', data: newUsuario as IUsuario, status: 200 }
            }

            return { result: false, message: 'Error al registrar al usuario', data: [], status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async update(id: number, data: IUsuario): Promise<UsuarioResponse> {
        try {
            const usuario = await Usuario.findByPk(id)

            if (!usuario) {
                return { result: false, data: [], message: 'Usuario no encontrado', status: 200 }
            }

            const updatedUsuario = await usuario.update(data)

            return { result: true, data: updatedUsuario as IUsuario, message: 'Usuario actualizado con éxito', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async updateEstado(id: number, estado: boolean): Promise<UsuarioResponse> {
        try {
            const usuario = await Usuario.findByPk(id)

            if (!usuario) {
                return { result: false, data: [], message: 'Usuario no encontrado', status: 200 }
            }

            usuario.estado = estado
            await usuario.save()

            return { result: true, data: usuario as IUsuario, message: 'Usuario actualizado con éxito', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async delete(id: number): Promise<UsuarioResponse> {
        try {
            const usuario = await Usuario.findByPk(id);

            if (!usuario) {
                return { result: false, data: [], message: 'Usuario no encontrado', status: 200 };
            }

            await usuario.destroy();

            return { result: true, data: { id }, message: 'Usuario eliminado correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new UsuarioRepository()