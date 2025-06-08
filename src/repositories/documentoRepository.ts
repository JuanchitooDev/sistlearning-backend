import { EOrigen, IPersona, PersonaResponse } from "@/interfaces/personaInterface";
import { ITipoDocumento } from "@/interfaces/tipoDocumentoInterface";
import PersonaService from "@/services/persona.service"
import TipoDocumentoService from "@/services/tipoDocumento.service"
import { API_DNI, API_CEE } from "@/helpers/HApi"
import dotenv from 'dotenv';
import axios from "axios";
import HString from "@/helpers/HString";

class DocumentoRepository {
    async getInfo(idTipoDocumento: number, numeroDocumento: string): Promise<PersonaResponse> {
        try {
            let urlApiDoc = ""

            // Verificando si existe una persona
            // Obteniendo persona desde BD
            const dataPersona = await PersonaService.getPersonaPorIdTipoDocAndNumDoc(idTipoDocumento, numeroDocumento)
            // console.log('dataPersona', dataPersona)
            const getTipoDocumento = await TipoDocumentoService.getTipoPorId(idTipoDocumento);
            const dataTipoDocumento = getTipoDocumento.data as ITipoDocumento
            const { abreviatura } = dataTipoDocumento

            const { result, data, status } = dataPersona

            // console.log('dataPersona.result', dataPersona.result)

            if (!result) {

                urlApiDoc = (abreviatura === 'DNI')
                    ? `${API_DNI}${numeroDocumento}`
                    : `${API_CEE}${numeroDocumento}`

                // Determina el ambiente
                const env = process.env.NODE_ENV || 'development'

                dotenv.config({ path: `.env.${env}` })

                const token = process.env.TOKEN_API_DOCS

                // console.log('token API_DOC', token)

                // console.log('urlApiDoc', urlApiDoc)

                const response = await axios.get(`${urlApiDoc}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                // console.log('response urlApiDoc', response)

                // Comprobando si la respuesta es exitosa
                if (response.data.success) {
                    // console.log('response.data.success - true')
                    const data = response.data.data

                    const persona: IPersona = {
                        id_tipodocumento: idTipoDocumento,
                        numero: HString.validateField(data.numero),
                        nombres: HString.validateField(data.nombres),
                        apellido_paterno: HString.validateField(data.apellido_paterno),
                        apellido_materno: HString.validateField(data.apellido_materno),
                        nombre_completo: HString.validateField(data.nombre_completo),
                        departamento: HString.validateField(data.departamento),
                        provincia: HString.validateField(data.provincia),
                        distrito: HString.validateField(data.distrito),
                        direccion: HString.validateField(data.direccion),
                        direccion_completa: HString.validateField(data.direccion_completa),
                        ubigeo_reniec: HString.validateField(data.ubigeo_reniec),
                        ubigeo_sunat: HString.validateField(data.ubigeo_sunat),
                        ubigeo: HString.validateUbigeo(data.ubigeo),
                        fecha_nacimiento: HString.validateField(data.fecha_nacimiento),
                        estado_civil: HString.validateField(data.estado_civil),
                        foto: HString.validateField(data.foto),
                        sexo: HString.validateField(data.sexo),
                        origen: EOrigen.API,
                        estado: true
                    }

                    const createPersona = await PersonaService.createPersona(persona)

                    // console.log('createPersona in PersonaService.createPersona', createPersona)

                    // return createPersona
                    if (createPersona.result) {
                        // console.log('createPersona.result - true')
                        return { result: createPersona.result, data: createPersona.data, message: createPersona.message, status: createPersona.status }
                    } else {
                        // console.log('createPersona.result - false')
                        return { result: createPersona.result, error: createPersona.error, status: createPersona.status }
                    }
                } else {
                    // console.log('response.data.success - false')
                    return { result: response.data.success, message: response.data.message, data: response.data.data, status: response.data.status }
                }
            } else {
                // return dataPersona
                // console.log('dataPersona.result - true')
                return { result, data, status }
            }
            // return { result: false, error: 'No se puede obtener la información del documento', status: 500 }
        } catch (error) {
            // console.log('error', error)

            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'

            if (errorMessage === 'Request failed with status code 404') {
                const message = `No se encontró información con el número de documento: ${numeroDocumento}`
                return { result: false, message, status: 404 }
            } else {
                return { result: false, error: errorMessage, status: 500 }
            }
        }
    }
}

export default new DocumentoRepository()