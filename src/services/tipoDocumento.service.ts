import TipoDocumento from '../models/tipoDocumento.models'
import { ITipoDocumento, TipoDocumentoResponse } from '../interfaces/tipoDocumentoInterface'
import HString from '../helpers/HString';

class TipoDocumentoService {
    async getTipos(): Promise<TipoDocumentoResponse> {
        try {
            const tipos = await TipoDocumento.findAll()
            return { result: true, data: tipos }
        } catch (error) {
            // const msg = `Error al obtener los tipos de documentos: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async getTiposPorCategoria(categoria: string): Promise<TipoDocumentoResponse> {
        try {
            let tipos = null
            if (categoria == 'persona') {
                tipos = await TipoDocumento.findAll({
                    where: {
                        "en_persona": true,
                        "en_empresa": false,
                        "estado": true
                    }
                })
            } else {
                tipos = await TipoDocumento.findAll({
                    where: {
                        "en_empresa": true,
                        "en_persona": false,
                        "estado": true
                    }
                })
            }
            
            return { result: true, data: tipos }
        } catch (error) {
            // const msg = `Error al obtener los tipos de documentos: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async getTipoById(id: number): Promise<TipoDocumentoResponse> {
        try {
            const tipo = await TipoDocumento.findByPk(id)
            if (!tipo) {
                return { result: false, error: 'Tipo de documento no encontrado' }
            }
            return { result: true, data: tipo }
        } catch (error) {
            // const msg = `Error al obtener el tipo: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async createTipo(data: ITipoDocumento): Promise<TipoDocumentoResponse> {
        try {
            data.nombre_url = HString.convertToUrlString(data.nombre as String)
            const newTipo = await TipoDocumento.create(data as any)
            return { result: true, data: newTipo }
        } catch (error) {
            // const msg = `Error al crear el tipo de documento: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async updateTipo(id: number, data: ITipoDocumento): Promise<TipoDocumentoResponse> {
        try {
            data.nombre_url = HString.convertToUrlString(data.nombre as String)
            const tipo = await TipoDocumento.findByPk(id)
            if (!tipo) {
                return { result: false, error: 'Tipo de documento no encontrado' }
            }
            const updatedTipo = await tipo.update(data)
            return { result: true, data: updatedTipo }
        } catch (error) {
            // const msg = `Error al actualizar el tipo de documento: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async deleteTipo(id: number): Promise<TipoDocumentoResponse> {
        try {
            const tipo = await TipoDocumento.findByPk(id);
            if (!tipo) {
                return { result: false, error: 'Tipo de documento no encontrado' };
            }
            await tipo.destroy();
            return { result: true, data: { id } };
        } catch (error) {
            // const msg = `Error al eliminar el tipo: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg };
        }
    }
}

export default new TipoDocumentoService() 