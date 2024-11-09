import { ITipoDocumento } from "./tipoDocumentoInterface"

export interface IAlumno {
    id?: number
    id_tipodocumento?: number
    id_pais?: number
    id_departamento?: number
    numero_documento?: string
    apellido_paterno?: string
    apellido_materno?: string
    nombres?: string
    nombre_capitalized?: string
    telefono?: string
    direccion?: string
    email?: string
    fecha_nacimiento?: Date
    fecha_nacimiento_str?: string
    sexo?: string
    nombre_pais?: string
    nombre_departamento?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
    tipoDocumento?: ITipoDocumento
}

export interface AlumnoResponse {
    result: boolean,
    message?: string
    data?: IAlumno | IAlumno[]
    error?: string
}