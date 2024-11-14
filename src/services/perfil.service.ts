import Perfil from '../models/perfil.models'
import { IPerfil, PerfilResponse } from '../interfaces/perfilInterface'
import HString from '../helpers/HString';

class PerfilService {
    async getPerfiles(): Promise<PerfilResponse> {
        try {
            const perfiles = await Perfil.findAll({
                attributes: [
                    'id', 'nombre', 'nombre_url', 'sistema', 'estado'
                ]
            })
            return { result: true, data: perfiles }
        } catch (error) {
            // const msg = `Error al obtener los perfiles: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async getPerfilById(id: number): Promise<PerfilResponse> {
        try {
            const perfil = await Perfil.findByPk(id, {
                attributes: [
                    'id', 'nombre', 'nombre_url', 'sistema', 'estado'
                ]
            })

            if (!perfil) {
                return { result: false, message: 'Perfil no encontrado' }
            }
            return { result: true, data: perfil }
        } catch (error) {
            // const msg = `Error al obtener el perfil: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async createPerfil(data: IPerfil): Promise<PerfilResponse> {
        try {
            data.nombre_url = HString.convertToUrlString(data.nombre as String)
            const newPerfil = await Perfil.create(data as any)
            if (newPerfil.id) {
                return { result: true, message: 'Perfil registrado con éxito', data: newPerfil }
            } else {
                return { result: false, message: 'Error al registrar el perfil' }
            }
        } catch (error) {
            // const msg = `Error al crear el perfil: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async updatePerfil(id: number, data: IPerfil): Promise<PerfilResponse> {
        try {
            data.nombre_url = HString.convertToUrlString(data.nombre as String)
            
            const perfil = await Perfil.findByPk(id)
            
            if (!perfil) {
                return { result: false, message: 'Perfil no encontrado' }
            }
            
            const updatedPerfil = await perfil.update(data)
            
            return { result: true, message: 'Perfil actualizado con éxito', data: updatedPerfil }
        } catch (error) {
            // const msg = `Error al actualizar el perfil: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
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
            // const msg = `Error al eliminar el perfil: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg };
        }
    }
}

export default new PerfilService() 