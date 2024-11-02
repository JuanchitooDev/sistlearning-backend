import Programacion from '../models/programacion.models'
import { IProgramacion, ProgramacionResponse } from '../interfaces/programacionInterface'
import Trabajador from '../models/trabajador.models';
import Evento from '../models/evento.models';

class ProgramacionService {
    async getProgramaciones(): Promise<ProgramacionResponse> {
        try {
            const programaciones = await Programacion.findAll({
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
            return { result: true, data: programaciones }
        } catch (error) {
            // const msg = `Error al obtener los eventos: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async getProgramacionById(id: number): Promise<ProgramacionResponse> {
        try {
            const programacion = await Programacion.findByPk(id, {
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
                return { result: false, error: 'Programacion no encontrado' }
            }
            return { result: true, data: programacion }
        } catch (error) {
            // const msg = `Error al obtener el evento: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async createProgramacion(data: IProgramacion): Promise<ProgramacionResponse> {
        try {
            const newProgramacion = await Programacion.create(data as any)
            return { result: true, data: newProgramacion }
        } catch (error) {
            // const msg = `Error al crear el evento: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async updateProgramacion(id: number, data: IProgramacion): Promise<ProgramacionResponse> {
        try {
            const programacion = await Programacion.findByPk(id)
            if (!programacion) {
                return { result: false, error: 'Programación no encontrada' }
            }
            const updatedProgramacion = await programacion.update(data)
            return { result: true, data: updatedProgramacion }
        } catch (error) {
            // const msg = `Error al actualizar el evento: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async deleteProgramacion(id: number): Promise<ProgramacionResponse> {
        try {
            const programacion = await Programacion.findByPk(id);
            if (!programacion) {
                return { result: false, error: 'Programación no encontrada' };
            }
            await programacion.destroy();
            return { result: true, data: { id } };
        } catch (error) {
            // const msg = `Error al eliminar el evento: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg };
        }
    }
}

export default new ProgramacionService() 