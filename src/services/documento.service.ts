import axios from 'axios'
import { API_DNI, API_CEE } from '../helpers/HApi'
import tipoDocumentoService from './tipoDocumento.service'
import { ITipoDocumento } from '../interfaces/tipoDocumentoInterface'
import dotenv from 'dotenv'
import personaService from './persona.service'
import { IPersona, PersonaResponse } from '../interfaces/personaInterface'
import HString from '../helpers/HString'

class DocumentoService {
    async getDocumentoInfo(idTipoDocumento: number, numeroDocumento: string): Promise<PersonaResponse> {
        try {
            let urlApiDoc = ""

            // Verificando si existe una persona
            const dataPersona = await personaService.getPersonaByIdTipoDocAndNumDoc(idTipoDocumento, numeroDocumento)
            console.log('dataPersona', dataPersona)

            const getTipoDocumento = await tipoDocumentoService.getTipoById(idTipoDocumento);
            const dataTipoDocumento = getTipoDocumento.data as ITipoDocumento
            const { abreviatura } = dataTipoDocumento
        
            if (!dataPersona.result) {
                if ( abreviatura === 'DNI' ) {
                    urlApiDoc = `${API_DNI}${numeroDocumento}`
                } else {
                    urlApiDoc = `${API_CEE}${numeroDocumento}`
                }

                // Determina el ambiente
                const env = process.env.NODE_ENV || 'local'

                console.log('env', env)

                console.log('urlApiDoc', urlApiDoc)

                dotenv.config({ path: `.env.${env}` })

                const token = process.env.TOKEN_API_DOCS

                const response = await axios.get(`${urlApiDoc}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                // console.log('response urlApiDoc', response)

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
                        fecha_nacimiento: data.fecha_nacimiento,
                        estado_civil: HString.validateField(data.estado_civil),
                        foto: HString.validateField(data.foto),
                        sexo: HString.validateField(data.sexo),
                        origen: 'API',
                        estado: true
                    }

                    console.log('IPersona', persona)

                    const createPersona = await personaService.createPersona(persona)

                    return createPersona
                }
            } else {
                return dataPersona
            }
            return { result: false, error: 'No se puede obtener la información del documento' }
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: msg }
        }
    }
}

export default new DocumentoService()