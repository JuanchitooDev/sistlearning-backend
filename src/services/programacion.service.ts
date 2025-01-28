import Programacion from '../models/programacion.models'
import { IProgramacion, ProgramacionResponse } from '../interfaces/programacionInterface'
import Trabajador from '../models/trabajador.models';
import Evento from '../models/evento.models';

class ProgramacionService {
    async getProgramaciones(): Promise<ProgramacionResponse> {
        try {
            const programaciones = await Programacion.findAll({
                attributes: [
                    'id',
                    'id_trabajador',
                    'id_evento',
                    'descripcion',
                    'enlace',
                    'fecha_inicio',
                    'fecha_final',
                    'fecha_registro',
                    'fecha_reprograma',
                    'fecha_cancela',
                    'estado'
                ],
                include: [
                    {
                        model: Trabajador,
                        attributes: ['id', 'apellido_paterno', 'apellido_materno', 'nombres']
                    },
                    {
                        model: Evento,
                        attributes: ['id', 'titulo']
                    }
                ],
                order: [
                    ['fecha_inicio', 'ASC']
                ]
            })
            return { result: true, data: programaciones }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async getProgramacionById(id: number): Promise<ProgramacionResponse> {
        try {
            const programacion = await Programacion.findByPk(id, {
                attributes: [
                    'id',
                    'id_trabajador',
                    'id_evento',
                    'descripcion',
                    'enlace',
                    'fecha_inicio',
                    'fecha_final',
                    'fecha_registro',
                    'fecha_reprograma',
                    'fecha_cancela',
                    'estado'
                ],
                include: [
                    {
                        model: Trabajador,
                        attributes: ['id', 'apellido_paterno', 'apellido_materno', 'nombres']
                    },
                    {
                        model: Evento,
                        attributes: ['id', 'titulo']
                    }
                ]
            })
            if (!programacion) {
                return { result: false, message: 'Programación no encontrada' }
            }
            return { result: true, data: programacion }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async createProgramacion(data: IProgramacion): Promise<ProgramacionResponse> {
        try {
            const newProgramacion = await Programacion.create(data as any)

            if (newProgramacion.id) {
                return { result: true, message: 'Programación registrada con éxito', data: newProgramacion }
            } else {
                return { result: false, message: 'Error al registrar la programación' }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async updateProgramacion(id: number, data: IProgramacion): Promise<ProgramacionResponse> {
        try {
            const programacion = await Programacion.findByPk(id)
            if (!programacion) {
                return { result: false, message: 'Programación no encontrada' }
            }
            const updatedProgramacion = await programacion.update(data)
            return { result: true, message: 'Programación actualizada con éxito', data: updatedProgramacion }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async deleteProgramacion(id: number): Promise<ProgramacionResponse> {
        try {
            const programacion = await Programacion.findByPk(id);
            if (!programacion) {
                return { result: false, message: 'Programación no encontrada' };
            }
            await programacion.destroy();
            return { result: true, data: { id }, message: 'Programación eliminada correctamente' };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage };
        }
    }
}

export default new ProgramacionService() 