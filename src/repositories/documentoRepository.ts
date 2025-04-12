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
            const dataPersona = await PersonaService.getPersonaPorIdTipoDocAndNumDoc(idTipoDocumento, numeroDocumento)

            const getTipoDocumento = await TipoDocumentoService.getTipoPorId(idTipoDocumento);
            const dataTipoDocumento = getTipoDocumento.data as ITipoDocumento
            const { abreviatura } = dataTipoDocumento

            if (!dataPersona.result) {
                if (abreviatura === 'DNI') {
                    urlApiDoc = `${API_DNI}${numeroDocumento}`
                } else {
                    urlApiDoc = `${API_CEE}${numeroDocumento}`
                }

                // Determina el ambiente
                const env = process.env.NODE_ENV || 'development'

                dotenv.config({ path: `.env.${env}` })

                const token = process.env.TOKEN_API_DOCS

                const response = await axios.get(`${urlApiDoc}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                // Comprobando si la respuesta es exitosa
                if (response.data.success) {
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

                    return createPersona
                }
            } else {
                return dataPersona
            }
            return { result: false, error: 'No se puede obtener la información del documento' }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage }
        }
    }
}

export default new DocumentoRepository()