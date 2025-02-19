import Perfil from '../models/perfil.models'
import { IPerfil, PerfilResponse } from '../interfaces/perfilInterface'
import HString from '../helpers/HString';

class PerfilService {
    async getPerfiles(): Promise<PerfilResponse> {
        try {
            const perfiles = await Perfil.findAll({
                attributes: [
                    'id',
                    'nombre',
                    'nombre_url',
                    'sistema',
                    'estado'
                ],
                order: [
                    ['nombre', 'ASC']
                ]
            })
            return { result: true, data: perfiles }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async getPerfilById(id: number): Promise<PerfilResponse> {
        try {
            const perfil = await Perfil.findByPk(id, {
                attributes: [
                    'id',
                    'nombre',
                    'nombre_url',
                    'sistema',
                    'estado'
                ]
            })

            if (!perfil) {
                return { result: false, message: 'Perfil no encontrado' }
            }
            return { result: true, data: perfil }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async createPerfil(data: IPerfil): Promise<PerfilResponse> {
        try {
            const existePerfil = await Perfil.findOne({
                where: {
                    nombre: data.nombre
                }
            })

            if (existePerfil) {
                return { result: false, message: 'El perfil ya existe' }
            }

            data.nombre_url = HString.convertToUrlString(data.nombre as String)
            const newPerfil = await Perfil.create(data as any)
            if (newPerfil.id) {
                return { result: true, message: 'Perfil registrado con éxito', data: newPerfil }
            } else {
                return { result: false, message: 'Error al registrar el perfil' }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async updatePerfil(id: number, data: IPerfil): Promise<PerfilResponse> {
        try {
            if (data.nombre) {
                data.nombre_url = HString.convertToUrlString(data.nombre as String)
            }

            const perfil = await Perfil.findByPk(id)

            if (!perfil) {
                return { result: false, message: 'Perfil no encontrado' }
            }

            const updatedPerfil = await perfil.update(data)

            return { result: true, message: 'Perfil actualizado con éxito', data: updatedPerfil }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async deletePerfil(id: number): Promise<PerfilResponse> {
        try {
            const perfil = await Perfil.findByPk(id);
            if (!perfil) {
                return { result: false, message: 'Perfil no encontrado' };
            }
            await perfil.destroy();
            return { result: true, data: { id }, message: 'Perfil eliminado correctamente' };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage };
        }
    }
}

export default new PerfilService() 