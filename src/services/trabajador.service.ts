import Trabajador from '../models/trabajador.models'
import { ITrabajador, TrabajadorResponse } from '../interfaces/trabajadorInterface'
import Perfil from '../models/perfil.models';
import Cargo from '../models/cargo.models';
import TipoDocumento from '../models/tipoDocumento.models';

class TrabajadorService {
    async getTrabajadores(): Promise<TrabajadorResponse> {
        try {
            const trabajadores = await Trabajador.findAll({
                attributes: [
                    'id', 'id_perfil', 'id_cargo', 'id_tipodocumento', 'numero_documento', 'apellido_paterno', 'apellido_materno', 'nombres', 'telefono', 'direccion', 'email', 'linkedin', 'fecha_nacimiento', 'biografia', 'sexo', 'firma', 'foto_perfil', 'estado'
                ],
                include: [
                    {
                        model: Perfil,
                        attributes: ['id', 'nombre']
                    },
                    {
                        model: Cargo,
                        attributes: ['id', 'nombre']
                    },
                    {
                        model: TipoDocumento,
                        attributes: ['id', 'nombre']
                    }
                ]
            })
            return { result: true, data: trabajadores }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async getTrabajadorById(id: number): Promise<TrabajadorResponse> {
        try {
            const trabajador = await Trabajador.findByPk(id, {
                attributes: [
                    'id', 'id_perfil', 'id_cargo', 'id_tipodocumento', 'numero_documento', 'apellido_paterno', 'apellido_materno', 'nombres', 'telefono', 'direccion', 'email', 'linkedin', 'fecha_nacimiento', 'biografia', 'sexo', 'firma', 'foto_perfil', 'estado'
                ],
                include: [
                    {
                        model: Perfil,
                        attributes: ['id', 'nombre']
                    },
                    {
                        model: Cargo,
                        attributes: ['id', 'nombre']
                    },
                    {
                        model: TipoDocumento,
                        attributes: ['id', 'nombre']
                    }
                ]
            })
            if (!trabajador) {
                return { result: false, message: 'Trabajador no encontrado' }
            }
            return { result: true, data: trabajador }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async createTrabajador(data: ITrabajador): Promise<TrabajadorResponse> {
        try {
            const newTrabajador = await Trabajador.create(data as any)
            if (newTrabajador.id) {
                return { result: true, message: 'Trabajador registrado con éxito', data: newTrabajador }
            } else {
                return { result: true, message: 'Error al registrar el trabajador' }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async updateTrabajador(id: number, data: ITrabajador): Promise<TrabajadorResponse> {
        try {
            const trabajador = await Trabajador.findByPk(id)
            if (!trabajador) {
                return { result: false, message: 'Trabajador no encontrado' }
            }
            const updatedTrabajador = await trabajador.update(data)
            return { result: true, message: 'Trabajador actualizado con éxito', data: updatedTrabajador }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async deleteTrabajador(id: number): Promise<TrabajadorResponse> {
        try {
            const trabajador = await Trabajador.findByPk(id);
            if (!trabajador) {
                return { result: false, message: 'Trabajador no encontrado' };
            }
            await trabajador.destroy();
            return { result: true, data: { id }, message: 'Trabajador eliminado correctamente' };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage };
        }
    }
}

export default new TrabajadorService() 