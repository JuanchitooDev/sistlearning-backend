import { ITipoDocumento } from "./tipoDocumentoInterface"

export interface IPersona {
    id?: number
    id_tipodocumento?: number
    numero?: string
    nombres?: string
    apellido_paterno?: string
    apellido_materno?: string
    nombre_completo?: string
    departamento?: string
    provincia?: string
    distrito?: string
    direccion?: string
    direccion_completa?: string
    ubigeo_reniec?: string
    ubigeo_sunat?: string
    ubigeo?: string
    fecha_nacimiento?: string
    estado_civil?: string
    foto?: string
    sexo?: string
    origen?: string
    estado?: boolean
    tipoDocumento?: ITipoDocumento
}

export interface PersonaResponse {
    result: boolean
    message?: string
    data?: IPersona | IPersona[],
    error?: string
}