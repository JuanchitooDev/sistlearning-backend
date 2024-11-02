import Alumno from '../models/alumno.models'
import { IAlumno, AlumnoResponse } from '../interfaces/alumnoInterface'
import TipoDocumento from '../models/tipoDocumento.models';
import Pais from '../models/pais.models';
import Departamento from '../models/departamento.models';

class AlumnoService {
    async getAlumnos(): Promise<AlumnoResponse> {
        try {
            const alumnos = await Alumno.findAll({
                include: [{
                    model: TipoDocumento,
                    attributes: ['id', 'nombre', 'abreviatura']
                }, {
                    model: Pais,
                    attributes: ['id', 'nombre']
                }, {
                    model: Departamento,
                    attributes: ['id', 'nombre']
                }]
            })
            return { result: true, data: alumnos }
        } catch (error) {
            // const msg = `Error al obtener los alumnos: ${error.message}`
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async getAlumnoById(id: number): Promise<AlumnoResponse> {
        try {
            const alumno = await Alumno.findByPk(id, {
                include: [{
                    model: TipoDocumento,
                    attributes: ['id', 'nombre', 'abreviatura']
                }, {
                    model: Pais,
                    attributes: ['id', 'nombre']
                }, {
                    model: Departamento,
                    attributes: ['id', 'nombre']
                }]
            })
            if (!alumno) {
                return { result: false, error: 'Alumno no encontrado' }
            }
            return { result: true, data: alumno }
        } catch (error) {
            // const msg = `Error al obtener el alumno: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async createAlumno(data: IAlumno): Promise<AlumnoResponse> {
        try {
            const newAlumno = await Alumno.create(data as any)
            return { result: true, data: newAlumno }
        } catch (error) {
            // const msg = `Error al crear el alumno: ${error.message}`
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async updateAlumno(id: number, data: IAlumno): Promise<AlumnoResponse> {
        try {
            const alumno = await Alumno.findByPk(id)
            if (!alumno) {
                return { result: false, error: 'Alumno no encontrado' }
            }
            const updatedAlumno = await alumno.update(data)
            return { result: true, data: updatedAlumno }
        } catch (error) {
            // const msg = `Error al actualizar el alumno: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async deleteAlumno(id: number): Promise<AlumnoResponse> {
        try {
            const alumno = await Alumno.findByPk(id);
            if (!alumno) {
                return { result: false, error: 'Alumno no encontrado' };
            }
            await alumno.destroy();
            return { result: true, data: { id } };
        } catch (error) {
            // const msg = `Error al eliminar el alumno: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg };
        }
    }
}

export default new AlumnoService() 