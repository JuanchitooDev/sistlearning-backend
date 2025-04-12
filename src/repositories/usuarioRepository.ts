import { IUsuario, UsuarioResponse } from "@/interfaces/usuarioInterface";
import Usuario from "@/models/usuario.models"
import Trabajador from "@/models/trabajador.models"
import Perfil from "@/models/perfil.models"
import bcrypt from 'bcryptjs';

class UsuarioRepository {
    async getAll(): Promise<UsuarioResponse> {
        try {
            const usuarios = await Usuario.findAll({
                attributes: [
                    'id',
                    'username',
                    'id_trabajador',
                    'id_perfil'
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
            return { result: true, data: usuarios as IUsuario[] }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async getById(id: number): Promise<UsuarioResponse> {
        try {
            const usuario = await Usuario.findByPk(id, {
                attributes: [
                    'id',
                    'username',
                    'id_trabajador',
                    'id_perfil'
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
                        model: Perfil,
                        attributes: [
                            'id',
                            'nombre'
                        ]
                    }
                ]
            })
            if (!usuario) {
                return { result: false, message: 'Usuario no encontrado' }
            }
            return { result: true, data: usuario as IUsuario }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async create(data: IUsuario): Promise<UsuarioResponse> {
        try {
            const existingUser = await Usuario.findOne(
                {
                    where: {
                        username: data.username
                    }
                }
            )

            if (existingUser) {
                return { result: false, error: 'El usuario ya existe' }
            }

            const hashedPassword = await bcrypt.hash(data.password as string, 10)

            const newUser = await Usuario.create({
                username: data.username,
                password: hashedPassword
            })

            return { result: true, message: 'Usuario registrado correctamente', data: newUser as IUsuario }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }
}

export default new UsuarioRepository()