import Matricula from '../models/matricula.models'
import { IMatricula, MatriculaResponse } from '../interfaces/matriculaInterface'
import Alumno from '../models/alumno.models';
import Evento from '../models/evento.models';

class MatriculaService {
    async getMatriculas(): Promise<MatriculaResponse> {
        try {
            const matriculas = await Matricula.findAll({
                attributes: [
                    'id', 'id_alumno', 'id_evento', 'subtotal', 'igv', 'total', 'moneda', 'fecha_pago', 'forma_pago', 'tipo_pago', 'nro_voucher', 'nro_deposito', 'imagen_pago', 'acuenta', 'saldo', 'estado_pago', 'estado'
                ],
                include: [
                    {
                        model: Alumno,
                        attributes: ['id', 'apellido_paterno', 'apellido_materno', 'nombres']
                    },
                    {
                        model: Evento,
                        attributes: ['id', 'titulo']
                    }
                ]
            })
            return { result: true, data: matriculas }
        } catch (error) {
            // const msg = `Error al obtener los eventos: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async getMatriculaById(id: number): Promise<MatriculaResponse> {
        try {
            const matricula = await Matricula.findByPk(id, {
                attributes: [
                    'id', 'id_alumno', 'id_evento', 'subtotal', 'igv', 'total', 'moneda', 'fecha_pago', 'forma_pago', 'tipo_pago', 'nro_voucher', 'nro_deposito', 'imagen_pago', 'acuenta', 'saldo', 'estado_pago', 'estado'
                ],
                include: [
                    {
                        model: Alumno,
                        attributes: ['id', 'apellido_paterno', 'apellido_materno', 'nombres']
                    },
                    {
                        model: Evento,
                        attributes: ['id', 'titulo']
                    }
                ]
            })
            if (!matricula) {
                return { result: false, message: 'Matrícula no encontrada' }
            }
            return { result: true, data: matricula }
        } catch (error) {
            // const msg = `Error al obtener el evento: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async createMatricula(data: IMatricula): Promise<MatriculaResponse> {
        try {
            const newMatricula = await Matricula.create(data as any)
            
            if (newMatricula.id) {
                return { result: true, message: 'Matrícula registrado con éxito', data: newMatricula }
            } else {
                return { result: false, message: 'Error al registrar la matrícula' }
            }
        } catch (error) {
            // const msg = `Error al crear el evento: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async updateMatricula(id: number, data: IMatricula): Promise<MatriculaResponse> {
        try {
            const matricula = await Matricula.findByPk(id)
            if (!matricula) {
                return { result: false, message: 'Matrícula no encontrada' }
            }
            const updatedMatricula = await matricula.update(data)
            return { result: true, message: 'Matrícula actualizada con éxito', data: updatedMatricula }
        } catch (error) {
            // const msg = `Error al actualizar el evento: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async deleteMatricula(id: number): Promise<MatriculaResponse> {
        try {
            const matricula = await Matricula.findByPk(id);
            if (!matricula) {
                return { result: false, message: 'Matrícula no encontrada' };
            }
            await matricula.destroy();
            return { result: true, data: { id }, message: 'Matrícula eliminada correctamente' };
        } catch (error) {
            // const msg = `Error al eliminar el evento: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg };
        }
    }
}

export default new MatriculaService() 