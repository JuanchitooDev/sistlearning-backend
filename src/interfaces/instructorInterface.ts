import { ITipoDocumento } from './tipoDocumentoInterface'
import { IPais } from './paisInterface'

export interface IInstructor {
    id?: number
    id_tipodocumento?: number
    id_pais?: number
    numero_documento?: string
    apellido_paterno?: string
    apellido_materno?: string
    nombres?: string
    nombre_capitalized?: string
    telefono?: string
    direccion?: string
    email?: string
    fecha_nacimiento?: string
    sexo?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
    tipoDocumento?: ITipoDocumento
    pais?: IPais
}

export interface InstructorResponse {
    result: boolean
    message?: string
    data?: IInstructor | IInstructor[]
    error?: string
    status?: number
}