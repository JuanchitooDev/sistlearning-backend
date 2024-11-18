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
        
            console.log('abreviatura', abreviatura)

            if (!dataPersona.result) {
                console.log('dataPersona es falso')
                if ( abreviatura === 'DNI' ) {
                    urlApiDoc = `${API_DNI}${numeroDocumento}`
                } else {
                    urlApiDoc = `${API_CEE}${numeroDocumento}`
                }

                console.log('urlApiDoc', urlApiDoc)

                // Determina el ambiente
                const env = process.env.NODE_ENV || 'development'

                dotenv.config({ path: `.env.${env}` })

                const token = process.env.TOKEN_API_DOCS

                const response = await axios.get(`${urlApiDoc}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                console.log('env', env, 'token', token, 'response api reniec', response)

                // Comprobando si la respuesta es exitosa
                if (response.data.success) {
                    console.log('consulta api exitosa')
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
                        origen: 'API',
                        estado: true
                    }

                    const createPersona = await personaService.createPersona(persona)

                    return createPersona
                }
            } else {
                return dataPersona
            }
            return { result: false, error: 'No se puede obtener la información del documento' }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            console.log('errorMessage getDocumentoInfo', errorMessage)
            return { result: false, error: errorMessage }
        }
    }
}

export default new DocumentoService()