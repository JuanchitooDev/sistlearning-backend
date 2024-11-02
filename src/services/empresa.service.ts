import Empresa from '../models/empresa.models';
import { IEmpresa, EmpresaResponse } from '../interfaces/empresaInterface'

class EmpresaService {
    async getEmpresas(): Promise<EmpresaResponse> {
        try {
            const empresas = await Empresa.findAll()
            return { result: true, data: empresas }
        } catch (error) {
            // const msg = `Error al obtener las empresas: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async getEmpresaById(id: number): Promise<EmpresaResponse> {
        try {
            const empresa = await Empresa.findByPk(id)
            if (!empresa) {
                return { result: false, error: 'Empresa no encontrada' }
            }
            return { result: true, data: empresa }
        } catch (error) {
            // const msg = `Error al obtener la empresa: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async createEmpresa(data: IEmpresa): Promise<EmpresaResponse> {
        try {
            const newEmpresa = await Empresa.create(data as any)
            return { result: true, data: newEmpresa }
        } catch (error) {
            // const msg = `Error al crear la empresa: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async updateEmpresa(id: number, data: IEmpresa): Promise<EmpresaResponse> {
        try {
            const empresa = await Empresa.findByPk(id)
            if (!empresa) {
                return { result: false, error: 'Empresa no encontrada' }
            }
            const updatedEmpresa = await empresa.update(data)
            return { result: true, data: updatedEmpresa }
        } catch (error) {
            // const msg = `Error al actualizar la empresa: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async deleteEmpresa(id: number): Promise<EmpresaResponse> {
        try {
            const empresa = await Empresa.findByPk(id);
            if (!empresa) {
                return { result: false, error: 'Empresa no encontrada' };
            }
            await empresa.destroy();
            return { result: true, data: { id } };
        } catch (error) {
            // const msg = `Error al eliminar la empresa: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg };
        }
    }
}

export default new EmpresaService() 