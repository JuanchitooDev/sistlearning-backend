import { EOrigen, IPersona, PersonaResponse } from "../interfaces/personaInterface";
import { ITipoDocumento } from "../interfaces/tipoDocumentoInterface";
import PersonaService from "../services/persona.service"
import TipoDocumentoService from "../services/tipoDocumento.service"
import { API_DNI, API_CEE } from "../helpers/HApi"
import dotenv from 'dotenv';
import axios from "axios";
import HString from "../helpers/HString";

class DocumentoRepository {
    async getInfo(idTipoDocumento: number, numeroDocumento: string): Promise<PersonaResponse> {
        try {
            let urlApiDoc = ""

            // Verificando si existe una persona
            const dataPersona = await PersonaService.getPersonaPorIdTipoDocAndNumDoc(idTipoDocumento, numeroDocumento)
            const getTipoDocumento = await TipoDocumentoService.getTipoPorId(idTipoDocumento);
            const dataTipoDocumento = getTipoDocumento.data as ITipoDocumento
            const { abreviatura } = dataTipoDocumento

            console.log('dataPersona', dataPersona)

            console.log('dataTipoDocumento', dataTipoDocumento)

            const { result, data, status } = dataPersona

            if (!result) {

                urlApiDoc = (abreviatura === 'DNI')
                    ? `${API_DNI}${numeroDocumento}`
                    : `${API_CEE}${numeroDocumento}`

                // Determina el ambiente
                const env = process.env.NODE_ENV || 'development'

                dotenv.config({ path: `.env.${env}` })

                const token = process.env.TOKEN_API_DOCS

                const response = await axios.get(`${urlApiDoc}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                console.log('response api', response)

                // Comprobando si la respuesta es exitosa
                if (response.data.success) {
                    const data = response.data.data

                    const {
                        numero,
                        nombres,
                        apellido_paterno,
                        apellido_materno,
                        nombre_completo,
                        departamento,
                        provincia,
                        distrito,
                        direccion,
                        direccion_completa,
                        ubigeo_reniec,
                        ubigeo_sunat,
                        ubigeo,
                        fecha_nacimiento,
                        estado_civil,
                        foto,
                        sexo
                    } = data

                    const persona: IPersona = {
                        id_tipodocumento: idTipoDocumento,
                        numero: HString.validateField(numero),
                        nombres: HString.validateField(nombres),
                        apellido_paterno: HString.validateField(apellido_paterno),
                        apellido_materno: HString.validateField(apellido_materno),
                        nombre_completo: HString.validateField(nombre_completo),
                        departamento: HString.validateField(departamento),
                        provincia: HString.validateField(provincia),
                        distrito: HString.validateField(distrito),
                        direccion: HString.validateField(direccion),
                        direccion_completa: HString.validateField(direccion_completa),
                        ubigeo_reniec: HString.validateField(ubigeo_reniec),
                        ubigeo_sunat: HString.validateField(ubigeo_sunat),
                        ubigeo: HString.validateUbigeo(ubigeo),
                        fecha_nacimiento: HString.validateField(fecha_nacimiento),
                        estado_civil: HString.validateField(estado_civil),
                        foto: HString.validateField(foto),
                        sexo: HString.validateField(sexo),
                        origen: EOrigen.API,
                        estado: true
                    }

                    const createPersona = await PersonaService.createPersona(persona)

                    console.log('createPersona', createPersona)

                    // return createPersona
                    if (createPersona.result) {
                        return { result: createPersona.result, data: createPersona.data, message: createPersona.message, status: createPersona.status }
                    } else {
                        return { result: createPersona.result, error: createPersona.error, status: createPersona.status }
                    }
                } else {
                    return { result: response.data.success, message: response.data.message, data: response.data.data, status: response.data.status }
                }
            } else {
                return { result, data, status }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            console.log('errorMessage getInfo API', errorMessage)

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