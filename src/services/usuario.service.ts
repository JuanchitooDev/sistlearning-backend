import Usuario from '../models/usuario.models'
import { IUsuario, UsuarioResponse } from '../interfaces/usuarioInterface'
import Trabajador from '../models/trabajador.models'
import Perfil from '../models/perfil.models'

class UsuarioService {
    async getUsuarios(): Promise<UsuarioResponse> {
        try {
            const usuarios = await Usuario.findAll({
                attributes: [
                    'id', 'username', 'id_trabajador', 'id_perfil'
                ],
                include: [
                    {
                        model: Trabajador,
                        attributes: ['id', 'numero_documento', 'apellido_paterno', 'apellido_materno', 'nombres']
                    },
                    {
                        model: Perfil,
                        attributes: ['id', 'nombre']
                    }
                ]
            })
            return { result: true, data: usuarios as IUsuario[] }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async getUsuarioById(id: number): Promise<UsuarioResponse> {
        try {
            const usuario = await Usuario.findByPk(id, {
                attributes: [
                    'id', 'username', 'id_trabajador', 'id_perfil'
                ],
                include: [
                    {
                        model: Trabajador,
                        attributes: ['id', 'numero_documento', 'apellido_paterno', 'apellido_materno', 'nombres']
                    },
                    {
                        model: Perfil,
                        attributes: ['id', 'nombre']
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
}

export default new UsuarioService()